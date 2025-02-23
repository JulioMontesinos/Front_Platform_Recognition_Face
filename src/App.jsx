import React from "react";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/RegisterForm";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/app.css";

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/home" element={<Home />} />
                    </Route>
                </Routes>
            </div>
        </Router>
    );
};

export default App;
