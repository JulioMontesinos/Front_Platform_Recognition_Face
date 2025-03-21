import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/home.css";

const Home = () => {
  const navigate = useNavigate();
  const BACK_URL = import.meta.env.VITE_BACK_URL || "http://localhost:5000";

  const [showWebcam, setShowWebcam] = useState(false);
  const [randomParam, setRandomParam] = useState(Date.now());
  const [image, setImage] = useState(null);
  const [emotion, setEmotion] = useState("");
  const [dragging, setDragging] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);

  const handleLogout = async () => {
    try {
      await axios.post(`${BACK_URL}/api/auth/logout`, {}, { withCredentials: true });
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const toggleWebcam = () => {
    if (showWebcam) {
      setShowWebcam(false);
      try {
        fetch("http://127.0.0.1:5001/stop_webcam", { method: "POST" });
      } catch (error) {
        console.error("Error stopping webcam:", error);
      }
    } else {
      setRandomParam(Date.now());
      setShowWebcam(true);
    }
  };

  const processImage = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("http://127.0.0.1:5001/analyze-image", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.error) {
        console.error("Error from server:", data.error);
      } else {
        setEmotion(data.emotion);
      }
      setImage(URL.createObjectURL(file));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    processImage(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setFileToUpload(file);
      setShowConfirm(true);
    }
  };

  const confirmProcessing = () => {
    processImage(fileToUpload);
    setShowConfirm(false);
  };

  return (
    <div 
      className={`home-container ${dragging ? "dragging" : ""}`} 
      onDragOver={handleDragOver} 
      onDragLeave={handleDragLeave} 
      onDrop={handleDrop}
    >
      {dragging && <div className="drop-overlay"><span>+</span></div>}

     {  <button className="logout-btn" onClick={handleLogout}>Logout</button> }

{       <div className="llm-container">
        <h2>Facial Emotion Detection</h2>

        <div className="drop-zone">
          <p>Drop an image here</p>
          <input type="file" className="file-input" onChange={handleFileChange} />
          {image && <img src={image} alt="Uploaded" className="uploaded-img" />}
        </div>

        {emotion && <p className="emotion-text">Detected Emotion: {emotion}</p>}

        <button className="btn webcam-btn" onClick={toggleWebcam}>
          {showWebcam ? "Stop Webcam" : "Enable Live Detection"}
        </button>

        {showWebcam && (
          <div className="webcam-container">
            <img src={`http://127.0.0.1:5001/video_feed?t=${randomParam}`} alt="Webcam Stream" />
          </div>
        )}
      </div> }

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Do you want to process this image?</p>
            <div className="modal-buttons">
              <button className="btn confirm-btn" onClick={confirmProcessing}>Yes</button>
              <button className="btn cancel-btn" onClick={() => setShowConfirm(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
 