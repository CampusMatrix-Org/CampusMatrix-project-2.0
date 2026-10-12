import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import './ProfilePage.css';
import './DashboardPage.css';

function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // States for Profile Data
  const [profilePic, setProfilePic] = useState('https://ui-avatars.com/api/?name=Jeewantha&background=FF7043&color=fff');
  const [formData, setFormData] = useState({
    fullName: 'Jeewantha',
    email: 'name@university.edu',
    semester: 'Spring 2026',
    bio: 'Passionate CS student focused on Artificial Intelligence and its application in urban campus planning.'
  });
  
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  // --- Photo Upload Logic ---
  const handleUploadClick = () => fileInputRef.current.click();
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfilePic(e.target.result);
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemovePic = () => {
    setProfilePic('https://ui-avatars.com/api/?name=Jeewantha&background=E0E0E0&color=888');
  };

  // --- Form Logic ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = () => {
    // This is where you would normally send data to your backend API
    alert('Profile updated successfully!');
  };

  // --- Sign Out Logic ---
  const handleSignOutConfirm = () => {
    setIsSignOutModalOpen(false);
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        
        <div className="page-content">
          <div className="profile-container">
            <h1 className="page-title">Personal Information</h1>
            
            <div className="profile-card">
              
              {/* Photo Section */}
              <div className="profile-photo-section">
                <div className="photo-wrapper">
                  <img src={profilePic} alt="Profile" className="profile-image-large" />
                </div>
                <div className="photo-actions">
                  <h3>Profile Photo</h3>
                  <p>Recommended 300x300px. JPG, PNG or GIF.</p>
                  <div className="photo-btn-group">
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      style={{ display: 'none' }} 
                    />
                    <button className="btn-upload" onClick={handleUploadClick}>Upload New</button>
                    <button className="btn-remove" onClick={handleRemovePic}>Remove</button>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      name="fullName" 
                      value={formData.fullName} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Current Semester</label>
                  <select name="semester" value={formData.semester} onChange={handleChange}>
                    <option value="Fall 2025">Fall 2025</option>
                    <option value="Spring 2026">Spring 2026</option>
                    <option value="Fall 2026">Fall 2026</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Short Bio</label>
                  <textarea 
                    name="bio" 
                    rows="4" 
                    value={formData.bio} 
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="profile-footer">
                <p className="last-updated">Last updated: Oct 24, 2025 at 2:15 PM</p>
                <div className="footer-actions">
                  <button className="btn-cancel" onClick={() => navigate('/dashboard')}>Cancel</button>
                  <button className="btn-update" onClick={handleUpdateProfile}>Update Profile</button>
                </div>
              </div>

              {/* Danger Zone (Change Password & Sign Out) */}
              <div className="profile-danger-zone">
                <button className="btn-outline" onClick={() => navigate('/change-password')}>
                  🔒 Change Password
                </button>
                <button className="btn-outline-danger" onClick={() => setIsSignOutModalOpen(true)}>
                  🚪 Sign Out
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Custom Sign Out Confirmation Modal */}
      {isSignOutModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content signout-modal">
            
            {/* Top Icon */}
            <div className="signout-icon-wrapper">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF7043" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </div>

            <h2>Sign Out</h2>
            <p>Are you sure you want to sign out?</p>
            
            <div className="signout-actions">
              <button className="btn-signout-confirm" onClick={handleSignOutConfirm}>Sign Out</button>
              <button className="btn-signout-cancel" onClick={() => setIsSignOutModalOpen(false)}>Cancel</button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;