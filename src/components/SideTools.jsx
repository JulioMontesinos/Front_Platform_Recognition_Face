import React from "react";
import "../styles/sideTools.css";
import { useNavigate } from "react-router-dom";
import RestartButton from "./RestartButton";


const SideTools = ({ isSidebarOpen, setCurrentView, setMessage }) => {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.setItem("logoutMessage", JSON.stringify({ text: "Logged out successfully", type: "successful" }));
    navigate("/");
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? "visible" : ""}`}>
      <h3>Side Menu</h3>
      <button 
        className="sidebar-btn"
        onClick={() => setCurrentView("upload")}
      >
        Upload Image
      </button>
      <button
        className="sidebar-btn"
        onClick={() => setCurrentView("live")}
      >
        Live Webcam
      </button>
      <button className="sidebar-btn logout" onClick={logout}>Logout</button>
      <RestartButton setMessage={setMessage} />
    </div>
  );
};

export default SideTools;