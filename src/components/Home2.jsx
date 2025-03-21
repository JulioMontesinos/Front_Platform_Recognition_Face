import React, { useState, useEffect } from "react";
import "../styles/home2.css"; // Importa el CSS con la estructura y estilos
import SideTools from "./SideTools";
import UploadContent from "./UploadContent";
import LiveContent from "./LiveContent";


const Home2 = () => {
  // Estado para mostrar u ocultar el sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("upload");
  const [isPaused, setIsPaused] = useState(false); // Estado para pausar la webcam

  const handleChangeView = (view) => {
    if (view !== currentView) {
      setCurrentView(view);
      setIsPaused(false);
    }
  };

  return (

    <div className={`home-container ${isSidebarOpen ? "editing" : ""}`}>
      <SideTools isSidebarOpen={isSidebarOpen} setCurrentView={handleChangeView} />

      <div className={currentView === 'upload' ? "screen-container" : "screen-container live"}>
        {/* Botón en esquina superior derecha para abrir/cerrar menú lateral */}


        {!isPaused && (<button className={`closeCamera-button ${currentView === 'live' ? 'visible' : 'hidden'}`} onClick={() => setIsPaused(true)}>
          Close camera
        </button>)}
        
        <button className="brush-button" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <img src="/edit.svg" alt="Edit" className="edit-icon" draggable="false" />
        </button>

        {currentView === "upload" && <h1 className="title-upload">Facial analysis in images</h1>}

        <UploadContent hiddenUpload={currentView !== "upload"} />
        <LiveContent hiddenLive={currentView !== "live"} isPaused={isPaused} setIsPaused={setIsPaused} />
      </div>
    </div>

  );
};

export default Home2;