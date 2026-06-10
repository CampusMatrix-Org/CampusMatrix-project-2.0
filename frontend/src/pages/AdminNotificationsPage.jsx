import React, { useState } from 'react';
import './AdminNotificationsPage.css';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';

// Mock Data for Notifications
const mockNotifications = [
  {
    id: 1,
    group: 'NEW',
    title: 'System Performance Alert',
    description: 'Server latency detected in Western Hub. Automatic load balancing has been initiated to maintain stability.',
    time: '5 mins ago',
    icon: '⚙️',
    isNew: true,
    type: 'system',
    tags: [{ text: 'SYSTEM', color: 'blue' }, { text: 'HIGH LOAD', color: 'gray' }]
  },
  {
    id: 2,
    group: 'NEW',
    title: 'New Student Registration',
    description: 'Elena Rodriguez has completed the enrollment process for "Advanced Neural Computing".',
    time: '12 mins ago',
    icon: '👤',
    isNew: true,
    type: 'user',
    tags: [{ text: 'USER ACTIVITY', color: 'purple' }]
  },
  {
    id: 3,
    group: 'EARLIER TODAY',
    title: 'Curriculum Update Uploaded',
    description: 'Prof. Aria Thorne uploaded 4 new resources to "Foundations of Modern Ethics".',
    time: '4 hours ago',
    icon: '📚',
    isNew: false,
    type: 'resource',
    tags: [{ text: 'RESOURCE', color: 'gray' }]
  },
  {
    id: 4,
    group: 'EARLIER TODAY',
    title: 'Database Backup Successful',
    description: 'Daily snapshot completed successfully. Integrity check passed for all 2.4M student records.',
    time: '5 hours ago',
    icon: '💾',
    isNew: false,
    type: 'system',
    tags: [{ text: 'SYSTEM', color: 'blue' }]
  },
  {
    id: 5,
    group: 'YESTERDAY',
    title: 'Scheduled Maintenance Reminder',
    description: 'Portal will be offline for 15 minutes starting Sunday at 2:00 AM UTC.',
    time: 'Yesterday, 11:45 PM',
    icon: '🔧',
    isNew: false,
    type: 'system',
    tags: [{ text: 'ANNOUNCEMENT', color: 'gray' }]
  }
];

const AdminNotificationsPage = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeFilter, setActiveFilter] = useState('All');

  const unreadCount = notifications.filter(n => n.isNew).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isNew: false })));
  };

  // Filter Logic
  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Unread') return n.isNew;
    if (activeFilter === 'System') return n.type === 'system';
    if (activeFilter === 'User Activity') return n.type === 'user';
    return true;
  });

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <div className="main-content">
        <AdminHeader />
        
        <div className="page-content notif-bg">
          <div className="admin-container">
            
            {/* Page Header */}
            <div className="notif-header-container">
              <div className="notif-title-row">
                <h1>Notifications</h1>
                {unreadCount > 0 && <span className="notif-badge">{unreadCount} New</span>}
              </div>
              <button className="mark-read-btn" onClick={handleMarkAllRead}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Mark all as read
              </button>
            </div>

            {/* Filters */}
            <div className="notif-filters">
              {['All', 'Unread', 'System', 'User Activity'].map(filter => (
                <button 
                  key={filter} 
                  className={`notif-filter-btn ${activeFilter === filter ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Notifications List */}
            <div className="notif-list-container">
              {filteredNotifications.length === 0 ? (
                <div className="no-notif-message">No notifications found.</div>
              ) : (
                ['NEW', 'EARLIER TODAY', 'YESTERDAY'].map(group => {
                  const groupNotifs = filteredNotifications.filter(n => n.group === group);
                  if (groupNotifs.length === 0) return null;

                  return (
                    <div key={group} className="notif-group-section">
                      <h4 className="notif-group-title">{group}</h4>
                      <div className="notif-cards-wrapper">
                        {groupNotifs.map(notif => (
                          <div key={notif.id} className={`notif-card ${notif.isNew ? 'unread' : ''}`}>
                            <div className="notif-icon-box">{notif.icon}</div>
                            <div className="notif-content">
                              <div className="notif-top-row">
                                <h3>{notif.title}</h3>
                                <span className="notif-time">{notif.time}</span>
                              </div>
                              <p className="notif-desc">{notif.description}</p>
                              <div className="notif-tags">
                                {notif.tags.map((tag, i) => (
                                  <span key={i} className={`n-tag tag-${tag.color}`}>{tag.text}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationsPage;