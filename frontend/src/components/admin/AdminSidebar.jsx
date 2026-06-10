import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './AdminSidebar.css';
import { useAdmin } from '../../context/AdminContext'; 

function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { adminData } = useAdmin();

  const adminNavItems = [
    { title: 'Dashboard', path: '/admin', icon: '📊' },
    { title: 'Student Management', path: '/admin/users', icon: '👨‍🎓' },
    { title: 'Resource Moderation', path: '/admin/resources', icon: '🛡️' },
    { title: 'System Settings', path: '/admin/settings', icon: '⚙️' },
  ];

  const getInitials = (name) => {
    if (!name) return 'AU';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out from the Admin Panel?");
    
    if (confirmLogout) {
      navigate('/login'); 
    }
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <span className="logo-icon">🏛️</span>
        <h2>CampusMatrix</h2>
      </div>

      <nav className="admin-nav">
        {adminNavItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.title}
          </Link>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-bottom-profile">
          
          {/* Avatar Area */}
          <div className="admin-avatar-small" style={{ overflow: 'hidden' }}>
            {adminData.profilePhoto ? (
              <img src={adminData.profilePhoto} alt="Admin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              getInitials(adminData?.fullName || 'Admin User')
            )}
          </div>
          
          <div className="admin-bottom-info">
            <h4>{adminData?.fullName || 'Admin User'}</h4>
            <p>{adminData?.email || 'admin@campusmatrix.edu'}</p>
          </div>
          
          
          <button className="logout-btn" title="Logout" onClick={handleLogout} style={{ color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
          
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;