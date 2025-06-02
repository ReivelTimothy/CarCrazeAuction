import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login, isAuthenticated, error } = useAuth();

    useEffect(() => {
        // If user is already authenticated, redirect to home
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        // Display API errors from auth context
        if (error) {
            setLoginError(error);
        }
    }, [error]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError("");
        
        if (!email || !password) {
            setLoginError("Email and password are required");
            return;
        }

        try {
            setIsLoading(true);
            await login({ email, password });
            navigate('/');
        } catch (error: any) {
            setLoginError(error.message || "Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };    return (
        <div className="login-container">
            <div className="login-box">
                <h1>WELCOME TO
                    <br />
                    CAR CRAZE AUCTION
                </h1>
                {loginError && <p className="error-message">{loginError}</p>}
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        required
                    />
                    <div className="password-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                        <button
                            type="button"
                            className="show-password-btn"
                            onClick={() => setShowPassword((prev) => !prev)}
                            tabIndex={-1}
                            disabled={isLoading}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    <button 
                        type="submit" 
                        className="login-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <p className="register-text">
                    Don't have an account?{" "}
                    <span 
                        className="register-link" 
                        onClick={() => !isLoading && navigate("/register")}
                        style={{ cursor: isLoading ? 'default' : 'pointer' }}
                    >
                        Register
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;