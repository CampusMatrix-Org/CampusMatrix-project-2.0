import React, { useState, useEffect, useRef } from 'react';
import './AdminProfilePage.css';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import { useAdmin } from '../context/AdminContext';

const AdminProfilePage = () => {
  const { adminData, updateAdminData } = useAdmin();
  
  const [formData, setFormData] = useState({
    fullName: adminData.fullName,
    email: adminData.email,
    role: adminData.role,
    bio: adminData.bio
  });

  
  const [profilePhoto, setProfilePhoto] = useState(adminData.profilePhoto);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFormData({
      fullName: adminData.fullName,
      email: adminData.email,
      role: adminData.role,
      bio: adminData.bio
    });
    setProfilePhoto(adminData.profilePhoto);
  }, [adminData]);

  
  const handleUpdateProfile = () => {
    if (!formData.fullName.trim() || !formData.email.trim()) {
      alert("Name and Email cannot be empty!");
      return;
    }
    
    
    updateAdminData({ ...formData, profilePhoto });
    alert("Profile information updated successfully!");
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
                <button className="btn-security"><span className="sec-icon">🔒</span> Change Password</button>
                <button className="btn-signout"><span className="sec-icon">🚪</span> Sign Out</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;