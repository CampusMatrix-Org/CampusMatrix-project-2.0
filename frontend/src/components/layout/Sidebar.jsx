import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Tasks', path: '/tasks', icon: '✅' },
    { name: 'Calendar', path: '/calendar', icon: '📅' },
    { name: 'Study Tools', path: '/study-tools', icon: '🧠' },
    { name: 'AI Study Assistant', path: '/ai-assistant', icon: '🤖' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <span className="icon">🏛️</span> CampusMatrix
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link 
            key={item.name} 
            to={item.path} 
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="sidebar-bottom">
        {/* Classes okkoma storage walata change kala */}
        <div className="storage-widget">
          <p className="storage-title">Storage</p>
          <div className="storage-bar-bg">
            <div className="storage-bar-fill" style={{ width: '65%' }}></div>
          </div>
          <p className="storage-value">65% of 100GB used</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;