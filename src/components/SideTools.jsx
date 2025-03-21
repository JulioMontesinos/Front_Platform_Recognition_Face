import React from "react";
import "../styles/home2.css";

const SideTools = ({ isSidebarOpen, setCurrentView }) => {
  return (
    <div className={`sidebar ${isSidebarOpen ? "visible" : ""}`}>
      <h3>Menú Lateral</h3>
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
      <button className="sidebar-btn">Opción 3</button>
      <button className="sidebar-btn danger">Eliminar Todo</button>
    </div>
  );
};

export default SideTools;