import { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    // Start: Verify token with backend
                    // Note: We need to set the token in axios headers first, but axios interceptor handles that dynamically if we set it in localStorage. 
                    // However, we haven't set up the interceptor yet. 
                    // Ideally, we should set the header manually here or wait for interceptor setup.
                    // For now, let's assume the interceptor will pick it up or we just decode locally if we wanted simpler approach. 
                    // But validating via API is safer.

                    // Actually, let's setup the interceptor first or assume it works.
                    // To be safe, let's just make the call. If interceptor isn't there, it might fail.

                    // Let's decode or just trust presence for initial render? 
                    // Better to fetch /api/auth/me

                    // Since axios interceptor is yet to be modified, let's rely on localStorage persistence for initial state 
                    // and fetch user if token exists. But we need to make sure the token is sent.
                    // The axios instance is imported. We can modify its defaults.
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    const { data } = await api.get("/auth/me");
                    setUser({ ...data, token });
                } catch (err) {
                    console.error("Token verification failed", err);
                    localStorage.removeItem("token");
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        setUser(data);
    };

    const logout = () => {
        localStorage.removeItem("token");
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
