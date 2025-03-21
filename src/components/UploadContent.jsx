import React, { useState } from "react";
import "../styles/uploadContent.css"; // O el CSS que necesites

const UploadContent = ({hiddenUpload}) => {
  const [dragging, setDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [image, setImage] = useState(null);

  // 🚀 Estados para la emoción y confianza
  const [emotion, setEmotion] = useState("");
  const [otherEmotions, setOtherEmotions] = useState([]);
  const [confidence, setConfidence] = useState("");

  // Llamada al backend para analizar la imagen
  const processImage = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Ajusta la URL según tu backend
      const response = await fetch("http://127.0.0.1:5001/analyze-image", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.error) {
        console.error("Error from server:", data.error);
      } else {
        // 🚀 Actualiza la emoción y confianza recibida del servidor
        setEmotion(data.dominant_emotion || "Unknown");
        setConfidence(data.confidence || 0);
        setOtherEmotions(data.top_emotions.slice(1));
      }

      // Muestra la imagen localmente
      setImage(URL.createObjectURL(file));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
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
    setImage(URL.createObjectURL(fileToUpload));
    processImage(fileToUpload);
    setShowConfirm(false);
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
                    {(image && confidence) ? `${parseFloat(confidence).toFixed(3)}%` : "--"}
                  </span>
                </div>

                <div className="analysis-item other">
                  <p>Other Possible Emotions</p>
                  
                  {image && <ul className="list-otherEmotions">
                    {otherEmotions.map((emo, index) => (
                      <li key={index}>{emo.name}: <span className="results-otherExpression">{emo.confidence.toFixed(3)}%</span></li>
                    ))}
                  </ul>}
                </div>
              </div>
            
          </div>
        </div>
      </>
  );
};

export default UploadContent;
