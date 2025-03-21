import React, { useState, useEffect } from "react";
import "../styles/liveContent.css";

const LiveContent = ({ hiddenLive, isPaused, setIsPaused }) => {
  const [showWebcam, setShowWebcam] = useState(false);
  const [randomParam, setRandomParam] = useState(Date.now());
  const [emotion, setEmotion] = useState("");
  let intervalId = null;

  useEffect(() => {
    if (!hiddenLive && !isPaused) {
      setShowWebcam(true);
      setRandomParam(Date.now());
      startEmotionDetection();
    } else {
      setShowWebcam(false);
      stopWebcamAndDetection();
    }

    return () => stopWebcamAndDetection(); // Cleanup cuando se desmonta
  }, [hiddenLive, isPaused]); // Ahora también depende de isPaused

  const captureWebcamFrame = async () => {
  try {
    const response = await fetch("http://127.0.0.1:5001/capture-frame", { method: "GET" });
    if (!response.ok) throw new Error("Error fetching webcam frame");

    return await response.blob(); // Obtiene la imagen de la webcam como blob
  } catch (error) {
    console.error("Error capturing webcam frame:", error);
    return null;
  }
};

const startEmotionDetection = () => {
  let isProcessing = false; // 🚀 Flag para evitar peticiones simultáneas

  intervalId = setInterval(async () => {
    if (!hiddenLive && !isProcessing && !isPaused) {
      isProcessing = true; // 🛑 Bloquea nuevas peticiones hasta completar la actual

      try {
        const file = await captureWebcamFrame();
        if (!file) {
          isProcessing = false;
          return;
        }

        const formData = new FormData();
        formData.append("file", file, "webcam.jpg");

        const response = await fetch("http://127.0.0.1:5001/analyze-image", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Server error");
        }

        const data = await response.json();
        if (data.emotion) setEmotion(data.emotion);
      } catch (error) {
        console.error("Error fetching emotion:", error);
      }

      isProcessing = false; // ✅ Desbloquea la siguiente petición
    }
  }, 5000); // ⏳ Ahora analizamos cada 3 segundos en vez de 2
};

  const stopWebcamAndDetection = () => {
    clearInterval(intervalId); // Detener el intervalo
    fetch("http://127.0.0.1:5001/stop_webcam", { method: "POST" }).catch((error) => {
      console.error("Error stopping webcam:", error);
    });
  };

  return (
    <div className={`live-content ${hiddenLive ? "hidden" : ""}`}>
      {!isPaused ? (
        showWebcam && (
          <div className="webcam-container">
            <img src={`http://127.0.0.1:5001/video_feed?t=${randomParam}`} alt="Webcam Stream" />
          </div>
        )
      ) : (
        <div className="paused-overlay">
          <p>Webcam Paused</p>
          <button className="resume-button" onClick={() => setIsPaused(false)}>Resume camera</button>
        </div>
      )}
    </div>
  );
};

export default LiveContent;