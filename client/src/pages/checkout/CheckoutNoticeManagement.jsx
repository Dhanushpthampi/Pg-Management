import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import { Search } from "lucide-react";

const CheckoutNoticeManagement = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("raise-notice");
    const [tenants, setTenants] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredTenants, setFilteredTenants] = useState([]);

    useEffect(() => {
        fetchTenants();
    }, []);

    const fetchTenants = async () => {
        try {
            const { data } = await api.get("/tenants");
            setTenants(data);
            setFilteredTenants(data);
        } catch (error) {
            console.error("Failed to fetch tenants", error);
        }
    };

    useEffect(() => {
        if (searchQuery) {
            const filtered = tenants.filter(tenant =>
                tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tenant.phone.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredTenants(filtered);
        } else {
            setFilteredTenants(tenants);
        }
    }, [searchQuery, tenants]);

    const handleRaiseNotice = (tenantId) => {
        navigate(`/notice/${tenantId}`);
    };

    const handleProcessCheckout = (tenantId) => {
        navigate(`/checkout/${tenantId}/process`);
    };

    // Filter tenants based on active tab
    let displayTenants = activeTab === "raise-notice"
        ? filteredTenants.filter(t => t.status === "active")
        : filteredTenants.filter(t => t.status === "on_notice");

    // MOCK DATA INJECTION REMOVED per user request

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ marginBottom: 30 }}>
                <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
                    Tenant Checkout & Notice Management
                </h1>
                <p style={{ color: "var(--secondary)", fontSize: 14 }}>
                    Manage tenant exits and notices
                </p>
            </div>

            {/* Tab Navigation (Segmented Look) */}
            <div className="tab-container">
                <button
                    className={`tab-btn ${activeTab === "raise-notice" ? "active" : ""}`}
                    onClick={() => setActiveTab("raise-notice")}
                >
                    Raise Notice
                </button>
                <button
                    className={`tab-btn ${activeTab === "pending-checkouts" ? "active" : ""}`}
                    onClick={() => setActiveTab("pending-checkouts")}
                >
                    Pending Checkouts
                </button>
            </div>

            {/* Search Bar */}
            <div className="search-container">
                <Search size={18} className="search-icon-custom" />
                <input
                    type="text"
                    placeholder="Search tenant by name or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input-custom"
                />
            </div>

            {/* Table */}
            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        {activeTab === "raise-notice" ? (
                            <tr>
                                <th>Tenant Name</th>
                                <th>Phone Number</th>
                                <th>PG Name</th>
                                <th>Room No</th>
                                <th>Status</th>
                                <th>Action Available</th>
                            </tr>
                        ) : (
                            <tr>
                                <th>Tenant Name</th>
                                <th>PG Name</th>
                                <th>Expected Checkout Date</th>
                                <th>Dues Status</th>
                                <th>Deposit Amount</th>
                                <th>Action</th>
                            </tr>
                        )}
                    </thead>
                    <tbody>
                        {displayTenants.map((tenant) => (
                            <tr key={tenant._id}>
                                <td style={{ fontWeight: 500 }}>{tenant.name}</td>

                                {activeTab === "raise-notice" ? (
                                    <>
                                        <td>{tenant.phone}</td>
                                        <td>{tenant.property?.name || "N/A"}</td>
                                        <td>
                                            {tenant.block?.name ? `${tenant.block.name}-` : ""}{tenant.room?.number || "101"}-{tenant.bed?.number || "A"}
                                        </td>
                                        <td>
                                            <span className={`badge ${tenant.status === "active" ? "success" : "warning"}`}>
                                                {tenant.status === "active" ? "Active" : "On Notice"}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-primary"
                                                style={{ padding: "6px 12px", fontSize: 13 }}
                                                onClick={() => handleRaiseNotice(tenant._id)}
                                            >
                                                Raise Notice
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{tenant.property?.name || "N/A"}</td>
                                        <td>
                                            {tenant.vacatingDate
                                                ? new Date(tenant.vacatingDate).toLocaleDateString("en-GB", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })
                                                : "Not Set"}
                                        </td>
                                        <td>
                                            <span className="badge neutral" style={{ background: 'none', border: 'none', padding: 0, color: 'inherit' }}>No Dues</span>
                                        </td>
                                        <td style={{ fontWeight: 500 }}>₹{tenant.depositAmount?.toLocaleString("en-IN") || "0"}</td>
                                        <td>
                                            <button
                                                className="btn btn-secondary" // Changed style to match wireframe ghost button look usually or explicit action
                                                style={{ padding: "6px 12px", fontSize: 13, border: '1px solid #ddd' }}
                                                onClick={() => handleProcessCheckout(tenant._id)}
                                            >
                                                Process Checkout
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                        {displayTenants.length === 0 && (
                            <tr>
                                <td
                                    colSpan={activeTab === "raise-notice" ? 6 : 6}
                                    style={{ textAlign: "center", padding: 30, color: "var(--secondary)" }}
                                >
                                    No tenants found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <style>{`
        .tab-container {
          display: inline-flex;
          background: #f0f0f0;
          padding: 4px;
          border-radius: 8px;
          margin-bottom: 24px;
          /* Removed bottom border */
        }
        .tab-btn {
          padding: 8px 16px;
          border: none;
          background: transparent;
          color: #666;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
        }
        .tab-btn.active {
          background: white;
          color: black;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .search-container {
          position: relative;
          margin-bottom: 24px;
          width: 100%;
        }
        .search-icon-custom {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }
        .search-input-custom {
          width: 100%;
          padding: 12px 12px 12px 45px;
          border: 1px solid var(--border-color);
          border-radius: 20px; /* Rounded search bar like wireframe */
          font-size: 14px;
        }
        .search-input-custom:focus {
          outline: none;
          border-color: var(--primary);
        }
        
        @media (max-width: 768px) {
          .tab-container { width: 100%; display: flex; }
          .tab-btn { flex: 1; text-align: center; }
        }
      `}</style>
        </div>
    );
};


export default CheckoutNoticeManagement;
