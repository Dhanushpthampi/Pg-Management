import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import BackButton from "../../components/BackButton";
import {
  Phone, Mail, MapPin, Calendar, User, Home, CreditCard,
  FileText, AlertCircle, CheckCircle, Download
} from "lucide-react";

const TenantDetails = () => {
  const { id } = useParams();
  const [tenant, setTenant] = useState(null);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const { data } = await api.get(`/tenants/${id}`);
        setTenant(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTenant();
  }, [id]);

  if (!tenant) return <p>Loading...</p>;

  const StatCard = ({ title, amount }) => (
    <div className="stat-card">
      <div className="stat-title">{title}</div>
      <div className="stat-value">₹ {amount}</div>
    </div>
  );

  return (
    <div className="profile-container">
      <BackButton />

      {/* Header Card */}
      <div className="header-card">
        <div className="profile-header">
          <div className="avatar-placeholder">
            <User size={64} color="#aaa" />
          </div>
          <div className="profile-info">
            <div className="name-row">
              <h1>{tenant.name}</h1>
              <span className={`status-badge ${tenant.status}`}>{tenant.status}</span>
            </div>

            <div className="contact-grid">
              <div className="contact-item">
                <Phone size={16} /> <span>{tenant.phone}</span>
              </div>
              <div className="contact-item">
                <Mail size={16} /> <span>{tenant.email}</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} /> <span>{tenant.property?.name || "N/A"}</span>
              </div>
              <div className="contact-item">
                <Home size={16} /> <span>{tenant.room?.number || "?"}-{tenant.bed?.number || "?"}</span>
              </div>
              <div className="contact-item">
                <Calendar size={16} /> <span>Since {new Date(tenant.joiningDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button className="outline-btn">Payments</button>
            <button className="outline-btn">Checkout</button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        <StatCard title="Monthly Rent" amount={tenant.rentAmount} />
        <StatCard title="Security Deposit" amount={tenant.depositAmount} />
        <StatCard title="Pending Dues" amount={0} /> {/* Mocked for now */}
        <StatCard title="Total Paid" amount={0} /> {/* Mocked for now */}
      </div>

      {/* Details Grid */}
      <div className="details-grid">
        {/* Personal Details */}
        <div className="detail-card">
          <h3>Personal Details</h3>
          <div className="detail-row">
            <span className="label">Date of Birth</span>
            <span className="value">{tenant.dob ? new Date(tenant.dob).toLocaleDateString() : 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="label">Gender</span>
            <span className="value" style={{ textTransform: 'capitalize' }}>{tenant.gender}</span>
          </div>
          <div className="detail-row">
            <span className="label">Company/College</span>
            <span className="value">{tenant.workplaceName || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="label">Permanent Address</span>
            <span className="value">{tenant.permanentAddress || 'N/A'}</span>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="detail-card">
          <h3>Emergency Contact</h3>
          <div className="detail-row">
            <span className="label">Name</span>
            <span className="value">{tenant.guardianName || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="label">Phone</span>
            <span className="value">{tenant.guardianPhone || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="label">Relation</span>
            <span className="value">{tenant.emergencyContactRelation || 'N/A'}</span>
          </div>
        </div>

        {/* KYC Details */}
        <div className="detail-card">
          <h3>KYC Details</h3>
          <div className="detail-row">
            <span className="label">ID Type</span>
            <span className="value" style={{ textTransform: 'capitalize' }}>{tenant.idProofType || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="label">ID Number</span>
            <span className="value">{tenant.idProofNumber || 'N/A'}</span>
          </div>
          {tenant.idProofUrl && (
            <div className="detail-row" style={{ marginTop: 10 }}>
              <a href={`http://localhost:5000${tenant.idProofUrl}`} target="_blank" rel="noreferrer" className="link-btn">
                <Download size={14} /> View ID Proof
              </a>
            </div>
          )}
          {tenant.addressProofUrl && (
            <div className="detail-row" style={{ marginTop: 5 }}>
              <a href={`http://localhost:5000${tenant.addressProofUrl}`} target="_blank" rel="noreferrer" className="link-btn">
                <Download size={14} /> View Address Proof
              </a>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .profile-container { max-width: 1000px; margin: 0 auto; }
        .header-card { background: white; padding: 25px; border-radius: 12px; border: 1px solid #ddd; margin-bottom: 20px; }
        .profile-header { display: flex; gap: 20px; align-items: flex-start; }
        .avatar-placeholder { width: 100px; height: 100px; background: #f0f0f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .profile-info { flex: 1; }
        .name-row { display: flex; align-items: center; gap: 15px; margin-bottom: 10px; }
        .name-row h1 { margin: 0; font-size: 24px; }
        .status-badge { padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase; color: white; }
        .status-badge.active { background: #4CAF50; }
        .status-badge.vacated { background: #F44336; }
        .status-badge.on_notice { background: #FF9800; }
        
        .contact-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; color: #555; font-size: 14px; }
        .contact-item { display: flex; align-items: center; gap: 8px; }
        
        .header-actions { display: flex; gap: 10px; }
        .outline-btn { background: white; border: 1px solid #333; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px; }
        
        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 20px; }
        .stat-card { background: white; padding: 20px; border-radius: 12px; border: 1px solid #ddd; }
        .stat-title { color: #555; font-size: 14px; margin-bottom: 8px; }
        .stat-value { font-size: 24px; font-weight: bold; color: #333; }
        
        .details-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .detail-card { background: white; padding: 25px; border-radius: 12px; border: 1px solid #ddd; }
        .detail-card h3 { margin-top: 0; margin-bottom: 20px; font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
        .detail-row .label { color: #666; }
        .detail-row .value { font-weight: 500; color: #333; text-align: right; }
        
        .link-btn { display: flex; align-items: center; gap: 5px; color: #1976D2; text-decoration: none; font-size: 13px; }
      `}</style>
    </div>
  );
};

export default TenantDetails;
