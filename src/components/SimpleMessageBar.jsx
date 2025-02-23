import React, { useEffect } from "react";
import "../styles/messageBar.css"; // Asegúrate de importar el CSS correctamente

const SimpleMessageBar = ({ message, type, duration = 2000, onDismiss }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => clearTimeout(timer); // Limpia el temporizador al desmontar el componente
  }, []); // 🔥 Dependencias vacías → Solo se ejecuta una vez

  return <div className={`message-bar ${type}`}>{message}</div>;
};

export default SimpleMessageBar;