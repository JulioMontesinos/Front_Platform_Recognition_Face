import React, { useEffect } from "react";
import "../styles/messageBar.css"; 

const SimpleMessageBar = ({ message, type, duration = 2000, onDismiss }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => clearTimeout(timer); // Limpia el temporizador al desmontar el componente
  }, []); //Solo se ejecuta 1 vez porque [] está vacío.

  return <div className={`message-bar ${type}`}>{message}</div>;
};

export default SimpleMessageBar;