import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SimpleMessageBar from "./SimpleMessageBar";
import "../styles/loginForm.css";

const LoginForm = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState({ text: "", type: "" });
    const navigate = useNavigate();
    const BACK_URL = import.meta.env.VITE_BACK_URL || "http://localhost:5000";

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${BACK_URL}/api/auth/login`, formData, {
                withCredentials: true,
            });

            setMessage({ text: res.data.msg, type: "successful" });
            setTimeout(() => {
                setMessage({ text: "", type: "" });
                navigate("/home")
            }, 2000); 
        } catch (error) {
            setMessage({ text: error.response?.data?.msg || "Something went wrong", type: "error" });
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
                        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
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