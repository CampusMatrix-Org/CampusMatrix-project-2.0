import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminProfilePage.css';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import { useAdmin } from '../context/AdminContext';

const AdminProfilePage = () => {
  const navigate = useNavigate();
  const { adminData, updateAdminData } = useAdmin();
  
  const [formData, setFormData] = useState({
    fullName: adminData.fullName,
    email: adminData.email,
    role: adminData.role,
    bio: adminData.bio
  });
  
  const [profilePhoto, setProfilePhoto] = useState(adminData.profilePhoto);
  
  
  const [isPwdModalOpen, setIsPwdModalOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false); 

  const [alertModal, setAlertModal] = useState({ isOpen: false, type: '', message: '' });
  
  const fileInputRef = useRef(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData({
      fullName: adminData.fullName,
      email: adminData.email,
      role: adminData.role,
      bio: adminData.bio
    });
     
    setProfilePhoto(adminData.profilePhoto);
  }, [adminData]);

  
  const showAlert = (type, message) => {
    setAlertModal({ isOpen: true, type, message });
  };

  const closeAlert = () => {
    setAlertModal({ isOpen: false, type: '', message: '' });
  };

  const handleUpdateProfile = () => {
    if (!formData.fullName.trim() || !formData.email.trim()) {
      showAlert('error', 'Name and Email cannot be empty!');
      return;
    }
    
    updateAdminData({ ...formData, profilePhoto });
    showAlert('success', 'Profile information updated successfully!');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const getInitials = (name) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleSignOutClick = () => {
    setIsSignOutModalOpen(true); 
  };

  const confirmSignOut = () => {
    setIsSignOutModalOpen(false);
    navigate('/login');
  };

  const handlePasswordUpdate = () => {
    setIsPwdModalOpen(false);
    showAlert('success', 'Password updated successfully!');
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <div className="main-content">
        <AdminHeader />
        <div className="page-content admin-profile-bg">
          <div className="admin-container">
            <h1 className="profile-page-title">Personal Information</h1>
            <div className="profile-card">
              
              <div className="profile-photo-section">
                <div className="profile-avatar-large" style={{ overflow: 'hidden' }}>
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    getInitials(formData.fullName)
                  )}
                </div>
                <div className="profile-photo-actions">
                  <h3>Profile Photo</h3>
                  <p>Recommended 300x300px. JPG, PNG or GIF.</p>
                  <input type="file" accept="image/png, image/jpeg, image/gif" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
                  <div className="photo-btn-group">
                    <button className="btn-upload" onClick={handleUploadClick}>Upload New</button>
                    <button className="btn-remove" onClick={handleRemovePhoto}>Remove</button>
                  </div>
                </div>
              </div>

              <div className="profile-form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                <label>Admin Role (Access Level)</label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                  <option value="System Administrator">System Administrator</option>
                  <option value="Resource Moderator">Resource Moderator</option>
                  <option value="Support Staff">Support Staff</option>
                </select>
              </div>

              <div className="form-group">
                <label>Short Bio / Admin Notes</label>
                <textarea rows="4" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})}></textarea>
              </div>

              <div className="profile-update-actions">
                <span className="last-updated">Last updated: Just now</span>
                <div className="update-btn-group">
                  <button className="btn-cancel" onClick={() => { setFormData({...adminData}); setProfilePhoto(adminData.profilePhoto); }}>Cancel</button>
                  <button className="btn-update" onClick={handleUpdateProfile}>Update Profile</button>
                </div>
              </div>

              <div className="profile-security-actions">
                <button className="btn-security" onClick={() => setIsPwdModalOpen(true)}>
                  <span className="sec-icon">🔒</span> Change Password
                </button>
                <button className="btn-signout" onClick={handleSignOutClick}>
                  <span className="sec-icon">🚪</span> Sign Out
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 1. Password Reset Modal */}
      {isPwdModalOpen && (
        <div className="sm-modal-overlay">
          <div className="sm-modal form-modal" style={{ backgroundColor: '#1E1E1E', border: '1px solid #333' }}>
            <div className="sm-modal-header">
              <h3 style={{ color: '#FFF' }}>Change Password</h3>
              <button className="close-btn" onClick={() => setIsPwdModalOpen(false)}>✕</button>
            </div>
            <div className="sm-modal-body">
              <div className="form-group">
                <label style={{ color: '#A0A0A0' }}>Current Password</label>
                <input type="password" placeholder="Enter current password" style={{ backgroundColor: '#121212', color: '#FFF', border: '1px solid #333' }} />
              </div>
              <div className="form-group">
                <label style={{ color: '#A0A0A0' }}>New Password</label>
                <input type="password" placeholder="Enter new password" style={{ backgroundColor: '#121212', color: '#FFF', border: '1px solid #333' }} />
              </div>
              <div className="form-group">
                <label style={{ color: '#A0A0A0' }}>Confirm New Password</label>
                <input type="password" placeholder="Confirm new password" style={{ backgroundColor: '#121212', color: '#FFF', border: '1px solid #333' }} />
              </div>
              <button className="btn-orange-solid mt-4" style={{ width: '100%' }} onClick={handlePasswordUpdate}>
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Custom Sign Out Modal */}
      {isSignOutModalOpen && (
        <div className="sm-modal-overlay">
          <div className="sm-modal" style={{ backgroundColor: '#1E1E1E', border: '1px solid #333', padding: '30px', textAlign: 'center', borderRadius: '12px', maxWidth: '400px' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🚪</div>
            <h3 style={{ color: '#FFF', marginBottom: '10px', fontSize: '22px' }}>Sign Out</h3>
            <p style={{ color: '#A0A0A0', marginBottom: '30px', fontSize: '15px' }}>
              Are you sure you want to sign out from the Admin Panel?
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button className="btn-cancel" onClick={() => setIsSignOutModalOpen(false)} style={{ flex: 1, padding: '12px' }}>
                Cancel
              </button>
              <button className="btn-orange-solid" onClick={confirmSignOut} style={{ flex: 1, padding: '12px' }}>
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {alertModal.isOpen && (
        <div className="sm-modal-overlay">
          <div className="sm-modal" style={{ backgroundColor: '#1E1E1E', border: '1px solid #333', padding: '30px', textAlign: 'center', borderRadius: '12px', maxWidth: '400px' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>
              {alertModal.type === 'success' ? '✅' : '⚠️'}
            </div>
            <h3 style={{ color: '#FFF', marginBottom: '10px', fontSize: '22px' }}>
              {alertModal.type === 'success' ? 'Success!' : 'Oops!'}
            </h3>
            <p style={{ color: '#A0A0A0', marginBottom: '30px', fontSize: '15px' }}>
              {alertModal.message}
            </p>
            <button className="btn-orange-solid" onClick={closeAlert} style={{ width: '100%', padding: '12px' }}>
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProfilePage;