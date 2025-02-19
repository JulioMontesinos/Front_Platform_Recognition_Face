import React from "react";
import "../styles/LoginForm.css";

const LoginForm = () => {
    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <form>
                    <input type="email" placeholder="Email" required />
                    <input type="password" placeholder="Password" required />
                    <button type="submit">Sign In</button>
                </form>
                <p className="login-signUp">
                  <span>Don't have an account? </span>  
                  <span className="register-link">Register</span>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
