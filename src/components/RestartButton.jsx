import React, { useState, useRef } from "react";

const RestartButton = ({ setMessage }) => {
  const [isRestarting, setIsRestarting] = useState(false);
  const dotsIntervalRef = useRef(null);

  const handleRestart = async () => {
    if (isRestarting) return;
    setIsRestarting(true);

    // Arranca animación de puntos en el mensaje
    let dotCount = 0;
    dotsIntervalRef.current = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      const dots = ".".repeat(dotCount);
      setMessage({ text: `Restarting server${dots}`, type: "loading" });
    }, 500);

    try {
      // 1) Lanza el reinicio
      const res = await fetch("http://127.0.0.1:5001/restart-server", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);

      // 2) Polling hasta que /ping responda
      const pingInterval = setInterval(async () => {
        try {
          const pingRes = await fetch("http://127.0.0.1:5001/ping");
          if (pingRes.ok) {
            clearInterval(pingInterval);
            clearInterval(dotsIntervalRef.current);
            setIsRestarting(false);
            setMessage({ text: "Server ready", type: "successful" });
          }
        } catch {
          // sigue esperando…
        }
      }, 1000);
    } catch (err) {
      clearInterval(dotsIntervalRef.current);
      setIsRestarting(false);
      console.error("Error restarting server:", err);
      setMessage({ text: "Failed to restart server", type: "error" });
    }
  };

  return (
    <button onClick={handleRestart} disabled={isRestarting}>
      {isRestarting ? "Restarting…" : "Restart server"}
    </button>
  );
};

export default RestartButton;