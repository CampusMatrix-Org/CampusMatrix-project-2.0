import React from 'react';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-container">
      {/* Background Animation Rings (4 Rings) */}
      <div className="animated-bg">
        <div className="ring ring-1"></div>
        <div className="ring ring-2"></div>
        <div className="ring ring-3"></div>
        <div className="ring ring-4"></div>
      </div>

      {/* Header Section */}
      <header className="navbar">
        <div className="logo">
          <span className="icon">🏛️</span> CampusMatrix
        </div>
        <button className="support-btn">Support</button>
      </header>

      {/* Main Content Section */}
      <main className="main-content">
        <div className="badge">NOW ENROLLING FOR FALL 2026</div>
        
        <h1 className="title">Your All-in-One <br/> University Hub</h1>
        
        <p className="subtitle">
          Streamline your academic journey with a unified platform for course tracking, campus resources, and peer collaboration. Built for the modern student.
        </p>

        <div className="button-group">
          <button className="btn primary-btn">Sign Up</button>
          <button className="btn secondary-btn">Login</button>
        </div>

        {/* Features list */}
        <div className="features">
          <span>✔️ Ivy League Tech</span>
          <span>📜 EduSquare Cert</span>
          <span>🌍 Global Access</span>
          <span>👥 500+ Students</span>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="footer">
        © 2026 CampusMatrix Inc. All rights reserved. Built for the future of education.
      </footer>
    </div>
  );
}

export default LandingPage;