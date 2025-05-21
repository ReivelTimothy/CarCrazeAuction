import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFromAPI } from "../../../backend/src/api/api.ts"; // Adjust the import path as necessary
import "../styles/login.css";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // ...existing code...
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Email and password are required.");
        } else {
            try {
                const response = await fetchFromAPI("/user/login", "POST", { email, password });
                const token = response.token;
                localStorage.setItem("token", token);
                navigate("/home");
            } catch (error) {
                console.log("Login error:", error);
                setError("Login failed. Please check your credentials.");
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>WELCOME TO
                    <br />
                    CAR CRAZE AUCTION
                </h1>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <div className="password-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="show-password-btn"
                            onClick={() => setShowPassword((prev) => !prev)}
                            tabIndex={-1}
                        >
                            {showPassword ? "hide" : "show"}
                        </button>
                    </div>
                    <button type="submit" className="login-btn">Login</button>
                </form>
                <p>
                    Don't have an account?{" "}
                    <span className="register-link" onClick={() => navigate("/register")}>
                        Register
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;