import React from 'react';
import './LandingPage.css';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="landing-container">
      <div className="landing-animated-bg">
        <div className="landing-ring ring-1"></div>
        <div className="landing-ring ring-2"></div>
        <div className="landing-ring ring-3"></div>
        <div className="landing-ring ring-4"></div>
      </div>

      <header className="landing-navbar">
        <div className="landing-logo">
          <span className="icon">🏛️</span> CampusMatrix
        </div>
        <button className="landing-support-btn">Support</button>
      </header>

      <main className="landing-main">
        <div className="landing-badge">NOW ENROLLING FOR FALL 2026</div>
        <h1 className="landing-title">Your All-in-One <br/> University Hub</h1>
        <p className="landing-subtitle">
          Streamline your academic journey with a unified platform for course tracking, campus resources, and peer collaboration. Built for the modern student.
        </p>

        <div className="landing-button-group">
          <Link to="/register"><button className="landing-btn landing-primary-btn">Sign Up</button></Link>
          <Link to="/login"><button className="landing-btn landing-secondary-btn">Login</button></Link>
        </div>

        <div className="landing-features">
          <span>✔️ Ivy League Tech</span>
          <span>📜 EduSquare Cert</span>
          <span>🌍 Global Access</span>
          <span>👥 500+ Students</span>
        </div>
      </main>

      <footer className="landing-footer">
        © 2026 CampusMatrix Inc. All rights reserved. Built for the future of education.
      </footer>
    </div>
  );
}

export default LandingPage;