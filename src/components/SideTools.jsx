import React from "react";
import "../styles/sideTools.css";
import { useNavigate } from "react-router-dom";

const SideTools = ({ isSidebarOpen, setCurrentView }) => {

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth/logout", {
        method: "POST",
        credentials: "include", // Para enviar cookies
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("logoutMessage", JSON.stringify({ text: data.msg, type: "successful" })); // Guardar mensaje
        navigate("/"); 
      } else {
        localStorage.setItem("logoutMessage", JSON.stringify({ text: "Logout failed", type: "error" }));
        navigate("/");
      }
    } catch (error) {
      localStorage.setItem("logoutMessage", JSON.stringify({ text: "Error during logout", type: "error" }));
      console.error("Error during logout:", error);
      navigate("/");
    }
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
      <button className="sidebar-btn logout" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default SideTools;