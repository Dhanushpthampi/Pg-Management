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
    const displayTenants = activeTab === "raise-notice"
        ? filteredTenants.filter(t => t.status === "active")
        : filteredTenants.filter(t => t.status === "on_notice");

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

            {/* Tab Navigation */}
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
                        <tr>
                            <th>Tenant Name</th>
                            <th>Phone Number</th>
                            <th>PG Name</th>
                            <th>Room No</th>
                            {activeTab === "raise-notice" ? (
                                <>
                                    <th>Status</th>
                                    <th>Action Available</th>
                                </>
                            ) : (
                                <>
                                    <th>Expected Checkout</th>
                                    <th>Dues Status</th>
                                    <th>Deposit Amount</th>
                                    <th>Action</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {displayTenants.map((tenant) => (
                            <tr key={tenant._id}>
                                <td style={{ fontWeight: 500 }}>{tenant.name}</td>
                                <td>{tenant.phone}</td>
                                <td>{tenant.property?.name || "N/A"}</td>
                                <td>
                                    {tenant.block?.name || "B"}-{tenant.room?.number || "101"}-
                                    {tenant.bed?.number || "A"}
                                </td>
                                {activeTab === "raise-notice" ? (
                                    <>
                                        <td>
                                            <span className={`badge ${tenant.status === "active" ? "success" : "warning"}`}>
                                                {tenant.status === "active" ? "Active" : "On Notice"}
                                            </span>
                                        </td>
                                        <td>
                                            {tenant.status === "active" ? (
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ padding: "6px 12px", fontSize: 13 }}
                                                    onClick={() => handleRaiseNotice(tenant._id)}
                                                >
                                                    Raise Notice
                                                </button>
                                            ) : (
                                                <span style={{ color: "var(--secondary)" }}>—</span>
                                            )}
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>
                                            {tenant.vacatingDate
                                                ? new Date(tenant.vacatingDate).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })
                                                : "Not Set"}
                                        </td>
                                        <td>
                                            <span className="badge neutral">No Dues</span>
                                        </td>
                                        <td>₹{tenant.depositAmount?.toLocaleString("en-IN") || "0"}</td>
                                        <td>
                                            <button
                                                className="btn btn-primary"
                                                style={{ padding: "6px 12px", fontSize: 13 }}
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
                                    colSpan={activeTab === "raise-notice" ? 6 : 7}
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
          display: flex;
          gap: 0;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border-color);
        }
        .tab-btn {
          padding: 12px 24px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: var(--secondary);
          transition: all 0.2s;
        }
        .tab-btn:hover {
          color: var(--primary);
        }
        .tab-btn.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }
        .search-container {
          position: relative;
          margin-bottom: 24px;
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
          border-radius: var(--radius);
          font-size: 14px;
        }
        .search-input-custom:focus {
          outline: none;
          border-color: var(--primary);
        }
      `}</style>
        </div>
    );
};

export default CheckoutNoticeManagement;
