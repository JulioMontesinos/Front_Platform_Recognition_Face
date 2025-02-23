import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axios.get("http://localhost:5000/api/auth/profile", {
                    withCredentials: true, // 🔥 Enviar cookies al backend
                });
                setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

    if (isAuthenticated === null) return <div>Loading...</div>; // Mientras se verifica el token

    return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;