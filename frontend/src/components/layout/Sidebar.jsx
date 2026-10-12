import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';
import { useSettings } from '../../context/SettingsContext';

function Sidebar() {
  const location = useLocation();
  const { t, isMobileMenuOpen, setIsMobileMenuOpen } = useSettings();

  // මෙතන name වෙනුවට tKey කියලා දාලා translation dictionary එකට connect කරා
  const navItems = [
    { tKey: 'dashboard', path: '/dashboard', icon: '📊' },
    { tKey: 'tasks', path: '/tasks', icon: '✅' },
    { tKey: 'calendar', path: '/calendar', icon: '📅' },
    { tKey: 'studyTools', path: '/study-tools', icon: '🧠' },
    { tKey: 'aiAssistant', path: '/ai-assistant', icon: '🤖' },
    { tKey: 'settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <>
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
      <div className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <span className="icon">🏛️</span> CampusMatrix
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link 
              key={item.tKey} 
              to={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              {t(item.tKey)}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}

export default Sidebar;