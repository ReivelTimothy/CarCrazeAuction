import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, Lock, Mail, Car } from "lucide-react";
import Navbar from "../components/navbar";
import "../styles/login.css";

interface LocationState {
  registered?: boolean;
}

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check if user just registered successfully
        const state = location.state as LocationState;
        if (state?.registered) {
            setSuccessMessage("Registration successful! Please login with your new account.");
            // Clear the state to avoid showing the message again on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!email || !password) {
            setError("Email and password are required");
            setLoading(false);
            return;
        }

        try {
            // Import authAPI dynamically to avoid circular dependencies
            const { authAPI } = await import('../services/apiService');
            
            // Use authAPI for login
            const response = await authAPI.login({ email, password });
            
            // Extract token from response
            const { token } = response.data;
              // Store token in localStorage
            localStorage.setItem("token", token);
            
            if (rememberMe) {
                localStorage.setItem("rememberedEmail", email);
            } else {
                localStorage.removeItem("rememberedEmail");
            }
            
            // Redirect to home page
            navigate("/home");
        } catch (error) {
            console.log("Login error:", error);
            setError("Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="login-page">
                <div className="login-container">
                    <div className="login-card">
                        <div className="login-header">
                            <div className="login-logo">
                                <Car size={32} />
                            </div>
                            <h1>Welcome Back</h1>
                            <p>Sign in to continue to Car Craze Auction</p>
                        </div>
                        
                        {successMessage && (
                            <div className="success-message">
                                <AlertCircle size={18} />
                                <p>{successMessage}</p>
                            </div>
                        )}
                        
                        {error && (
                            <div className="error-message">
                                <AlertCircle size={18} />
                                <p>{error}</p>
                            </div>
                        )}
                        
                        <form className="login-form" onSubmit={handleLogin}>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <div className="input-with-icon">
                                    <Mail size={18} className="input-icon" />
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                        autoComplete="email"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <div className="password-label-container">
                                    <label htmlFor="password">Password</label>
                                    <Link to="/forgot-password" className="forgot-password">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="input-with-icon">
                                    <Lock size={18} className="input-icon" />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            
                            <div className="form-group checkbox-group">
                                <label className="checkbox-container">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={() => setRememberMe(!rememberMe)}
                                        disabled={loading}
                                    />
                                    <span className="checkmark"></span>
                                    <span>Remember me</span>
                                </label>
                            </div>
                            
                            <button
                                type="submit"
                                className={`login-button ${loading ? 'loading' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                            
                            <div className="form-footer">
                                <p>
                                    Don't have an account?{' '}
                                    <Link to="/register" className="text-link">
                                        Create an account
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                    
                    <div className="login-features">
                        <div className="features-content">
                            <h2>Premium Features</h2>
                            <ul className="features-list">
                                <li>
                                    <div className="feature-icon">🚗</div>
                                    <div>
                                        <h3>Exclusive Auctions</h3>
                                        <p>Access to rare and luxury vehicles</p>
                                    </div>
                                </li>
                                <li>
                                    <div className="feature-icon">⏱️</div>
                                    <div>
                                        <h3>Real-time Bidding</h3>
                                        <p>Live auction updates and notifications</p>
                                    </div>
                                </li>
                                <li>
                                    <div className="feature-icon">💰</div>
                                    <div>
                                        <h3>Secure Transactions</h3>
                                        <p>Safe and transparent payment process</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;