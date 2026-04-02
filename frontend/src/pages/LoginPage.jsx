import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        const { token, role } = response.data.data;

        if (formData.rememberMe) {
          localStorage.setItem('token', token);
          localStorage.setItem('role', role);
        } else {
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('role', role);
        }
        
        alert("Login Successful! Going to Dashboard...");
        // navigate('/dashboard'); 
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Panel */}
      <div className="left-panel">
        <div className="illustration-container">
          <img src="/student.png" alt="Student Login" className="student-img" />
        </div>
        
        <div className="left-content">
          <div className="logo-small">
            <span className="icon">🏛️</span> CampusMatrix
          </div>
          <h1 className="left-title">Welcome back to your Command Center</h1>
          <p className="left-subtitle">
            Log in to pick up right where you left off and keep your academic momentum going.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <div className="animated-bg">
          <div className="ring orange-ring ring-1"></div>
          <div className="ring orange-ring ring-2"></div>
          <div className="ring orange-ring ring-3"></div>
          <div className="ring orange-ring ring-4"></div>
        </div>

        <div className="form-container">
          <h2 className="form-title">Welcome Back</h2>
          <p className="form-subtitle">Please enter your details to sign in to CampusMatrix</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="name@university.edu" 
                required 
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="••••••••"
                  required 
                />
                <button 
                  type="button" 
                  className="eye-icon" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path>
                      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="checkbox-group">
              <label>
                <input 
                  type="checkbox" 
                  name="rememberMe" 
                  checked={formData.rememberMe} 
                  onChange={handleChange} 
                />
                Remember me for 30 days
              </label>
            </div>

            <button type="submit" className="btn primary-btn full-width" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="login-link">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>

          <p className="forgot-password">
            <Link to="/forgot-password">Forgot Password</Link>
          </p>

          <div className="form-footer">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Help Center</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;