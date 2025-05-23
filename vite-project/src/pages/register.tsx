import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '../components/navbar';
import '../styles/register.css';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    agreeToTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear field-specific error when user changes input
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ''
      });
    }
  };
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    }
    
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would make an API call to register the user:
      // const response = await registerUser(formData);
      
      // After successful registration, redirect to login
      // TODO: Replace with actual registration logic
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError('Registration failed. Please try again later.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return Math.min(strength, 5);
  };
  
  const getPasswordStrengthLabel = (strength: number): string => {
    if (strength === 0) return 'Very Weak';
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    if (strength === 4) return 'Strong';
    return 'Very Strong';
  };
  
  const getPasswordStrengthColor = (strength: number): string => {
    if (strength === 0) return 'danger';
    if (strength === 1) return 'danger';
    if (strength === 2) return 'warning';
    if (strength === 3) return 'info';
    if (strength === 4) return 'success';
    return 'success';
  };
  
  const passwordStrength = calculatePasswordStrength(formData.password);
  const strengthLabel = getPasswordStrengthLabel(passwordStrength);
  const strengthColor = getPasswordStrengthColor(passwordStrength);

  return (
    <>
      <Navbar />
      <div className="register-page">
        <div className="register-container">
          <div className="register-card">
            <div className="register-header">
              <h1>Create an Account</h1>
              <p>Join our premium car auction platform</p>
            </div>
            
            {error && (
              <div className="error-message">
                <AlertCircle size={18} />
                <p>{error}</p>
              </div>
            )}
            
            <form className="register-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className={fieldErrors.fullName ? 'error' : ''}
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  disabled={loading}
                />
                {fieldErrors.fullName && <span className="field-error">{fieldErrors.fullName}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={fieldErrors.email ? 'error' : ''}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={loading}
                />
                {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-container">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className={fieldErrors.password ? 'error' : ''}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
                
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-meter">
                      {[...Array(5)].map((_, index) => (
                        <div
                          key={index}
                          className={`strength-segment ${
                            index < passwordStrength ? strengthColor : ''
                          }`}
                        ></div>
                      ))}
                    </div>
                    <span className={`strength-text ${strengthColor}`}>
                      {strengthLabel}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="password-input-container">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={fieldErrors.confirmPassword ? 'error' : ''}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <span className="field-error">{fieldErrors.confirmPassword}</span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  className={fieldErrors.phoneNumber ? 'error' : ''}
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  disabled={loading}
                />
                {fieldErrors.phoneNumber && <span className="field-error">{fieldErrors.phoneNumber}</span>}
              </div>
              
              <div className="form-group checkbox-group">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span className="checkmark"></span>
                  <span>
                    I agree to the{' '}
                    <Link to="/terms" className="text-link">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-link">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {fieldErrors.agreeToTerms && (
                  <span className="field-error">{fieldErrors.agreeToTerms}</span>
                )}
              </div>
              
              <button
                type="submit"
                className={`register-button ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
              
              <div className="form-footer">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="text-link">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
          
          <div className="benefits-sidebar">
            <div className="benefits-content">
              <h2>Benefits of Joining</h2>
              <ul className="benefits-list">
                <li>
                  <CheckCircle size={20} />
                  <div>
                    <h3>Exclusive Access</h3>
                    <p>Bid on premium and limited edition vehicles</p>
                  </div>
                </li>
                <li>
                  <CheckCircle size={20} />
                  <div>
                    <h3>Real-time Notifications</h3>
                    <p>Get instant updates on your bids and auctions</p>
                  </div>
                </li>
                <li>
                  <CheckCircle size={20} />
                  <div>
                    <h3>Personalized Dashboard</h3>
                    <p>Track your bidding activity and favorite auctions</p>
                  </div>
                </li>
                <li>
                  <CheckCircle size={20} />
                  <div>
                    <h3>Verified Sellers</h3>
                    <p>All vehicles are sourced from trusted professionals</p>
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

export default Register;
