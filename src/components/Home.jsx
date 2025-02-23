import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
    const navigate = useNavigate();
    const BACK_URL = import.meta.env.VITE_BACK_URL || "http://localhost:5000";

    const handleLogout = async () => {
        try {
            await axios.post(`${BACK_URL}/api/auth/logout`, {}, { withCredentials: true });
            navigate("/");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <div className="home-container">
            <h1>Welcome to the Home Page</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Home;