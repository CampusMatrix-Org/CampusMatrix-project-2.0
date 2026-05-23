import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../layout/Layout.css'; 

function AdminSidebar() {
  const location = useLocation();

  
  const navItems = [
    { id: 'dashboard', path: '/admin', icon: '⊞', label: 'Dashboard' },
    { id: 'students', path: '/admin/users', icon: '👥', label: 'Student Management' },
    { id: 'resources', path: '/admin/resources', icon: '🛡️', label: 'Resource Moderation' },
    { id: 'settings', path: '/admin/settings', icon: '⚙️', label: 'System Settings' }
  ];

  return (
    <div className="sidebar" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'space-between', 
      height: '100vh', 
      borderRight: '1px solid #F0F0F0', 
      backgroundColor: '#fff' 
    }}>
      
     
      <div>
        {/* Logo */}
        <div className="sidebar-logo" style={{ 
          padding: '24px', 
          fontSize: '20px', 
          fontWeight: '800', 
          color: '#1A1A1A', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px' 
        }}>
          <span style={{ color: '#6A1B9A', fontSize: '24px' }}>🏛️</span> CampusMatrix
        </div>
        
        {/* Navigation Links */}
        <nav className="sidebar-nav" style={{ padding: '0 16px' }}>
          {navItems.map((item) => {
            
            const isActive = location.pathname === item.path;
            
            return (
              <Link 
                key={item.id} 
                to={item.path} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  marginBottom: '8px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: isActive ? '#E64A19' : '#666',
                  backgroundColor: isActive ? '#FFF0EB' : 'transparent',
                  fontWeight: isActive ? '700' : '600',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

     
      <div style={{ padding: '20px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          backgroundColor: '#F8F9FA', 
          padding: '12px', 
          borderRadius: '12px', 
          border: '1px solid #F0F0F0' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src="https://ui-avatars.com/api/?name=Admin+User&background=FFE0E0&color=E64A19&rounded=true" 
              alt="Admin" 
              style={{ width: '36px', height: '36px', borderRadius: '50%' }}
            />
            <div>
              <h4 style={{ margin: 0, fontSize: '13px', color: '#1A1A1A', fontWeight: '700' }}>Admin User</h4>
              <p style={{ margin: 0, fontSize: '11px', color: '#888' }}>admin@campusmatrix.edu</p>
            </div>
          </div>
          
          {/* Logout Icon */}
          <button 
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#888', fontSize: '18px' }} 
            title="Logout"
            onClick={() => console.log('Logout clicked')}
          >
            ↪️
          </button>
        </div>
      </div>

    </div>
  );
}

export default AdminSidebar;