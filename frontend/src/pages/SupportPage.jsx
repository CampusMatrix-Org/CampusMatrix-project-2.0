import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SupportPage.css';

function SupportPage() {
  const navigate = useNavigate();

  return (
    <div className="support-container">
      {/* Concentric Arches / Rings Background */}
      <div className="support-bg-rings" aria-hidden="true">
        <div className="bg-ring ring-level-1"></div>
        <div className="bg-ring ring-level-2"></div>
        <div className="bg-ring ring-level-3"></div>
        <div className="bg-ring ring-level-4"></div>
        <div className="bg-ring ring-level-5"></div>
        <div className="bg-ring ring-level-6"></div>
        <div className="bg-ring ring-level-7"></div>
      </div>

      {/* Top Navigation Header */}
      <header className="support-navbar">
        <Link to="/" className="support-logo-link" title="Back to Home">
          <div className="support-logo-badge">
            <span className="support-logo-icon">🏛️</span>
          </div>
          <span className="support-logo-text">CampusMatrix</span>
        </Link>

        <div className="support-pill-badge">
          <span className="support-badge-dot">●</span>
          <span>CAMPUSMATRIX HELP &amp; STORY</span>
        </div>

        <div className="support-nav-spacer"></div>
      </header>

      {/* Main Content: Two Column Cards */}
      <main className="support-main">
        <div className="support-grid">
          
          {/* Left Card: OUR MISSION */}
          <div className="support-card support-mission-card">
            <span className="support-section-label">OUR MISSION</span>
            <h1 className="support-mission-title">
              The Central Operating System for Higher Education
            </h1>
            <p className="support-mission-desc">
              CampusMatrix was established in 2024 by graduate scholars frustrated by fragmented portals, 
              disjointed assignment schedules, and disconnected resource centers. We consolidated campus life 
              into an unified ecosystem with real-time course tracking, integrated discussion boards, and verified 
              academic credentials.
            </p>

            <div className="support-features-grid">
              <div className="support-feature-box">
                <div className="feature-icon-wrapper light-bulb-icon">💡</div>
                <h3 className="feature-title">Student-First Innovation</h3>
                <p className="feature-desc">
                  Every tool and sync interface is tested with active student cohorts to cut administrative bloat by up to 60%.
                </p>
              </div>

              <div className="support-feature-box">
                <div className="feature-icon-wrapper grad-cap-icon">🎓</div>
                <h3 className="feature-title">Academic Excellence</h3>
                <p className="feature-desc">
                  Institutional-grade reliability, secure data sovereignty, and audited compliance with EduSquare standards.
                </p>
              </div>

              <div className="support-feature-box">
                <div className="feature-icon-wrapper handshake-icon">🤝</div>
                <h3 className="feature-title">Seamless Collaboration</h3>
                <p className="feature-desc">
                  Cross-disciplinary study rooms and real-time notes exchange built for high-velocity peer mentorship.
                </p>
              </div>
            </div>
          </div>

          {/* Right Card: HELP DESK */}
          <div className="support-card support-helpdesk-card">
            <span className="support-section-label">HELP DESK</span>
            <h2 className="support-helpdesk-title">We're Here For You</h2>
            <p className="support-helpdesk-desc">
              Whether you need assistance linking your university SIS credentials, scheduling study modules, 
              or reporting an issue, our student response squad is standing by.
            </p>

            {/* Direct Support Email Box */}
            <div className="support-email-box">
              <div className="support-email-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className="support-email-content">
                <span className="support-email-sub">DIRECT SUPPORT EMAIL</span>
                <a href="mailto:support@campusmatrix.edu" className="support-email-address">
                  support@campusmatrix.edu
                </a>
                <span className="support-email-reply">
                  <span className="reply-dot">●</span> Typically replies in &lt; 2 hrs
                </span>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="support-hours-row">
              <div className="hours-col">
                <span className="hours-text">Academic Days: 8am – 10pm EST</span>
              </div>
              <div className="hours-col text-right">
                <span className="hours-text">Weekend On-Call: 10am – 6pm EST</span>
              </div>
            </div>

            {/* Frequently Searched Guides */}
            <div className="support-guides-section">
              <span className="support-guides-title">FREQUENTLY SEARCHED GUIDES</span>
              <div className="support-guides-list">
                <button 
                  className="support-guide-row" 
                  onClick={() => alert("Connecting SIS Credentials: Go to Settings > Integrations to sync your portal.")}
                >
                  <span className="guide-title">How to connect your .edu university portal</span>
                  <span className="guide-arrow">→</span>
                </button>
                <button 
                  className="support-guide-row"
                  onClick={() => alert("Fall 2026 Sync: Automatic timetable synchronization occurs daily at 2:00 AM.")}
                >
                  <span className="guide-title">Fall 2026 course schedule auto-sync</span>
                  <span className="guide-arrow">→</span>
                </button>
                <button 
                  className="support-guide-row"
                  onClick={() => alert("Data Privacy: CampusMatrix is fully compliant with FERPA regulations.")}
                >
                  <span className="guide-title">Data privacy &amp; FERPA compliance standards</span>
                  <span className="guide-arrow">→</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

export default SupportPage;
