import React from 'react';
import './AIAssistant.css';

function ShareModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <button className="share-close" onClick={onClose}>&times;</button>
        
        <h2 className="share-title">Share with your team</h2>
        <p className="share-subtitle">Share via social</p>

        <div className="social-icons">
          <div className="social-icon-wrapper">
            <div className="social-circle">💬</div>
            <span className="social-label">WhatsApp</span>
          </div>
          <div className="social-icon-wrapper">
            <div className="social-circle">🐦</div>
            <span className="social-label">Twitter</span>
          </div>
          <div className="social-icon-wrapper">
            <div className="social-circle">💼</div>
            <span className="social-label">LinkedIn</span>
          </div>
          <div className="social-icon-wrapper">
            <div className="social-circle">✉️</div>
            <span className="social-label">Email</span>
          </div>
        </div>

        <div className="link-group">
          <label>Direct Link</label>
          <div className="link-input-wrapper">
            <input 
              type="text" 
              readOnly 
              value="https://campusmatrix.io/share/fc-89ab-x2y1" 
            />
            <button className="copy-btn" onClick={() => alert("Link Copied!")}>
              Copy Link
            </button>
          </div>
        </div>

        <div className="secure-badge">
          🔒 CAMPUSMATRIX SECURE SHARE
        </div>
      </div>
    </div>
  );
}

export default ShareModal;