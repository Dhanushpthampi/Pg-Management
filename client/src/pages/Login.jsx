import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            backgroundColor: "#f5f5f5"
        }}>
            <div style={{
                background: "white",
                padding: "40px",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                width: "100%",
                maxWidth: "400px"
            }}>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login to GullyPG</h2>
                {error && <div style={{ color: "red", marginBottom: "15px", textAlign: "center" }}>{error}</div>}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <div>
                        <label style={{ display: "block", marginBottom: "5px", color: "#666" }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd" }}
                        />
                    </div>
                    <div>
                        <label style={{ display: "block", marginBottom: "5px", color: "#666" }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd" }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: "12px", marginTop: "10px" }}>
                        Login
                    </button>
                </form>
                <div style={{ marginTop: "20px", textAlign: "center", fontSize: "12px", color: "#999" }}>
                    Default Admin: admin@gullypg.com / admin123
                </div>
            </div>
        </div>
    );
};

export default Login;
