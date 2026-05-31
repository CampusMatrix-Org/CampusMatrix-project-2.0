import React, { useState } from 'react';
import './SystemSettingsPage.css';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import { useMaintenance } from '../context/MaintenanceContext'; // Import context

const SystemSettingsPage = () => {
  const { isMaintenanceMode, setIsMaintenanceMode } = useMaintenance();
  
  // API Key State
  const [apiKey, setApiKey] = useState('AlzaSyB_REDACTED_KEY_4X9Z');
  const [showKey, setShowKey] = useState(false);
  
  // Fake update trigger
  const handleUpdateKey = () => {
    alert("API Key updated successfully!");
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <div className="main-content">
        <AdminHeader />
        
        <div className="page-content sys-bg">
          <div className="admin-container">
            
            {/* Page Header */}
            <div className="sys-header-row">
              <h1>System Settings</h1>
              <p>Configure global application parameters, security protocols, and monitor system health.</p>
            </div>

            {/* --- API Configuration Card --- */}
            <div className="sys-card">
              <div className="sys-card-header">
                <span className="icon-orange">💠</span>
                <h2>API Configuration</h2>
              </div>
              <div className="sys-card-body">
                
                {/* Limit Boxes */}
                <div className="api-stats-row">
                  <div className="api-stat-box">
                    <span className="stat-label">Daily Limit</span>
                    <div className="stat-val">1,000,000 <span className="stat-unit">tokens</span></div>
                  </div>
                  <div className="api-stat-box">
                    <span className="stat-label">Tokens Used</span>
                    <div className="stat-val">450,230 <span className="stat-unit">tokens</span></div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="api-progress-section">
                  <div className="progress-top">
                    <div>
                      <strong>Gemini AI Token Usage</strong>
                      <div className="progress-sub">Based on current billing cycle</div>
                    </div>
                    <div className="progress-percent">45%</div>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: '45%' }}></div>
                  </div>
                  <div className="progress-bottom">450,230 / 1,000,000 tokens used today</div>
                </div>

                {/* API Key Input */}
                <div className="api-key-section">
                  <label>Gemini API Key</label>
                  <div className="api-input-group">
                    <div className="input-wrapper">
                      <input 
                        type={showKey ? "text" : "password"} 
                        value={apiKey} 
                        onChange={(e) => setApiKey(e.target.value)} 
                      />
                      <button className="eye-btn" onClick={() => setShowKey(!showKey)}>
                        {showKey ? '👁️' : '👁️‍🗨️'} {/* Basic eye icon representation */}
                      </button>
                    </div>
                    <button className="btn-orange-solid" onClick={handleUpdateKey}>
                      ↻ Update Key
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* --- Security & Global Settings Card --- */}
            <div className="sys-card">
              <div className="sys-card-header">
                <span className="icon-orange">🛡️</span>
                <h2>Security & Global Settings</h2>
              </div>
              <div className="sys-card-body">
                
                {/* Maintenance Mode Toggle */}
                <div className="setting-toggle-row">
                  <div>
                    <strong>Maintenance Mode</strong>
                    <p>Temporarily disable public access to the student portal.</p>
                  </div>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={isMaintenanceMode} 
                      onChange={(e) => setIsMaintenanceMode(e.target.checked)} 
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                {/* 2FA Toggle (Dummy) */}
                <div className="setting-toggle-row no-border">
                  <div>
                    <strong>Two-Factor Authentication (2FA)</strong>
                    <p>Require admin users to enter a code from an authenticator app.</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked={true} />
                    <span className="slider round"></span>
                  </label>
                </div>

              </div>
            </div>

            <div className="sys-footer-text">
              © 2024 CampusMatrix Integration Suite. Build v2.4.12-Stable
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsPage;