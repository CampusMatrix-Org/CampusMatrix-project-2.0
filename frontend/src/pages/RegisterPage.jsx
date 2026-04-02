import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './RegisterPage.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    degree: '', 
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        degree: formData.degree
      });

      if (response.data.success) {
        alert("Account created successfully!");
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Left Panel with Image & Text */}
      <div className="left-panel">
        <div className="illustration-container">
          {/* Public folder eke thiyena image eka */}
          <img src="/student.png" alt="Student Studying" className="student-img" />
        </div>
        
        <div className="left-content">
          <div className="logo-small">
            <span className="icon">🏛️</span> CampusMatrix
          </div>
          <h1 className="left-title">Start your journey to excellence</h1>
          <p className="left-subtitle">
            Join the CampusMatrix community today and unlock tools designed for the modern scholar.
          </p>
        </div>
      </div>

      {/* Right Panel with Animation & Form */}
      <div className="right-panel">
        {/* Landing Page eke thibba Original Orange Pulse Animation */}
        <div className="animated-bg">
          <div className="ring orange-ring ring-1"></div>
          <div className="ring orange-ring ring-2"></div>
          <div className="ring orange-ring ring-3"></div>
          <div className="ring orange-ring ring-4"></div>
        </div>

        {/* Form Container (Z-index eken animation ekata udata gaththa) */}
        <div className="form-container">
          <h2 className="form-title">Create Account</h2>
          <p className="form-subtitle">Fill in your details to get started with your academic profile.</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@university.edu" required />
            </div>

            <div className="input-group">
              <label>Degree Program</label>
              <input type="text" name="degree" value={formData.degree} onChange={handleChange} placeholder="e.g. Software Engineering" required />
            </div>

            <div className="input-group">
              <label>Create Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
            </div>

            <button type="submit" className="btn primary-btn full-width" disabled={loading}>
              {loading ? "Creating..." : "Create My Account"}
            </button>
          </form>

          <p className="login-link">
            Already have an account? <Link to="/login">Log In</Link>
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

export default RegisterPage;