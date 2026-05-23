import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../layout/Layout.css'; 

function AdminHeader() {
  const navigate = useNavigate();

  return (
    <header className="header">
      {/* Search Bar */}
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input type="text" placeholder="Search analytics, students..." />
      </div>

      <div className="header-right">
        {/* Notifications */}
        <button className="notification-btn" title="System Alerts">
          🔔 <span className="notification-dot" style={{ background: '#F5222D' }}></span>
        </button>

        {/* Dark Mode Toggle */}
        <button className="notification-btn" title="Dark Mode">
          🌙
        </button>

        {/* Admin Profile Info */}
        <div className="profile-section" style={{ cursor: 'pointer' }}>
          <div className="profile-info" style={{ textAlign: 'right', marginRight: '12px' }}>
            <h4 className="profile-name" style={{ margin: 0, fontSize: '14px', color: '#1A1A1A' }}>Admin User</h4>
            <p className="profile-degree" style={{ margin: 0, fontSize: '12px', color: '#888' }}>admin@campusmatrix.edu</p>
          </div>
          <div className="profile-avatar">
            <img 
              src="https://ui-avatars.com/api/?name=Admin+User&background=FFE0E0&color=E64A19&rounded=true" 
              alt="Admin" 
              style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;