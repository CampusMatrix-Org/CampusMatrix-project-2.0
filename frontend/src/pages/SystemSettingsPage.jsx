import React, { useState, useEffect } from 'react';
import './SystemSettingsPage.css';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import { useMaintenance } from '../context/MaintenanceContext'; 
import api from '../services/api';

const SystemSettingsPage = () => {
  const { isMaintenanceMode, setIsMaintenanceMode } = useMaintenance();
  
  // API Key & Stats State
  const [apiKey, setApiKey] = useState('AlzaSyB_REDACTED_KEY_4X9Z');
  const [showKey, setShowKey] = useState(false);
  const [apiUsage, setApiUsage] = useState({ limit: 1000000, used: 450230 });

  useEffect(() => {
    const fetchApiStats = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        if (response.data && response.data.apiUsage) {
          setApiUsage(response.data.apiUsage);
        }
      } catch (err) {
        console.warn('Failed to fetch api usage stats. Using fallback.', err);
      }
    };
    fetchApiStats();
  }, []);
  
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
                    <div className="stat-val">{apiUsage.limit.toLocaleString()} <span className="stat-unit">tokens</span></div>
                  </div>
                  <div className="api-stat-box">
                    <span className="stat-label">Tokens Used</span>
                    <div className="stat-val">{apiUsage.used.toLocaleString()} <span className="stat-unit">tokens</span></div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="api-progress-section">
                  <div className="progress-top">
                    <div>
                      <strong>Gemini AI Token Usage</strong>
                      <div className="progress-sub">Based on current billing cycle</div>
                    </div>
                    <div className="progress-percent">{Math.round((apiUsage.used / apiUsage.limit) * 100)}%</div>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${Math.round((apiUsage.used / apiUsage.limit) * 100)}%` }}></div>
                  </div>
                  <div className="progress-bottom">{apiUsage.used.toLocaleString()} / {apiUsage.limit.toLocaleString()} tokens used today</div>
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
                      <button type="button" className="eye-btn" onClick={() => setShowKey(!showKey)}>
                        {showKey ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path>
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path>
                            <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                          </svg>
                        )}
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