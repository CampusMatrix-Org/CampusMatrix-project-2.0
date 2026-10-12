import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './LoginPage.css';

function AdminRegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });

      if (response.status === 201 || response.data?.success) {
        setSuccess("Admin account created successfully! Redirecting to login...");
        setTimeout(() => {
          navigate('/admin/login');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left-panel">
        <div className="auth-left-content">
          <div className="auth-logo-small"><span className="icon">🏛️</span> CampusMatrix</div>
          <h1 className="auth-left-title">Join the Admin Command Center</h1>
          <p className="auth-left-subtitle">Create your administrator account to manage students, moderate resources, and oversee system operations.</p>
        </div>
        <div className="auth-illustration-container">
          <img src="/Admin.png" alt="Admin Register" className="auth-student-img" />
        </div>
      </div>
      
      
      <div className="auth-right-panel">
        <div className="auth-animated-bg"><div className="auth-ring ring-1"></div><div className="auth-ring ring-2"></div></div>
        <div className="auth-form-container">
          <h2 className="auth-form-title">Admin Registration</h2>
          <p className="auth-form-subtitle">Enter your details to register as an Administrator</p>
          
          {error && <div className="auth-error-message">{error}</div>}
          {success && <div className="auth-success-message">{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleChange} 
                placeholder="H M N R Nisitha" 
                required 
              />
            </div>

            <div className="auth-input-group">
              <label>Admin Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="admin@campusmatrix.edu" 
                required 
              />
            </div>

            <div className="auth-input-group">
              <label>Create Password</label>
              <div className="auth-password-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="••••••••" 
                  required 
                />
                <button type="button" className="auth-eye-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
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
                  )}
                </button>
              </div>
            </div>

            <div className="auth-input-group">
              <label>Confirm Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                placeholder="••••••••" 
                required 
              />
            </div>

            <button type="submit" className="auth-btn auth-primary-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Register Admin"}
            </button>
          </form>
          
          <p className="auth-login-link">Already have an admin account? <Link to="/admin/login">Sign In here</Link></p>

          <div className="auth-portal-divider"></div>

          <button 
            type="button" 
            className="auth-portal-switch-btn"
            onClick={() => navigate('/login')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5"></path>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Student Login
          </button>

          <div className="auth-portal-footer-links">
            <span>TERMS OF SERVICE</span>
            <span>PRIVACY POLICY</span>
            <span>HELP CENTER</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminRegisterPage;