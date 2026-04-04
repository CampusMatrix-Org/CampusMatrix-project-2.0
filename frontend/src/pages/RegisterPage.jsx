import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './LoginPage.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: '', email: '', degree: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { setError("Passwords do not match!"); return; }
    setLoading(true); setError('');
    try {
      const response = await api.post('/auth/register', formData);
      if (response.data.success) { 
        navigate('/login'); 
      }
    } catch (err) { setError(err.response?.data?.message || "Registration failed. Please try again."); } 
    finally { setLoading(false); }
  };

  const renderEyeIcon = (isVisible) => (
    isVisible ? (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    ) : (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path>
        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </svg>
    )
  );

  return (
    <div className="auth-container">
      <div className="auth-left-panel">
        <div className="auth-left-content">
          <div className="auth-logo-small"><span className="icon">🏛️</span> CampusMatrix</div>
          <h1 className="auth-left-title">Start your journey to excellence</h1>
          <p className="auth-left-subtitle">Join the CampusMatrix community today and unlock tools designed for the modern scholar.</p>
        </div>
        <div className="auth-illustration-container">
          <img src="/student.png" alt="Student Studying" className="auth-student-img" />
        </div>
      </div>
      <div className="auth-right-panel">
        <div className="auth-animated-bg"><div className="auth-ring ring-1"></div><div className="auth-ring ring-2"></div></div>
        <div className="auth-form-container">
          <h2 className="auth-form-title">Create Account</h2>
          <p className="auth-form-subtitle">Fill in your details to get started with your academic profile.</p>
          {error && <div className="auth-error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="auth-input-group"><label>Full Name</label><input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required /></div>
            <div className="auth-input-group"><label>Email Address</label><input type="email" name="email" value={formData.email} onChange={handleChange} required /></div>
            <div className="auth-input-group"><label>Degree Program</label><input type="text" name="degree" value={formData.degree} onChange={handleChange} required /></div>
            
            <div className="auth-input-group">
              <label>Create Password</label>
              <div className="auth-password-wrapper">
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required />
                <button type="button" className="auth-eye-icon" onClick={() => setShowPassword(!showPassword)}>
                  {renderEyeIcon(showPassword)}
                </button>
              </div>
            </div>

            <div className="auth-input-group">
              <label>Confirm Password</label>
              <div className="auth-password-wrapper">
                <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                <button type="button" className="auth-eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {renderEyeIcon(showConfirmPassword)}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-btn auth-primary-btn" disabled={loading}>{loading ? "Creating..." : "Create My Account"}</button>
          </form>
          <p className="auth-login-link">Already have an account? <Link to="/login">Log In</Link></p>
        </div>
      </div>
    </div>
  );
}
export default RegisterPage;