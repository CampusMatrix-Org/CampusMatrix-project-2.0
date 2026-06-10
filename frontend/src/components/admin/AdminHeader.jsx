import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../layout/Layout.css'; 
import { useAdmin } from '../../context/AdminContext'; 
import { useTheme } from '../../context/ThemeContext'; 

function AdminHeader() {
  const navigate = useNavigate();
  const { adminData, isMobileMenuOpen, setIsMobileMenuOpen } = useAdmin(); 
  const { isDarkMode, toggleTheme } = useTheme(); 

 
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  
  const searchData = [
    { id: 1, title: 'Alice Johnson', type: 'Student', path: '/admin/users' },
    { id: 2, title: 'Bob Smith', type: 'Student', path: '/admin/users' },
    { id: 3, title: 'CS101 Midterm Masterclass', type: 'Resource', path: '/admin/resources' },
    { id: 4, title: 'System Settings', type: 'Page', path: '/admin/settings' },
    { id: 5, title: 'API Configuration', type: 'Setting', path: '/admin/settings' },
    { id: 6, title: 'Student Management', type: 'Page', path: '/admin/users' },
    { id: 7, title: 'Notifications', type: 'Page', path: '/admin/notifications' },
  ];

  
  const filteredResults = searchData.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim().length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (path) => {
    navigate(path);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const getInitials = (name) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="header">
      <button 
        className="hamburger-btn" 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        ☰
      </button>
      <div className="search-container" ref={searchRef}>
        <div className="search-bar" style={{ position: 'relative' }}>
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search analytics, students..." 
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery.trim().length > 0 && setShowSuggestions(true)}
          />
          
        
          {showSuggestions && (
            <div className="search-suggestions-dropdown" style={{
              position: 'absolute',
              top: '110%',
              left: 0,
              width: '100%',
              backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
              border: isDarkMode ? '1px solid #333' : '1px solid #E0E0E0',
              borderRadius: '8px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              zIndex: 1000,
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {filteredResults.length > 0 ? (
                filteredResults.map(item => (
                  <div 
                    key={item.id} 
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(item.path)}
                    style={{
                      padding: '12px 15px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: isDarkMode ? '1px solid #333' : '1px solid #F0F0F0',
                      color: isDarkMode ? '#FFF' : '#333',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#2A2A2A' : '#F5F5F5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.title}</span>
                    <span style={{ 
                      fontSize: '11px', 
                      padding: '3px 8px', 
                      backgroundColor: isDarkMode ? '#333' : '#EAEAEA',
                      borderRadius: '12px',
                      color: isDarkMode ? '#AAA' : '#666',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {item.type}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ padding: '15px', textAlign: 'center', color: '#888', fontSize: '14px' }}>
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="header-right">
        <button className="notification-btn" title="System Alerts" onClick={() => navigate('/admin/notifications')}>
          🔔 <span className="notification-dot" style={{ background: '#F5222D' }}></span>
        </button>

        <button className="notification-btn" title="Toggle Theme" onClick={toggleTheme}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        <div 
          className="profile-section" 
          style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
          onClick={() => navigate('/admin/profile')}
          title="View Admin Profile"
        >
          <div className="profile-info" style={{ textAlign: 'right', marginRight: '12px' }}>
            <h4 className="profile-name" style={{ margin: 0, fontSize: '14px', color: isDarkMode ? '#FFF' : '#1A1A1A' }}>
              {adminData.fullName}
            </h4>
            <p className="profile-degree" style={{ margin: 0, fontSize: '12px', color: '#888' }}>
              {adminData.email}
            </p>
          </div>
          
          <div className="profile-avatar" style={{
            width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FFE0E0',
            color: '#E64A19', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px',
            overflow: 'hidden' 
          }}>
            {adminData.profilePhoto ? (
              <img src={adminData.profilePhoto} alt="Admin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              getInitials(adminData.fullName)
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;