import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      {/* Logo Section */}
      <div className="admin-logo">
        <span className="logo-icon">🏛️</span>
        <h2>CampusMatrix</h2>
      </div>

      <nav className="admin-nav">
       
        <NavLink to="/admin" end className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
          <span className="nav-icon">📊</span>
          Dashboard
        </NavLink>
        
        <NavLink to="/admin/users" className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
          <span className="nav-icon">👨‍🎓</span>
          Student Management
        </NavLink>
        
        <NavLink to="/admin/resources" className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
          <span className="nav-icon">🛡️</span>
          Resource Moderation
        </NavLink>
        
        <NavLink to="/admin/settings" className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
          <span className="nav-icon">⚙️</span>
          System Settings
        </NavLink>
      </nav>

      {/* Bottom Profile Section */}
      <div className="admin-sidebar-footer">
        <div className="admin-bottom-profile">
          <div className="admin-avatar-small">AU</div>
          <div className="admin-bottom-info">
            <h4>Admin User</h4>
            <p>admin@campusmatrix.edu</p>
          </div>
          <button className="logout-btn" title="Logout">🚪</button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;