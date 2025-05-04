import React, { useEffect } from "react";
import "../styles/messageBar.css"; 

const SimpleMessageBar = ({ message, type, duration = 2000, onDismiss }) => {

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => clearTimeout(timer); // Limpia el temporizador al desmontar el componente
  }, [message, duration, onDismiss]);

  return <div className={`message-bar ${type}`}>{message}</div>;
};

export default SimpleMessageBar;