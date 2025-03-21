import React from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Home2 from "./components/Home2.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/app.css";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/home" element={<Home2 />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
