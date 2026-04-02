import React from 'react';

function WelcomeBanner() {
  return (
    <div className="welcome-banner">
      <div className="banner-content">
        <h2>Welcome back, Jeewantha! 👋</h2>
        <p>You have <strong>3 pending assignments</strong> due within the next 48 hours.<br/>Your semester GPA is currently <strong>3.8</strong> — keep up the great work!</p>
        <div className="banner-buttons">
          <button className="btn primary-btn btn-white">View Exam Schedule</button>
          <button className="btn secondary-btn btn-outline-white">Course Materials</button>
        </div>
      </div>
    </div>
  );
}
export default WelcomeBanner;