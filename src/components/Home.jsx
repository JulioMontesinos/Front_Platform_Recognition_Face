import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
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