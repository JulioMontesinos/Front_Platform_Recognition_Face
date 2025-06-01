import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // Validar que el ID del token coincida con el del localStorage
    if (decoded.id !== user.id) {
      return <Navigate to="/" replace />;
    }

    // Validar expiración manualmente (jwt-decode no lo hace solo)
    const now = Date.now() / 1000;
    if (decoded.exp < now) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return <Navigate to="/" replace />;
    }

    // Si todo está bien, se permite el acceso
    return <Outlet />;

  } catch (err) {
    // Token malformado o inválido (No pasará nunca)
    console.error("Token inválido:", err);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;