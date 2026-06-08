import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../layout/Layout.css'; 
import { useAdmin } from '../../context/AdminContext'; 

function AdminHeader() {
  const navigate = useNavigate();
  const { adminData } = useAdmin(); 

  
  const getInitials = (name) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

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
        <div 
          className="profile-section" 
          style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
          onClick={() => navigate('/admin/profile')}
          title="View Admin Profile"
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          <div className="profile-info" style={{ textAlign: 'right', marginRight: '12px' }}>
           
            <h4 className="profile-name" style={{ margin: 0, fontSize: '14px', color: '#1A1A1A' }}>
              {adminData.fullName}
            </h4>
            <p className="profile-degree" style={{ margin: 0, fontSize: '12px', color: '#888' }}>
              {adminData.email}
            </p>
          </div>
          <div className="profile-avatar" style={{
            width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FFE0E0',
            color: '#E64A19', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px'
          }}>
            {getInitials(adminData.fullName)}
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;