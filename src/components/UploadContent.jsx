import React, { useState, useRef, useEffect  } from "react";
import "../styles/uploadContent.css"; 

const UploadContent = ({hiddenUpload, setMessage}) => {
  const [dragging, setDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const loadingInterval = useRef(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [image, setImage] = useState(null);
  const [emotion, setEmotion] = useState("");
  const [otherEmotions, setOtherEmotions] = useState([]);
  const [confidence, setConfidence] = useState("");

  // Estados y refs para cargar el modelo y animar dots
  const [modelLoaded, setModelLoaded] = useState(false);
  const pingInterval = useRef(null);
  const dotsInterval = useRef(null);

  // Al montar, hacemos ping a server.py hasta que responda => modelo listo
  useEffect(() => {
    // Arranca animación de puntos
    let dotCount = 0;
    dotsInterval.current = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      setMessage({ text: `Loading model${".".repeat(dotCount)}`, type: "loading" });
    }, 500);

    // Ping al /ping
    pingInterval.current = setInterval(async () => {
      try {
        const res = await fetch("http://127.0.0.1:5001/ping");
        if (res.ok) {
          // Modelo listo
          clearInterval(pingInterval.current);
          clearInterval(dotsInterval.current);
          setModelLoaded(true);
          setMessage({ text: "Model loaded", type: "successful" });
          // Limpia el mensaje tras 2s
          setTimeout(() => setMessage({ text: "", type: "" }), 2000);
        }
      } catch {
        // sigue intentando…
      }
    }, 1000);

    return () => {
      clearInterval(pingInterval.current);
      clearInterval(dotsInterval.current);
    };
  }, [setMessage]);

  // Llamada al backend para analizar la imagen
  const processImage = async (file) => {
    if (!file) return;
    if (!modelLoaded) {
      setMessage({ text: "Model not ready", type: "error" });
      return;
    }

  // Para poner el mensaje de "Cargando" animado
  let dotCount = 0;
  loadingInterval.current = setInterval(() => {
    dotCount = (dotCount + 1) % 4; // 0 → 1 → 2 → 3 → 0
    const dots = ".".repeat(dotCount);
    setMessage({ text: `Cargando${dots}`, type: "loading" });
  }, 500);
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("source", "upload");
  
    try {
      const response = await fetch("http://127.0.0.1:5001/analyze-image", {
        method: "POST",
        body: formData,
      });

      //Paramos la animación al recibir respuesta
      clearInterval(loadingInterval.current);
  
      // Si el servidor está reiniciando, no devuelve JSON válido
      if (!response.ok) {
        const text = await response.text();
        console.warn(" Server returned non-OK response:", response.status);
  
        if (text.includes("Server is restarting")) {
          triggerReconnect();
          return;
        }
  
        setMessage({
          text: "An unexpected server error occurred. Please try again.",
          type: "error",
        });
        return;
      }
  
      const data = await response.json();
  
      if (data.error) {
        if (data.error.includes("server is restarting")) {
          triggerReconnect();
          return;
        }
  
        console.error("Error from server:", data.error);
        setMessage({
          text: "An error occurred while processing the image. Please refresh and try again.",
          type: "error",
        });
        return;
      }
  
      // Si no hay errores, mostrar los resultados
      setEmotion(data.dominant_emotion || "Unknown");
      setConfidence(data.confidence || 0);
      setOtherEmotions(data.top_emotions.slice(1));
  
      setMessage({
        text: "Image successfully analyzed",
        type: "successful",
      });

      //A los 2s borramos el mensaje
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  
      setImage(URL.createObjectURL(file));
  
    } catch (error) {
      //Cerramos animación de carga si hay error
      clearInterval(loadingInterval.current);
      console.error(" Error uploading image:", error);
      setMessage({
        text: " Network error. Please try again.",
        type: "error",
      });
    }
  };

  const isValidImageType = (file) => {
    const acceptedTypes = ["image/jpeg", "image/png"];
    return acceptedTypes.includes(file.type);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!isValidImageType(file)) {
        setMessage({
          text: "Only PNG and JPG files are supported",
          type: "error",
        });
        return;
      }
  
      setFileToUpload(file);
      setShowConfirm(true);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragCounter((count) => {
      const newCount = count + 1;
      if (newCount === 1) setDragging(true); // Solo activa `dragging` cuando realmente es la primera vez que entra
      return newCount;
    });
  };
  
  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
  
    setDragCounter((count) => {
      const newCount = count - 1;
      if (newCount <= 0) {
        setDragging(false); // Solo desactiva `dragging` cuando realmente ha salido completamente
        return 0;
      }
      return newCount;
    });
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragCounter(0);
    setDragging(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      setFileToUpload(file);
      setShowConfirm(true);
    }
  };

  const confirmProcessing = () => {
    if (!fileToUpload) return;

    if (!isValidImageType(fileToUpload)) {
      setMessage({
        text: "Only PNG and JPG files are supported",
        type: "error"
      });
      setFileToUpload(null);
      setShowConfirm(false);
      return;
    }
  
    setImage(URL.createObjectURL(fileToUpload));
    processImage(fileToUpload);
    setShowConfirm(false);
  };

  const triggerReconnect = () => {
    setMessage({
      text: "The server is restarting, trying to reconnect...",
      type: "error"
    });
  
    let attempts = 0;
    const maxAttempts = 10;
  
    const checkServerInterval = setInterval(async () => {
      try {
        const res = await fetch("http://127.0.0.1:5001/ping");
        if (res.ok) {
          clearInterval(checkServerInterval);
          console.log(" Server is back online");
          setMessage({
            text: " Server restarted! You can upload your image again.",
            type: "successful"
          });
        }
      } catch (err) {
        console.log("⏳ Still waiting for server to restart...");
      }
  
      attempts++;
      if (attempts >= maxAttempts) {
        clearInterval(checkServerInterval);
        setMessage({
          text: " Server did not respond after multiple attempts. Please refresh the page manually.",
          type: "error"
        });
      }
    }, 2000);
  };

  return (
      <>
        {dragging && <div className="drop-overlay"><span>+</span></div>}

        {showConfirm && (
            <div className="modal-overlay">
              <div className="modal">
                <p>Do you want to process this file?</p>
                <div className="modal-buttons">
                  <button className="btn confirm-btn" onClick={confirmProcessing}>Yes</button>
                  <button className="btn cancel-btn" onClick={() => setShowConfirm(false)}>No</button>
                </div>
              </div>
            </div>
          )}

        <div className={`upload-content ${hiddenUpload ? "hidden" : ""}`} onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>

        <div className="llm-container">
          {image ? (
            <img src={image} alt="Uploaded" className="uploaded-img" />
          ) : (
            <div className="placeholder">
              <p>Drag and Drop an image here</p>
              <p>or</p>
              <p><strong>Click the button to upload</strong></p>
            </div>
          )}
        </div>
          
          {/* Contenedor de resultados con botón de subida */}
          <div className="results-container">
            {/* Botón para subir/cambiar imagen */}
            <input
              type="file"
              accept="image/png, image/jpeg"
              id="file-upload"
              className="file-input"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="upload-btn">
              {image ? "Change Image" : "Upload Image"}
            </label>

            {/* Mostramos la emoción y confianza cuando hay una imagen analizada */}
            
              <div className="container-analysis">
                <div className="analysis-item">
                  <p>Facial Expression Detected</p>
                  <span className="results-expression">{image ? emotion : '--'}</span>
                </div>

                <div className="analysis-item">
                  <p>Confidence</p>
                  <span className="results-expression">
                    {(image && confidence) ? `${parseFloat(confidence).toFixed(1)}%` : "--"}
                  </span>
                </div>

                <div className="analysis-item other">
                  <p>Other Possible Emotions</p>
                  
                  {image && <ul className="list-otherEmotions">
                    {otherEmotions.map((emo, index) => (
                      <li key={index}>{emo.name}: <span className="results-otherExpression">{emo.confidence.toFixed(1)}%</span></li>
                    ))}
                  </ul>}
                </div>
                <div className="model-accuracy-box">
                  <p>Model Accuracy</p>
                  <span className="accuracy-value">91.8%</span>
                </div>
              </div>
          </div>
        </div>
      </>
  );
};

export default UploadContent;
