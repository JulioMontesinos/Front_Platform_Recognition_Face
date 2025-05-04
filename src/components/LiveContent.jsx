import React, { useState, useEffect, useRef } from "react";
import "../styles/liveContent.css";

const LiveContent = ({ hiddenLive, isPaused, setIsPaused }) => {
  const [showWebcam, setShowWebcam] = useState(false);
  const [randomParam, setRandomParam] = useState(Date.now());

  // Estado para ranking de emociones y para loading
  const [emotionRanking, setEmotionRanking] = useState([]);
  const [loadingRanking, setLoadingRanking] = useState(false);
  const [loadingDots, setLoadingDots] = useState("");

  // Refs para controlar el intervalo y el flag de procesamiento
  const intervalRef = useRef(null);
  const processingRef = useRef(false);

  // Efecto para animar los puntitos de cargando
  useEffect(() => {
    if (!loadingRanking) {
      setLoadingDots("");
      return;
    }
    let dotCount = 0;
    const dotsInterval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      setLoadingDots(".".repeat(dotCount));
    }, 500);
    return () => clearInterval(dotsInterval);
  }, [loadingRanking]);

  useEffect(() => {
    if (!hiddenLive && !isPaused) {
      setShowWebcam(true);
      setRandomParam(Date.now());
      // Empezamos con loading y limpiamos ranking previo
      setEmotionRanking([]);
      setLoadingRanking(true);
      startEmotionDetection();
    } else {
      setShowWebcam(false);
      stopWebcamAndDetection();
      setEmotionRanking([]);
      setLoadingRanking(false);
    }

    return () => {
      stopWebcamAndDetection();
      setEmotionRanking([]);
      setLoadingRanking(false);
    }; // Cleanup cuando se desmonta
  }, [hiddenLive, isPaused]);

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
  // Limpiamos cualquier intervalo previo
  clearInterval(intervalRef.current);

  intervalRef.current = setInterval(async () => {
    if (processingRef.current || hiddenLive || isPaused) return;
    processingRef.current = true;
    setLoadingRanking(true);

    try {
      const file = await captureWebcamFrame();
      if (file) {
        const formData = new FormData();
        formData.append("file", file, "webcam.jpg");
        formData.append("source", "live");

        const response = await fetch("http://127.0.0.1:5001/analyze-image", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "Server error");
        }

        const data = await response.json();
        if (Array.isArray(data.top_emotions)) {
          setEmotionRanking(data.top_emotions);
        }
      }
    } catch (error) {
      console.error("Error fetching emotion:", error);
    } finally {
      processingRef.current = false;
      setLoadingRanking(false);
    }
  }, 5000);
};

  const stopWebcamAndDetection = () => {
    clearInterval(intervalRef.current); // Detener el intervalo
    fetch("http://127.0.0.1:5001/stop_webcam", { method: "POST" }).catch((error) => {
      console.error("Error stopping webcam:", error);
    });
  };

  return (
    <div className={`live-content ${hiddenLive ? "hidden" : ""}`}>
      {!isPaused && showWebcam ? (
        <div className="webcam-container">
          <div className="video-wrapper">
            <img
              src={`http://127.0.0.1:5001/video_feed?t=${randomParam}`}
              alt="Webcam Stream"
              className="live-video"
            />

            {/* Overlay de ranking en esquina inferior derecha */}
            <div className="ranking-overlay">
              <p className="ranking-title">Top emotions</p>
              <ul>
                {loadingRanking ? (
                  <li>Loading{loadingDots}</li>
                ) : (
                  emotionRanking.map((emo, idx) => (
                    <li key={idx}>
                      {emo.name}: {parseFloat(emo.confidence).toFixed(1)}%
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        isPaused && (
          <div className="paused-overlay">
            <p>Webcam Paused</p>
            <button className="resume-button" onClick={() => setIsPaused(false)}>
              Resume camera
            </button>
          </div>
        )
      )}
    </div>
  );

};

export default LiveContent;