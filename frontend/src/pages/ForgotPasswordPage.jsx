import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './ForgotPasswordPage.css';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/auth/forgot-password', { email });
      
      if (response.data.success) {
        setMessage("Success! We've sent password reset instructions to your email.");
        setEmail(''); 
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset instructions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      {/* Left Panel */}
      <div className="left-panel">
        <div className="illustration-container">
          <img src="/student.png" alt="Student Studying" className="student-img" />
        </div>
        
        <div className="left-content">
          <div className="logo-small">
            <span className="icon">🏛️</span> CampusMatrix
          </div>
          <h1 className="left-title">Secure your access</h1>
          <p className="left-subtitle">
            Your progress is safe with us. Just follow the instructions to reset your password and continue your journey.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        {/* orange pulse animation */}
        <div className="animated-bg">
          <div className="ring orange-ring ring-1"></div>
          <div className="ring orange-ring ring-2"></div>
          <div className="ring orange-ring ring-3"></div>
          <div className="ring orange-ring ring-4"></div>
        </div>

        <div className="form-container text-center">
          <h2 className="form-title">Forgot Password?</h2>
          <p className="form-subtitle">No worries, we'll send you reset instructions.</p>

          {/* Messages */}
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group text-left">
              <label>University Email</label>
              <input 
                type="email" 
                name="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="name@university.edu" 
                required 
              />
            </div>

            <button type="submit" className="btn primary-btn full-width" disabled={loading}>
              {loading ? "Sending..." : "Reset Password"}
            </button>
          </form>

          <Link to="/login" className="back-to-login">
            &larr; Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;