import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SimpleMessageBar from "./SimpleMessageBar";
import {jwtDecode} from "jwt-decode";
import "../styles/loginForm.css";

const LoginForm = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState({ text: "", type: "" });

    const navigate = useNavigate();
    const BACK_URL = import.meta.env.VITE_BACK_URL || "http://localhost:5000";

    useEffect(() => {
        // Redireccionamos al usuario si ya está logueado
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (token && user) {
            try {
            const decoded = jwtDecode(token);
            const now = Date.now() / 1000;
            if (decoded.id === user.id && decoded.exp > now) {
                navigate("/home");
            }
            } catch (err) {
            // Entra aqui cuando el Token está malformado (No pasará nunca)
            }
        }

        const storedMessage = localStorage.getItem("logoutMessage");
        if (storedMessage) {
            setMessage(JSON.parse(storedMessage));
            localStorage.removeItem("logoutMessage");
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(`${BACK_URL}/api/auth/login`, formData);

    // Guardar token y usuario en localStorage
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    setMessage({ text: res.data.msg, type: "successful" });

    setTimeout(() => {
      setMessage({ text: "", type: "" });
      navigate("/home");
    }, 2000);
  } catch (error) {
    setMessage({ text: error.response?.data?.msg || "Login failed", type: "error" });
  }
};

    return (
        <div className="app-container">
            <div className="login-container">
                {/* Mostrar el mensaje si existe */}
                {message.text && <SimpleMessageBar message={message.text} type={message.type} onDismiss={() => setMessage({ text: "", type: "" })} />}

                <div className="login-box">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="email" className="input-login" name="email" placeholder="Email" onChange={handleChange} required />
                        <input type="password" className="input-login" name="password" placeholder="Password" onChange={handleChange} required />
                        <button type="submit" className="button-signIn">Sign In</button>
                    </form>
                    <p className="login-signUp">
                        <span>Don't have an account? </span>
                        <span className="register-link" onClick={() => navigate("/register")}>Register</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;