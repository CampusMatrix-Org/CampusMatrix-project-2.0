import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import './ChangePasswordPage.css';
import './DashboardPage.css';

function ChangePasswordPage() {
  const navigate = useNavigate();

  // Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Visibility States (ඇහැ ලකුණ ඔබද්දී අකුරු පේන/නොපේන එක)
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Password Strength Logic
  const getStrength = (password) => {
    if (!password) return { label: '', percent: 0, color: 'transparent' };
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Za-z]/.test(password) && /[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    if (strength === 1) return { label: 'Weak', percent: 33, color: '#D63031' };
    if (strength === 2) return { label: 'Medium', percent: 66, color: '#FDCB6E' };
    if (strength === 3) return { label: 'Strong', percent: 100, color: '#00B894' };
    return { label: 'Weak', percent: 33, color: '#D63031' };
  };

  const strength = getStrength(newPassword);

  const handleUpdate = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // මෙතනින් Backend API එකට යවන්න පුළුවන්
    alert('Password updated successfully!');
    navigate('/profile'); // Save උනාට පස්සේ Profile එකට යනවා
  };

  const handleCancel = () => {
    navigate('/profile'); // Cancel කරාමත් Profile එකට යනවා
  };

  // SVG Eye Icons
  const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );
  const EyeOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  );

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        
        <div className="page-content">
          <div className="cp-container">
            
            {/* Clickable Breadcrumb */}
            <div className="cp-breadcrumb">
              <span className="cp-link" onClick={() => navigate('/profile')}>Personal Information</span>
              <span className="cp-separator"> &gt; </span>
              <span className="cp-current">Change Password</span>
            </div>
            
            <div className="cp-card">
              <div className="cp-header">
                <h2>Change Password</h2>
              </div>

              <div className="cp-form">
                
                {/* Current Password */}
                <div className="cp-form-group">
                  <label>Current Password</label>
                  <div className="cp-input-wrapper">
                    <input 
                      type={showCurrent ? "text" : "password"} 
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <button type="button" className="cp-eye-btn" onClick={() => setShowCurrent(!showCurrent)}>
                      {showCurrent ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                {/* New Password & Strength */}
                <div className="cp-form-group">
                  <label>New Password</label>
                  <div className="cp-input-wrapper">
                    <input 
                      type={showNew ? "text" : "password"} 
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button type="button" className="cp-eye-btn" onClick={() => setShowNew(!showNew)}>
                      {showNew ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  
                  {newPassword && (
                    <div className="cp-strength-section">
                      <div className="cp-strength-header">
                        <span className="cp-strength-label">PASSWORD STRENGTH</span>
                        <span className="cp-strength-value" style={{ color: strength.color }}>{strength.label}</span>
                      </div>
                      <div className="cp-strength-bar-bg">
                        <div 
                          className="cp-strength-bar-fill" 
                          style={{ width: `${strength.percent}%`, backgroundColor: strength.color }}
                        ></div>
                      </div>
                      <p className="cp-strength-hint">Use at least 8 characters including letters and numbers.</p>
                    </div>
                  )}
                </div>

                {/* Confirm New Password */}
                <div className="cp-form-group cp-mt-more">
                  <label>Confirm New Password</label>
                  <div className="cp-input-wrapper">
                    <input 
                      type={showConfirm ? "text" : "password"} 
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="button" className="cp-eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

              </div>

              {/* Actions */}
              <div className="cp-actions">
                <button className="cp-btn-update" onClick={handleUpdate}>Update Password</button>
                <button className="cp-btn-cancel" onClick={handleCancel}>Cancel</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordPage;