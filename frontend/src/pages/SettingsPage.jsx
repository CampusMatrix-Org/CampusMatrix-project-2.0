import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { useSettings } from '../context/SettingsContext';
import './SettingsPage.css';
import './DashboardPage.css'; // global layout

function SettingsPage() {
  const { 
    isDarkMode, setIsDarkMode, 
    language, setLanguage, 
    emailNotifs, setEmailNotifs, 
    desktopAlerts, setDesktopAlerts,
    saveSettings, resetToDefaults, t
  } = useSettings();

  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [tempLang, setTempLang] = useState(language);

  // Map language codes to display names
  const langNames = { en: "English (US)", si: "සිංහල (Sinhala)", ta: "தமிழ் (Tamil)" };

  const handleConfirmLanguage = () => {
    setLanguage(tempLang);
    setIsLangModalOpen(false);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        
        <div className="page-content">
          <div className="settings-container">
            
            <div className="settings-header">
              <h1>{t('systemPrefs')}</h1>
              <p>{t('sysDesc')}</p>
            </div>

            {/* Appearance Section */}
            <div className="settings-section">
              <h3>{t('appearance')}</h3>
              
              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-icon">🌙</div>
                  <div className="setting-text">
                    <h4>{t('darkMode')}</h4>
                    <p>{t('darkDesc')}</p>
                  </div>
                </div>
                <div className={`toggle-switch ${isDarkMode ? 'active' : ''}`} onClick={() => setIsDarkMode(!isDarkMode)}>
                  <div className="toggle-knob"></div>
                </div>
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-icon">🌐</div>
                  <div className="setting-text">
                    <h4>{t('primaryLang')}</h4>
                    <p>{t('langDesc')}</p>
                  </div>
                </div>
                <button className="lang-selector-btn" onClick={() => setIsLangModalOpen(true)}>
                  {langNames[language]} <span>▼</span>
                </button>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="settings-section">
              <h3>{t('notifications')}</h3>
              
              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-icon">✉️</div>
                  <div className="setting-text">
                    <h4>{t('emailNotifs')}</h4>
                    <p>{t('emailDesc')}</p>
                  </div>
                </div>
                <div className={`toggle-switch ${emailNotifs ? 'active' : ''}`} onClick={() => setEmailNotifs(!emailNotifs)}>
                  <div className="toggle-knob"></div>
                </div>
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-icon">💻</div>
                  <div className="setting-text">
                    <h4>{t('desktopAlerts')}</h4>
                    <p>{t('desktopDesc')}</p>
                  </div>
                </div>
                <div className={`toggle-switch ${desktopAlerts ? 'active' : ''}`} onClick={() => setDesktopAlerts(!desktopAlerts)}>
                  <div className="toggle-knob"></div>
                </div>
              </div>
            </div>

            <div className="settings-actions">
              <button className="btn-reset" onClick={resetToDefaults}>{t('reset')}</button>
              <button className="btn-save" onClick={saveSettings}>{t('save')}</button>
            </div>

          </div>
        </div>
      </div>

      {/* Language Selection Modal */}
      {isLangModalOpen && (
        <div className="lang-modal-overlay">
          <div className="lang-modal">
            <h2>Select Language</h2>
            
            {['en', 'si', 'ta'].map((code) => (
              <div 
                key={code}
                className={`lang-option ${tempLang === code ? 'selected' : ''}`}
                onClick={() => setTempLang(code)}
              >
                <span>{langNames[code]}</span>
                {tempLang === code && <span style={{color: '#FF7043'}}>✔️</span>}
              </div>
            ))}

            <div className="lang-modal-actions">
              <button className="btn-reset" onClick={() => setIsLangModalOpen(false)}>Cancel</button>
              <button className="btn-save" onClick={handleConfirmLanguage} style={{padding: '8px 20px'}}>Confirm</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default SettingsPage;