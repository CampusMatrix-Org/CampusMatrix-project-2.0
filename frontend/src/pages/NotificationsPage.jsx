import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import './NotificationsPage.css';
import './DashboardPage.css';

function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('All');
  
  // Dummy Data
  const [notifications, setNotifications] = useState([
    {
      id: 1, group: 'New', title: 'System Performance Alert',
      desc: 'Server latency detected in Western Hub. Automatic load balancing has been initiated to maintain stability.',
      time: '5 mins ago', type: 'System', tags: ['SYSTEM', 'HIGH LOAD'], isRead: false,
      icon: '⚙️'
    },
    {
      id: 2, group: 'New', title: 'New Student Registration',
      desc: 'Elena Rodriguez has completed the enrollment process for "Advanced Neural Computing".',
      time: '12 mins ago', type: 'User Activity', tags: ['USER ACTIVITY'], isRead: false,
      icon: '👤'
    },
    {
      id: 3, group: 'Earlier Today', title: 'Curriculum Update Uploaded',
      desc: 'Prof. Aria Thorne uploaded 4 new resources to "Foundations of Modern Ethics".',
      time: '4 hours ago', type: 'System', tags: ['RESOURCE'], isRead: true,
      icon: '📚'
    },
    {
      id: 4, group: 'Earlier Today', title: 'Database Backup Successful',
      desc: 'Daily snapshot completed successfully. Integrity check passed for all 2.4M student records.',
      time: '5 hours ago', type: 'System', tags: ['SYSTEM'], isRead: true,
      icon: '💾'
    },
    {
      id: 5, group: 'Yesterday', title: 'Scheduled Maintenance Reminder',
      desc: 'Portal will be offline for 15 minutes starting Sunday at 2:00 AM UTC.',
      time: 'Yesterday, 11:45 PM', type: 'System', tags: ['ANNOUNCEMENT'], isRead: true,
      icon: '🔧'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // Filter Logic
  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Unread') return !n.isRead;
    if (activeTab === 'System') return n.type === 'System';
    if (activeTab === 'User Activity') return n.type === 'User Activity';
    return true;
  });

  // Group Logic
  const groupedNotifications = filteredNotifications.reduce((acc, notif) => {
    if (!acc[notif.group]) acc[notif.group] = [];
    acc[notif.group].push(notif);
    return acc;
  }, {});

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        
        <div className="page-content">
          <div className="noti-container">
            
            <div className="noti-header-section">
              <div className="noti-title-wrapper">
                <h1 className="noti-page-title">Notifications</h1>
                {unreadCount > 0 && <span className="noti-badge">{unreadCount} New</span>}
              </div>
              <button className="noti-mark-read-btn" onClick={handleMarkAllRead}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Mark all as read
              </button>
            </div>

            <div className="noti-tabs">
              {['All', 'Unread', 'System', 'User Activity'].map(tab => (
                <button 
                  key={tab} 
                  className={`noti-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="noti-list">
              {Object.keys(groupedNotifications).length === 0 ? (
                <div className="noti-empty">No notifications found.</div>
              ) : (
                Object.keys(groupedNotifications).map(group => (
                  <div key={group} className="noti-group">
                    <h3 className="noti-group-title">{group}</h3>
                    <div className="noti-group-items">
                      {groupedNotifications[group].map(noti => (
                        <div 
                          key={noti.id} 
                          className={`noti-card ${noti.isRead ? 'read' : 'unread'}`}
                          onClick={() => handleNotificationClick(noti.id)}
                        >
                          <div className="noti-icon">{noti.icon}</div>
                          <div className="noti-content">
                            <div className="noti-top">
                              <h4>{noti.title}</h4>
                              <span className="noti-time">{noti.time}</span>
                            </div>
                            <p>{noti.desc}</p>
                            <div className="noti-tags">
                              {noti.tags.map(tag => (
                                <span key={tag} className={`noti-tag ${tag === 'SYSTEM' ? 'tag-system' : tag === 'USER ACTIVITY' ? 'tag-user' : 'tag-default'}`}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;