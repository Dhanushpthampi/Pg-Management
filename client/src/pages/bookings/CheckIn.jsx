import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axios";
import BackButton from "../../components/BackButton";
import {
  User, FileText, CheckCircle, Upload, ArrowRight, ArrowLeft,
  CreditCard, Home, Calendar
} from "lucide-react";

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const STEPS = [
  { id: 1, label: "Mobile Number", icon: <User size={18} /> },
  { id: 2, label: "Personal Information", icon: <User size={18} /> },
  { id: 3, label: "Documents", icon: <FileText size={18} /> },
  { id: 4, label: "Check-in", icon: <CheckCircle size={18} /> },
];

const CheckIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Data State
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [properties, setProperties] = useState([]);

  // Hierarchy Data
  const [availableBeds, setAvailableBeds] = useState([]); // All available beds with metadata
  const [blocks, setBlocks] = useState([]); // Unique blocks
  const [floors, setFloors] = useState([]); // Unique floors
  const [rooms, setRooms] = useState([]); // All rooms

  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");

  const [filteredFloors, setFilteredFloors] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [filteredBeds, setFilteredBeds] = useState([]);

  const [formData, setFormData] = useState({
    // Step 1
    phone: "",

    // Step 2
    name: "",
    email: "",
    gender: "male",
    dob: "",
    workplaceName: "",
    workplaceAddress: "",
    guardianName: "",
    guardianPhone: "", // Emergency Contact
    emergencyContactRelation: "",
    permanentAddress: "",

    // Step 3 (Files handled separately)
    idProofType: "aadhaar",
    idProofNumber: "",

    // Step 4
    property: "",
    bed: "",
    joiningDate: new Date().toISOString().split('T')[0],
    rentAmount: "",
    depositAmount: "",
    comments: "",
    checkInType: "Web",
  });

  const [files, setFiles] = useState({
    idProof: null,
    addressProof: null,
    addressPhoto: null,
  });

  // Populate from Booking if available
  useEffect(() => {
    if (location.state?.bookingData) {
      const { bookingData } = location.state;
      setFormData(prev => ({
        ...prev,
        name: bookingData.name || "",
        phone: bookingData.phone || "",
        email: bookingData.email || "",
        joiningDate: bookingData.joiningDate ? new Date(bookingData.joiningDate).toISOString().split('T')[0] : prev.joiningDate,
        depositAmount: bookingData.depositAmount || "",
        property: bookingData.property || "",
        comments: bookingData.comments || "",
        checkInType: "Web" // Bookings are usually web/online
      }));
    }
  }, [location.state]);

  // Fetch properties on mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data } = await api.get("/properties");
        setProperties(data);
      } catch (err) { console.error(err); }
    };
    fetchProperties();
  }, []);

  // Fetch hierarchy when property changes
  useEffect(() => {
    // Reset selection when property changes
    setSelectedBlock("");
    setSelectedFloor("");
    setSelectedRoom("");
    setFilteredBeds([]);
    setFilteredRooms([]);
    setFilteredFloors([]);
    setFormData(prev => ({ ...prev, bed: "" }));

    if (formData.property) {
      const fetchHierarchy = async () => {
        try {
          // Correct API endpoint
          const { data } = await api.get(`/hierarchy/properties/${formData.property}/hierarchy`);

          let bedsList = [];

          // Data Extraction
          // We need unique blocks, floors, and rooms with their hierarchy relationships
          let blocksMap = new Map();
          let floorsMap = new Map();
          let roomsMap = new Map();

          data.forEach(block => {
            blocksMap.set(block._id, { id: block._id, name: block.name });

            block.floors.forEach(floor => {
              // Only add floor if it has rooms with available beds (optimization) or just add all
              // Let's add all floors for now, relationship is Block -> Floor
              floorsMap.set(floor._id, { id: floor._id, name: floor.name, blockId: block._id });

              floor.rooms.forEach(room => {
                let hasAvailableBed = false;
                room.beds.forEach(bed => {
                  if (bed.status === "available") {
                    hasAvailableBed = true;
                    bedsList.push({
                      id: bed._id,
                      number: bed.number,
                      roomId: room._id,
                      roomNumber: room.number, // Room Number
                      label: `Bed: ${bed.number}`,
                      rent: room.rent || 0
                    });
                  }
                });

                if (hasAvailableBed) {
                  roomsMap.set(room._id, {
                    id: room._id,
                    label: room.number,
                    floorId: floor._id
                  });
                }
              });
            });
          });

          // If a floor has no rooms with available beds, should we hide it? 
          // For now, let's keep logic simple. If no room in filteredRooms, it will be empty.

          setBlocks(Array.from(blocksMap.values()));
          setFloors(Array.from(floorsMap.values()));
          setRooms(Array.from(roomsMap.values()));
          setAvailableBeds(bedsList);

        } catch (err) { console.error(err); }
      };
      fetchHierarchy();
    }
  }, [formData.property]);

  // Filter Floors when Block changes
  useEffect(() => {
    setSelectedFloor("");
    setSelectedRoom("");
    setFilteredRooms([]);
    setFilteredBeds([]);

    if (selectedBlock) {
      setFilteredFloors(floors.filter(f => f.blockId === selectedBlock));
    } else {
      setFilteredFloors([]);
    }
  }, [selectedBlock, floors]);

  // Filter Rooms when Floor changes
  useEffect(() => {
    setSelectedRoom("");
    setFilteredBeds([]);

    if (selectedFloor) {
      setFilteredRooms(rooms.filter(r => r.floorId === selectedFloor));
    } else {
      setFilteredRooms([]);
    }
  }, [selectedFloor, rooms]);

  // Filter Beds when Room changes
  useEffect(() => {
    if (selectedRoom) {
      const beds = availableBeds.filter(b => b.roomId === selectedRoom);
      setFilteredBeds(beds);
      // Assuming rent defaults to first bed's room rent, but user can edit
      if (beds.length > 0 && !formData.rentAmount) {
        setFormData(prev => ({ ...prev, rentAmount: beds[0].rent }));
      }
    } else {
      setFilteredBeds([]);
    }
  }, [selectedRoom, availableBeds]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  /* MOCK OTP IMPLEMENTATION FOR TESTING */
  const handleSendOtp = async () => {
    if (!formData.phone) return;

    // Simulate API call delay
    setTimeout(() => {
      setOtpSent(true);
      alert("OTP Sent! (Test Mode: Use 123456)");
    }, 500);
  };

  const handleVerifyOtp = async () => {
    if (!otp) return;

    if (otp === "123456") {
      alert("Phone number verified! (Test Mode)");
      handleNext();
    } else {
      alert("Invalid OTP (Test Mode: Use 123456)");
    }
  };

  /* FIREBASE IMPLEMENTATION (Commented out for now)
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          handleSendOtp();
        }
      });
    }
  };

  const handleSendOtp = async () => {
    if (!formData.phone) return;

    // Clean phone number (remove spaces, etc) and format to E.164
    let phoneNumber = formData.phone.replace(/\s/g, '');
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = "+91" + phoneNumber;
    }

    console.log("Sending OTP to:", phoneNumber); // Debugging

    // Standard reCAPTCHA setup
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          handleSendOtp();
        }
      });
    }
    const appVerifier = window.recaptchaVerifier;

    try {
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmation;
      setConfirmationResult(confirmation);
      setOtpSent(true);
      alert("OTP sent successfully! (Check standard SMS or test code)");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP: " + error.message);

      // Safely reset reCAPTCHA
      if (window.recaptchaVerifier) {
        try {
          // Only clear if we really need to, but often better to just let it be or use reset()
          // window.recaptchaVerifier.clear(); 
          // grecaptcha.reset(window.recaptchaWidgetId); // If using widget ID

          // Simple DOM reset if widget is broken
          // document.getElementById('recaptcha-container').innerHTML = '';
          // window.recaptchaVerifier = null;
        } catch (e) {
          console.error("Error clearing recaptcha", e);
        }
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !confirmationResult) return;

    try {
      await confirmationResult.confirm(otp);
      alert("Phone number verified!");
      handleNext();
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Invalid OTP. Please try again.");
    }
  };
  */

  const handleNext = () => {
    // Basic validation per step could go here
    if (currentStep < 4) setCurrentStep(prev => prev + 1);

  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const submitForm = async () => {
    // Validate required fields
    if (!formData.property || !formData.bed) {
      alert("Please select a Property, Block, Floor, Room, and Bed.");
      return;
    }

    setLoading(true);
    try {
      const formPayload = new FormData();
      // Append all text fields
      Object.keys(formData).forEach(key => {
        formPayload.append(key, formData[key]);
      });

      // Append files
      if (files.idProof) formPayload.append("idProof", files.idProof);
      if (files.addressProof) formPayload.append("addressProof", files.addressProof);
      if (files.addressPhoto) formPayload.append("addressPhoto", files.addressPhoto);

      await api.post("/tenants", formPayload, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Check-in Successful!");
      navigate("/tenants");
    } catch (error) {
      console.error(error);
      alert("Check-in Failed: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkin-page">
      <BackButton />
      <h1>Tenant Check-In</h1>

      {/* Stepper */}
      <div className="stepper">
        {STEPS.map((step, index) => (
          <div key={step.id} className={`step-item ${currentStep >= step.id ? 'active' : ''} ${currentStep === step.id ? 'current' : ''}`}>
            <div className="step-circle">
              {currentStep > step.id ? <CheckCircle size={16} /> : step.id}
            </div>
            <span className="step-label">{step.label}</span>
            {index < STEPS.length - 1 && <div className="step-line" />}
          </div>
        ))}
      </div>

      <div className="step-content">
        {currentStep === 1 && (
          <div className="step-container">
            <h3>Allocate a bed/room to your tenant.</h3>
            <div className="form-group">
              <label>Mobile Number</label>
              <div className="phone-group">
                <div className="phone-prefix">🇮🇳 +91</div>
                <input
                  type="number"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    if (e.target.value.length <= 10) {
                      handleChange(e);
                    }
                  }}
                  placeholder="98765 43210"
                  style={{ flex: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                />
                <button type="button" className="secondary-btn" onClick={handleSendOtp} disabled={!formData.phone || formData.phone.length !== 10}>
                  {otpSent ? "Resend OTP" : "Get OTP"}
                </button>
              </div>
            </div>

            {otpSent && (
              <div className="form-group">
                <label>Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  style={{ letterSpacing: 5, textAlign: 'center', fontSize: 18 }}
                />
              </div>
            )}

            {otpSent && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                <button className="primary-btn" onClick={handleVerifyOtp} disabled={otp.length !== 6}>
                  Verify & Proceed <ArrowRight size={16} />
                </button>
              </div>
            )}
            <div id="recaptcha-container"></div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="step-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Company/College Name</label>
              <input name="workplaceName" value={formData.workplaceName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Company/College Address</label>
              <input name="workplaceAddress" value={formData.workplaceAddress} onChange={handleChange} />
            </div>
            <div className="form-group full-width">
              <label>Permanent Address</label>
              <textarea name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} rows={2} />
            </div>

            <h4 className="full-width" style={{ marginTop: 20, marginBottom: 10 }}>Emergency Contact</h4>
            <div className="form-group">
              <label>Name</label>
              <input name="guardianName" value={formData.guardianName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Relationship</label>
              <input name="emergencyContactRelation" value={formData.emergencyContactRelation} onChange={handleChange} placeholder="Father, Mother, etc." />
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <input name="guardianPhone" value={formData.guardianPhone} onChange={handleChange} placeholder="+91" />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="step-grid">
            <div className="form-group">
              <label>ID Type</label>
              <select name="idProofType" value={formData.idProofType} onChange={handleChange}>
                <option value="aadhaar">Aadhaar</option>
                <option value="pan">PAN</option>
                <option value="passport">Passport</option>
                <option value="driving_license">Driving License</option>
              </select>
            </div>
            <div className="form-group">
              <label>ID Number</label>
              <input name="idProofNumber" value={formData.idProofNumber} onChange={handleChange} />
            </div>

            <div className="form-group upload-group">
              <label>Upload ID Proof</label>
              <div className="upload-box">
                <Upload size={24} />
                <input type="file" name="idProof" onChange={handleFileChange} />
                <span>{files.idProof ? files.idProof.name : "Choose File"}</span>
              </div>
            </div>

            <div className="form-group upload-group">
              <label>Upload Address Proof</label>
              <div className="upload-box">
                <Upload size={24} />
                <input type="file" name="addressProof" onChange={handleFileChange} />
                <span>{files.addressProof ? files.addressProof.name : "Choose File"}</span>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="step-grid">
            <div className="form-group">
              <label>Check-in Date</label>
              <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Check-in Type</label>
              <select name="checkInType" value={formData.checkInType} onChange={handleChange}>
                <option value="Web">Web</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Referral">Referral</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Select Property</label>
              <select name="property" value={formData.property} onChange={handleChange}>
                <option value="">Select Property</option>
                {properties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Select Block</label>
              <select
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
                disabled={!formData.property}
              >
                <option value="">Select Block</option>
                {blocks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Select Floor</label>
              <select
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                disabled={!selectedBlock}
              >
                <option value="">Select Floor</option>
                {filteredFloors.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Select Room</label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                disabled={!selectedFloor}
              >
                <option value="">Select Room</option>
                {filteredRooms.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
              </select>
            </div>

            <div className="form-group full-width">
              <label>Select Bed</label>
              <select
                name="bed"
                value={formData.bed}
                onChange={handleChange}
                disabled={!selectedRoom}
              >
                <option value="">Select Bed</option>
                {filteredBeds.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Rent Amount (Base)</label>
              <input type="number" name="rentAmount" value={formData.rentAmount} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Deposit Amount</label>
              <input type="number" name="depositAmount" value={formData.depositAmount} onChange={handleChange} />
            </div>

            <div className="form-group full-width">
              <label>Comments (Optional)</label>
              <textarea name="comments" value={formData.comments} onChange={handleChange} rows={2} />
            </div>

            <div className="payment-summary full-width">
              <h4>Payment Summary</h4>
              <div className="summary-row"><span>Rent</span><span>{formData.rentAmount || 0}</span></div>
              <div className="summary-row"><span>Deposit</span><span>{formData.depositAmount || 0}</span></div>
              <hr />
              <div className="summary-row total"><span>Total Due</span><span>{(parseFloat(formData.rentAmount) || 0) + (parseFloat(formData.depositAmount) || 0)}</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons (Except Step 1 which has its own flow) */}
      {
        currentStep > 1 && (
          <div className="step-actions">
            <button className="secondary-btn" onClick={handleBack}>
              <ArrowLeft size={16} /> Back
            </button>
            {currentStep < 4 ? (
              <button className="primary-btn" onClick={handleNext}>
                Next <ArrowRight size={16} />
              </button>
            ) : (
              <button className="primary-btn submit-btn" onClick={submitForm} disabled={loading}>
                {loading ? "Checking In..." : "Check-in"}
              </button>
            )}
          </div>
        )
      }

      <style>{`
            .checkin-page { max-width: 900px; margin: 0 auto; color: #333; } /* Slightly wider */
            .stepper { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; }
            .step-item { display: flex; align-items: center; gap: 8px; position: relative; flex: 1; }
            .step-circle { width: 36px; height: 36px; border-radius: 50%; background: #eee; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #777; transition: 0.3s; z-index: 2; }
            .step-line { flex: 1; height: 2px; background: #eee; margin: 0 10px; transition: 0.3s; }
            .step-item.active .step-circle { background: #4CAF50; color: white; }
            .step-item.active .step-line { background: #4CAF50; }
            .step-item.current .step-circle { border: 2px solid #2E7D32; }
            
            .step-content { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); margin-bottom: 30px; }
            
            /* Step 1 tweaks */
            .step-container { max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
            .phone-group { display: flex; gap: 0; align-items: stretch; }
            .phone-prefix {
                 background: #eee;
                 border: 1px solid #e0e0e0;
                 border-right: none;
                 border-radius: 8px 0 0 8px;
                 padding: 0 16px;
                 display: flex;
                 align-items: center;
                 color: #555;
                 font-weight: 500;
            }
            .phone-group input { border-top-left-radius: 0; border-bottom-left-radius: 0; }
            .phone-group button { margin-left: 10px; }
            
            .phone-group { flex-direction: row; }
            
            @media (max-width: 768px) {
                .phone-group { flex-direction: row; flex-wrap: wrap; }
                .phone-group button { width: 100%; margin-left: 0; margin-top: 10px; }
            }
            /* Step 4 & General Form */
            .step-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px 30px; }
            .form-group { display: flex; flexDirection: column; gap: 8px; }
            .form-group.full-width { grid-column: span 2; }
            .form-group label { font-size: 14px; font-weight: 600; color: #444; margin-left: 2px; }
            
            /* Inputs */
            .form-group input, .form-group select, .form-group textarea { 
                padding: 12px 16px; 
                border: 1px solid #e0e0e0; 
                border-radius: 8px; 
                font-size: 15px; 
                outline: none; 
                width: 100%; 
                max-width: 100%; 
                box-sizing: border-box; 
                transition: all 0.2s;
                background: #fff;
            }
            .form-group input:focus, .form-group select:focus, .form-group textarea:focus { 
                border-color: #4CAF50; 
                box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1); 
            }
            
            /* Buttons */
            .step-actions { display: flex; justify-content: space-between; margin-top: 40px; border-top: 1px solid #eee; padding-top: 24px; }
            .primary-btn { background: #333; color: white; border: none; padding: 14px 28px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 15px; }
            .secondary-btn { background: white; border: 1px solid #ccc; color: #444; padding: 14px 28px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 15px; }
            .submit-btn { background: #4CAF50; }
            .submit-btn:hover { background: #43A047; }
            .secondary-btn:hover { background: #f5f5f5; }
            .primary-btn:disabled { background: #e0e0e0; cursor: not-allowed; color: #999; }

            .upload-box { border: 2px dashed #ddd; padding: 24px; border-radius: 8px; text-align: center; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 12px; color: #666; position: relative; background: #fafafa; transition: 0.2s; }
            .upload-box:hover { border-color: #4CAF50; background: #f0fdf4; }
            .upload-box input { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }

            /* Payment Summary - Clean & Centered */
            .payment-summary { 
                background: #f8f9fa; 
                padding: 30px; 
                border-radius: 12px; 
                border: 1px solid #eee; 
                margin: 30px auto 0; /* Center horizontally */
                max-width: 600px; /* Constrain width */
                text-align: center;
                            }
            .summary-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 15px; color: #555; }
            .summary-row.total { font-weight: 700; font-size: 20px; margin-top: 20px; color: #222; border-top: 1px solid #ddd; padding-top: 20px; }

            @media (max-width: 768px) {
              .step-grid { grid-template-columns: 1fr; gap: 20px; }
              .form-group.full-width { grid-column: span 1; }
              .step-content { padding: 20px; }
              .stepper { overflow-x: auto; padding-bottom: 10px; }
              .step-label { display: none; } 
              .step-item.active .step-label { display: block; font-size: 12px; white-space: nowrap; }
              .step-item { min-width: auto; flex: inherit; } 
              .step-line { display: none; } 
              .step-circle { width: 32px; height: 32px; font-size: 13px; }
              .stepper { justify-content: space-between; gap: 10px; }
              
              .phone-group { flex-direction: column; gap: 10px; }
              .phone-group button { width: 100%; padding: 12px; }
              
              .step-actions {
                 flex-direction: column-reverse; /* Stack buttons, Back on bottom */
                 gap: 15px;
                 border-top: none;
              }
              .step-actions button {
                 width: 100%;
                 justify-content: center;
              }
              
              .payment-summary {
                 padding: 20px;
              }
              .summary-row { max-width: 100%; }
            }
        `}</style>
    </div >
  );
};
export default CheckIn;