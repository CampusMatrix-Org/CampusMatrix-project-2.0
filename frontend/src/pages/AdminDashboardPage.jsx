import React, { useState } from 'react';
import './AdminDashboardPage.css';

// Admin Components Import
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMaintenance } from '../context/MaintenanceContext';

const signupData = [
  { name: 'JAN', signups: 120 },
  { name: 'FEB', signups: 150 },
  { name: 'MAR', signups: 300 },
  { name: 'APR', signups: 280 },
  { name: 'MAY', signups: 420 },
  { name: 'JUN', signups: 500 },
];

const AdminDashboardPage = () => {
  
  const { isMaintenanceMode } = useMaintenance();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  
  // Custom Calendar State
  const [calendarOpenFor, setCalendarOpenFor] = useState(null); 
  const [startDate, setStartDate] = useState('10/01/2023');
  const [endDate, setEndDate] = useState('10/31/2023');
  const [tempSelectedDay, setTempSelectedDay] = useState(5); 
  
  // Form States for the Modal
  const [reportType, setReportType] = useState('student');
  const [dateRange, setDateRange] = useState('custom');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [includeLogs, setIncludeLogs] = useState(false);
  const [anonymizeData, setAnonymizeData] = useState(true);

  // Dummy logs data
  const systemLogs = [
    { id: 1, type: 'user', icon: '👤', title: 'New user registered', desc: 'Student ID: #ST-9902', time: '2m ago', color: '#52C41A', bg: '#F6FFED' },
    { id: 2, type: 'backup', icon: '☁️', title: 'Server backup completed', desc: 'Weekly routine backup', time: '45m ago', color: '#1890FF', bg: '#E6F7FF' },
    { id: 3, type: 'policy', icon: '🛡️', title: 'Policy updated', desc: 'Revised student handbook v2.4', time: '2h ago', color: '#FAAD14', bg: '#FFFBE6' },
    { id: 4, type: 'alert', icon: '⚠️', title: 'Login failure detected', desc: 'Multiple attempts from IP 192.168.1.1', time: '4h ago', color: '#FF4D4F', bg: '#FFF1F0' },
    { id: 5, type: 'config', icon: '⚙️', title: 'Config change', desc: 'SMTP settings modified by admin', time: '6h ago', color: '#595959', bg: '#F5F5F5' },
    { id: 6, type: 'user', icon: '👤', title: 'New user registered', desc: 'Student ID: #ST-9903', time: '8h ago', color: '#52C41A', bg: '#F6FFED' },
    { id: 7, type: 'resource', icon: '🗂️', title: 'Resource flagged', desc: 'CS101 Midterm Masterclass', time: '12h ago', color: '#FAAD14', bg: '#FFFBE6' },
    { id: 8, type: 'alert', icon: '⚠️', title: 'High CPU usage', desc: 'Server reached 95% CPU load', time: '1d ago', color: '#FF4D4F', bg: '#FFF1F0' },
  ];

  const renderCalendarDays = () => {
    let days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(
        <span 
          key={i} 
          className={`cal-day ${tempSelectedDay === i ? 'active' : ''}`}
          onClick={() => setTempSelectedDay(i)}
        >
          {i}
        </span>
      );
    }
    return days;
  };

  const handleDateSelect = () => {
    const formattedDate = `10/${tempSelectedDay < 10 ? '0'+tempSelectedDay : tempSelectedDay}/2023`;
    if (calendarOpenFor === 'start') setStartDate(formattedDate);
    if (calendarOpenFor === 'end') setEndDate(formattedDate);
    setCalendarOpenFor(null);
  };

  return (
    <div className="dashboard-layout">
      {/* Admin Sidebar */}
      <AdminSidebar />
      
      <div className="main-content">
        {/* Admin Header */}
        <AdminHeader />
        
        <div className="page-content">
          <div className="admin-container scrollable">
            
            {/* 3. Maintenance Alert Banner (Only visible if ON) */}
            {isMaintenanceMode && (
              <div style={{ 
                backgroundColor: '#FFFBE6', border: '1px solid #FFE58F', padding: '16px 20px', 
                borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' 
              }}>
                <span style={{ fontSize: '24px' }}>⚠️</span>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#D46B08', fontSize: '14px', fontWeight: '700' }}>
                    Maintenance Mode is Active
                  </h4>
                  <p style={{ margin: 0, color: '#8C8C8C', fontSize: '13px' }}>
                    Students are currently locked out of the system. Remember to disable this in System Settings when updates are complete.
                  </p>
                </div>
              </div>
            )}

            {/* Page Header */}
            <div className="admin-page-header">
              <div>
                <h1>Overview Dashboard</h1>
                <p>Welcome back, here's what's happening today.</p>
              </div>
              <div className="admin-header-actions">
                <button className="admin-btn-outline">📅 Last 30 Days</button>
                <button className="admin-btn-primary" onClick={() => setIsModalOpen(true)}>
                  ➕ Generate Report
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <div>
                    <h3 className="stat-title">TOTAL STUDENTS</h3>
                    <h2 className="stat-value">12,450</h2>
                  </div>
                  <div className="stat-icon" style={{ color: '#E64A19', background: '#FFF0EB' }}>👤</div>
                </div>
                <div className="stat-trend positive"><strong>+12%</strong> <span className="trend-text">from last month</span></div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <div>
                    <h3 className="stat-title">ACTIVE TASKS</h3>
                    <h2 className="stat-value">856</h2>
                  </div>
                  <div className="stat-icon" style={{ color: '#1890FF', background: '#E6F7FF' }}>📋</div>
                </div>
                <div className="stat-trend positive"><strong>+5%</strong> <span className="trend-text">from yesterday</span></div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <div>
                    <h3 className="stat-title">RESOURCE UPLOADS</h3>
                    <h2 className="stat-value">3,210</h2>
                  </div>
                  <div className="stat-icon" style={{ color: '#722ED1', background: '#F9F0FF' }}>📄</div>
                </div>
                <div className="stat-trend negative"><strong>-2%</strong> <span className="trend-text">lower than average</span></div>
              </div>

              <div className="admin-stat-card border-red">
                <div className="admin-stat-top">
                  <div>
                    <h3 className="stat-title">SYSTEM ALERTS</h3>
                    <h2 className="stat-value text-red">5</h2>
                  </div>
                  <div className="stat-icon" style={{ color: '#FF4D4F', background: '#FFF1F0' }}>⚠️</div>
                </div>
                <div className="stat-trend text-red" style={{ fontWeight: '700' }}>Action required</div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="admin-content-grid">
              
              <div className="admin-panel-card">
                <div className="admin-panel-header">
                  <div>
                    <h3>Student Sign-up Trend</h3>
                    <p>Growth analysis for the past 6 months</p>
                  </div>
                  <div className="chart-legend">
                    <span className="legend-dot"></span> New Enrollments
                  </div>
                </div>
                <div className="admin-chart-container" style={{ width: '100%', height: 250, minHeight: 250 }}>
                  <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                    <AreaChart data={signupData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#E64A19" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#E64A19" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                      <Tooltip contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}} />
                      <Area type="monotone" dataKey="signups" stroke="#E64A19" strokeWidth={3} fillOpacity={1} fill="url(#colorSignups)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="admin-panel-card">
                <div className="admin-panel-header">
                  <h3 style={{ fontSize: '16px' }}>Recent System Logs</h3>
                  <button className="admin-link-btn" onClick={() => setIsLogsModalOpen(true)}>View All</button>
                </div>
                <div className="admin-logs-list">
                  {systemLogs.slice(0, 5).map(log => (
                    <div className="admin-log-item" key={log.id}>
                      <div className="log-icon" style={{ backgroundColor: log.bg, color: log.color }}>
                        {log.icon}
                      </div>
                      <div className="log-info">
                        <h4>{log.title}</h4>
                        <p>{log.desc} • {log.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* --- GENERATE REPORT MODAL --- */}
      {isModalOpen && (
        <div className="report-modal-overlay">
          <div className="report-modal">
            
            <div className="report-modal-header">
              <div>
                <h2>Generate System Report</h2>
                <p>Select the parameters for your academic and system performance report.</p>
              </div>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <div className="report-modal-body">
              
              {/* Report Type */}
              <div className="modal-section">
                <label className="section-label">REPORT TYPE</label>
                <div className="report-type-grid">
                  <div className={`report-type-card ${reportType === 'student' ? 'active' : ''}`} onClick={() => setReportType('student')}>
                    <span className="rtc-icon">👤</span>
                    <div className="rtc-info">
                      <h4>Student Performance</h4>
                      <p>Academic metrics & trends</p>
                    </div>
                  </div>
                  <div className={`report-type-card ${reportType === 'resource' ? 'active' : ''}`} onClick={() => setReportType('resource')}>
                    <span className="rtc-icon">🗂️</span>
                    <div className="rtc-info">
                      <h4>Resource Usage</h4>
                      <p>Campus asset allocation</p>
                    </div>
                  </div>
                  <div className={`report-type-card ${reportType === 'system' ? 'active' : ''}`} onClick={() => setReportType('system')}>
                    <span className="rtc-icon">🖥️</span>
                    <div className="rtc-info">
                      <h4>System Health</h4>
                      <p>Server uptime & latency</p>
                    </div>
                  </div>
                  <div className={`report-type-card ${reportType === 'task' ? 'active' : ''}`} onClick={() => setReportType('task')}>
                    <span className="rtc-icon">✅</span>
                    <div className="rtc-info">
                      <h4>Task Completion</h4>
                      <p>Workflow & task status</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date Range & Custom Calendar Inputs */}
              <div className="modal-section">
                <label className="section-label">DATE RANGE</label>
                <div className="date-pills">
                  <button className={`date-pill ${dateRange === 'last7' ? 'active' : ''}`} onClick={() => setDateRange('last7')}>Last 7 Days</button>
                  <button className={`date-pill ${dateRange === 'last30' ? 'active' : ''}`} onClick={() => setDateRange('last30')}>Last 30 Days</button>
                  <button className={`date-pill ${dateRange === 'custom' ? 'active' : ''}`} onClick={() => setDateRange('custom')}>Custom Range</button>
                </div>
                
                <div className="date-inputs">
                  <div className="date-input-group" onClick={() => setCalendarOpenFor('start')}>
                    <label>Start Date</label>
                    <div className="custom-date-display">{startDate}</div>
                  </div>
                  <div className="date-input-group" onClick={() => setCalendarOpenFor('end')}>
                    <label>End Date</label>
                    <div className="custom-date-display">{endDate}</div>
                  </div>
                </div>
              </div>

              {/* Export Format */}
              <div className="modal-section">
                <label className="section-label">EXPORT FORMAT</label>
                <div className="export-options">
                  <label className="radio-label">
                    <input type="radio" name="format" checked={exportFormat === 'pdf'} onChange={() => setExportFormat('pdf')} />
                    <span className="radio-text">📄 PDF</span>
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="format" checked={exportFormat === 'csv'} onChange={() => setExportFormat('csv')} />
                    <span className="radio-text">📑 CSV</span>
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="format" checked={exportFormat === 'excel'} onChange={() => setExportFormat('excel')} />
                    <span className="radio-text">📊 Excel</span>
                  </label>
                </div>
              </div>

              {/* Advanced Options */}
              <div className="modal-section">
                <label className="section-label">ADVANCED OPTIONS</label>
                
                <div className="advanced-option-item">
                  <div className="ao-text">
                    <h4>Include Detailed Logs</h4>
                    <p>Add granular event-level data to the report.</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={includeLogs} onChange={(e) => setIncludeLogs(e.target.checked)} />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="advanced-option-item">
                  <div className="ao-text">
                    <h4>Anonymize Student Data</h4>
                    <p>Replace real names with unique IDs for privacy.</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={anonymizeData} onChange={(e) => setAnonymizeData(e.target.checked)} />
                    <span className="slider orange"></span>
                  </label>
                </div>
              </div>

            </div>

            <div className="report-modal-footer">
              <button className="modal-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="modal-btn-submit">📥 Generate & Download</button>
            </div>

          </div>
        </div>
      )}

      {/* --- SYSTEM LOGS MODAL --- */}
      {isLogsModalOpen && (
        <div className="report-modal-overlay">
          <div className="report-modal" style={{ maxWidth: '600px' }}>
            <div className="report-modal-header">
              <div>
                <h2>All System Logs</h2>
                <p>Complete history of system events and alerts.</p>
              </div>
              <button className="modal-close-btn" onClick={() => setIsLogsModalOpen(false)}>✕</button>
            </div>
            <div className="report-modal-body" style={{ padding: '20px', maxHeight: '60vh', overflowY: 'auto' }}>
              <div className="admin-logs-list full-list">
                {systemLogs.map(log => (
                  <div className="admin-log-item" key={log.id} style={{ padding: '12px', borderBottom: '1px solid #F0F0F0' }}>
                    <div className="log-icon" style={{ backgroundColor: log.bg, color: log.color }}>
                      {log.icon}
                    </div>
                    <div className="log-info" style={{ flex: 1 }}>
                      <h4>{log.title}</h4>
                      <p>{log.desc}</p>
                    </div>
                    <div style={{ fontSize: '12px', color: '#999', whiteSpace: 'nowrap' }}>
                      {log.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="report-modal-footer">
              <button className="modal-btn-cancel" onClick={() => setIsLogsModalOpen(false)}>Close</button>
              <button className="modal-btn-submit">⬇️ Download Logs</button>
            </div>
          </div>
        </div>
      )}

      {/* --- CUSTOM CALENDAR POPUP --- */}
      {calendarOpenFor && (
        <div className="custom-cal-overlay" onClick={() => setCalendarOpenFor(null)}>
          <div className="custom-cal-container" onClick={e => e.stopPropagation()}>
            
            <div className="custom-cal-header">
              <button className="custom-cal-close" onClick={() => setCalendarOpenFor(null)}>✕</button>
              <span className="custom-cal-subtitle">SELECT A DATE</span>
              <div className="custom-cal-title-row">
                <h2>October 2023</h2>
                <div className="custom-cal-arrows">
                  <span>&lt;</span>
                  <span>&gt;</span>
                </div>
              </div>
            </div>
            
            <div className="custom-cal-body">
              <div className="cal-weekdays">
                <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
              </div>
              <div className="cal-days-grid">
                {renderCalendarDays()}
              </div>
            </div>

            <div className="custom-cal-footer">
              <button className="cal-btn-cancel" onClick={() => setCalendarOpenFor(null)}>Cancel</button>
              <button className="cal-btn-select" onClick={handleDateSelect}>Select Date</button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;