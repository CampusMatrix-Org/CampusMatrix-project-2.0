import React from 'react';
import './Layout.css';
import { useSettings } from '../../context/SettingsContext';

function Header() {
  const { t } = useSettings();

  return (
    <header className="header">
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input type="text" placeholder={t('searchPlaceholder')} />
      </div>

      <div className="header-right">
        <button className="notification-btn">
          🔔 <span className="notification-dot"></span>
        </button>
        <div className="profile-section">
          <div className="profile-info">
            <h4 className="profile-name">Jeewantha</h4>
            <p className="profile-degree">Software Engineering</p>
          </div>
          <div className="profile-avatar">
            <img src="https://ui-avatars.com/api/?name=Jeewantha&background=FF7043&color=fff" alt="Profile" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;