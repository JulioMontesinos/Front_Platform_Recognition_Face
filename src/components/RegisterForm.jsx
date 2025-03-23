import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SimpleMessageBar from "./SimpleMessageBar"; 
import "../styles/registerForm.css";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [message, setMessage] = useState({ text: "", type: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setMessage({ text: "All fields are required", type: "warning" });
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setMessage({ text: "Passwords do not match", type: "error" });
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/auth/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            setMessage({ text: res.data.msg, type: "successful" });

            setTimeout(() => {
              setMessage({ text: "", type: "" });
              navigate("/")
            }, 2000);

        } catch (error) {
            setMessage({ text: error.response?.data?.msg || "Something went wrong", type: "error" });
        }
    };

    return (
        <div className="app-container">
            <div className="register-container">
                {/* Mostrar el mensaje si existe */}
                {message.text && <SimpleMessageBar message={message.text} type={message.type} onDismiss={() => setMessage({ text: "", type: "" })} />}

                <div className="register-box">
                    <h2>Create Account</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="text" className="input-register" name="name" placeholder="Full Name" onChange={handleChange} required />
                        <input type="email" className="input-register" name="email" placeholder="Email" onChange={handleChange} required />
                        <input type="password" className="input-register" name="password" placeholder="Password" onChange={handleChange} required />
                        <input type="password" className="input-register" name="confirmPassword" placeholder="Repeat Password" onChange={handleChange} required />
                        <button type="submit" className="button-register">Sign Up</button>
                    </form>
                    <p className="register-signUp">
                        <span>Already have an account? </span>  
                        <span className="register-link" onClick={() => navigate("/")}>Login</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;