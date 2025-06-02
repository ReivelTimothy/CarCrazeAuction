import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css"; // Reuse the login styles

const Register: React.FC = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [registerError, setRegisterError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        // If user is already authenticated, redirect to home
        if (isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated, navigate]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegisterError("");
        
        // Simple validation
        if (!username || !email || !password || !confirmPassword || !phoneNum) {
            setRegisterError("All fields are required");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setRegisterError("Please enter a valid email address");
            return;
        }
        
        // Password validation
        if (password.length < 6) {
            setRegisterError("Password must be at least 6 characters long");
            return;
        }
        
        if (password !== confirmPassword) {
            setRegisterError("Passwords do not match");
            return;
        }

        // Phone number validation
        const phoneRegex = /^\+?\d{10,14}$/;
        if (!phoneRegex.test(phoneNum)) {
            setRegisterError("Please enter a valid phone number");
            return;
        }

        try {
            setIsLoading(true);
            await register({ username, email, password, phoneNum });
            // Show success message
            alert("Registration successful! Please login with your credentials.");
            navigate('/login');
        } catch (error: any) {
            console.error("Registration error:", error);
            setRegisterError(error.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box register-box">
                <h1>Create Account</h1>
                {registerError && <p className="error-message">{registerError}</p>}
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isLoading}
                        required
                    />
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
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={phoneNum}
                        onChange={(e) => setPhoneNum(e.target.value)}
                        disabled={isLoading}
                        required
                    />
                    <button 
                        type="submit" 
                        className="login-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating account..." : "Register"}
                    </button>
                </form>
                <p className="register-text">
                    Already have an account?{" "}
                    <span 
                        className="register-link" 
                        onClick={() => !isLoading && navigate("/login")}
                        style={{ cursor: isLoading ? 'default' : 'pointer' }}
                    >
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;