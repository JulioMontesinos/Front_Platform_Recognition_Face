import React, { useState, useEffect } from "react";
import "../styles/home.css"; 
import SideTools from "./SideTools";
import UploadContent from "./UploadContent";
import LiveContent from "./LiveContent";
import SimpleMessageBar from "./SimpleMessageBar";


const Home = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("upload");
  const [isPaused, setIsPaused] = useState(false); // Estado para pausar la webcam
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChangeView = (view) => {
    if (view !== currentView) {
      setCurrentView(view);
      setIsPaused(false);
    }
  };

  return (

    <div className={`home-container ${isSidebarOpen ? "editing" : ""}`}>
      {message.text && (
        <SimpleMessageBar 
          message={message.text} 
          type={message.type} 
          duration={message.type === "error" ? 10000 : 2000} 
          onDismiss={() => setMessage({ text: "", type: "" })} 
        />
      )}
      <SideTools isSidebarOpen={isSidebarOpen} setCurrentView={handleChangeView} setMessage={setMessage} />

      <div className={currentView === 'upload' ? "screen-container" : "screen-container live"}>

      {!isPaused && (<button className={`closeCamera-button ${currentView === 'live' ? 'visible' : 'hidden'}`} onClick={() => setIsPaused(true)}>
        Close camera
      </button>)}
      
      <button className="brush-button" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <img src="/edit.svg" alt="Edit" className="edit-icon" draggable="false" />
      </button>

      {currentView === "upload" && <h1 className="title-upload">Facial analysis in images</h1>}

      <UploadContent hiddenUpload={currentView !== "upload"} setMessage={setMessage} />
      <LiveContent hiddenLive={currentView !== "live"} isPaused={isPaused} setIsPaused={setIsPaused} />
      </div>
    </div>

  );
};

export default Home;