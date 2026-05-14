import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import './FocusTimerPage.css';
import './DashboardPage.css';

function FocusTimerPage() {
  const navigate = useNavigate();

  // Settings State
  const [settings, setSettings] = useState({
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
    autoFocus: false,
    autoBreak: false,
    sound: 'Bell'
  });

  // Timer State
  const [mode, setMode] = useState('focus'); // 'focus', 'shortBreak', 'longBreak'
  const [timeLeft, setTimeLeft] = useState(settings.focus * 60);
  const [isActive, setIsActive] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState({ ...settings });

  // Timer Countdown Logic
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound here in a real app
      alert(`${mode === 'focus' ? 'Focus session' : 'Break'} completed!`);
      
      // Auto-switch logic could go here
      if (mode === 'focus' && settings.autoBreak) {
        handleModeSwitch('shortBreak');
      } else if (mode !== 'focus' && settings.autoFocus) {
        handleModeSwitch('focus');
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, settings]);

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    if (newMode === 'focus') setTimeLeft(settings.focus * 60);
    if (newMode === 'shortBreak') setTimeLeft(settings.shortBreak * 60);
    if (newMode === 'longBreak') setTimeLeft(settings.longBreak * 60);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'focus') setTimeLeft(settings.focus * 60);
    if (mode === 'shortBreak') setTimeLeft(settings.shortBreak * 60);
    if (mode === 'longBreak') setTimeLeft(settings.longBreak * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Settings Handlers
  const openSettings = () => {
    setTempSettings({ ...settings });
    setIsSettingsOpen(true);
  };

  const saveSettings = () => {
    setSettings({ ...tempSettings });
    setIsSettingsOpen(false);
    // Reset current timer if settings changed
    setIsActive(false);
    if (mode === 'focus') setTimeLeft(tempSettings.focus * 60);
    if (mode === 'shortBreak') setTimeLeft(tempSettings.shortBreak * 60);
    if (mode === 'longBreak') setTimeLeft(tempSettings.longBreak * 60);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        
        <div className="page-content">
          <div className="timer-workspace">
            
            {/* Breadcrumbs */}
            <div className="timer-breadcrumb">
              <span className="timer-link" onClick={() => navigate('/study-tools')}>Study Tools</span>
              <span className="timer-separator"> &gt; </span>
              <span className="timer-current">Focus Timer</span>
            </div>

            <div className="timer-main-card">
              
              {/* Tabs */}
              <div className="timer-tabs">
                <button className={`timer-tab ${mode === 'focus' ? 'active' : ''}`} onClick={() => handleModeSwitch('focus')}>Focus</button>
                <button className={`timer-tab ${mode === 'shortBreak' ? 'active' : ''}`} onClick={() => handleModeSwitch('shortBreak')}>Short Break</button>
                <button className={`timer-tab ${mode === 'longBreak' ? 'active' : ''}`} onClick={() => handleModeSwitch('longBreak')}>Long Break</button>
              </div>

              {/* Timer Circle */}
              <div className="timer-circle-wrapper">
                <div className={`timer-circle ${mode}`}>
                  <h1 className="time-display">{formatTime(timeLeft)}</h1>
                  <p className="time-status">{mode === 'focus' ? 'STAY FOCUSED' : 'TAKE A BREAK'}</p>
                </div>
              </div>

              {/* Controls */}
              <div className="timer-controls">
                <button className="control-btn icon-btn" onClick={resetTimer} title="Reset">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                </button>
                <button className={`control-btn start-btn ${isActive ? 'pause' : ''}`} onClick={toggleTimer}>
                  {isActive ? (
                    <><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause</>
                  ) : (
                    <><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Start</>
                  )}
                </button>
                <button className="control-btn icon-btn" onClick={openSettings} title="Settings">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </button>
              </div>

              {/* Task Label */}
              <div className="timer-task-label">
                <span className="task-icon">💼</span> UI Design Project Dashboard
                <div className="task-session">Session 1 of 4</div>
              </div>

            </div>

            {/* Stats Footer */}
            <div className="timer-stats-footer">
              <div className="stat-box">
                <span className="stat-title">TOTAL FOCUSED</span>
                <span className="stat-value">12h 45m</span>
              </div>
              <div className="stat-box">
                <span className="stat-title">SESSIONS</span>
                <span className="stat-value">8 today</span>
              </div>
              <div className="stat-box">
                <span className="stat-title">STREAK</span>
                <span className="stat-value">5 Days</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="modal-overlay">
          <div className="modal-content settings-modal-box">
            <div className="settings-modal-header">
              <h3>Timer Settings</h3>
              <button className="close-btn" onClick={() => setIsSettingsOpen(false)}>✕</button>
            </div>
            
            <div className="settings-modal-body">
              {/* Duration Settings */}
              <div className="settings-group">
                <label className="settings-group-label">⏱ DURATION SETTINGS</label>
                <div className="duration-inputs">
                  <div className="d-input">
                    <label>Focus</label>
                    <input type="number" value={tempSettings.focus} onChange={(e) => setTempSettings({...tempSettings, focus: e.target.value})} />
                  </div>
                  <div className="d-input">
                    <label>Short Break</label>
                    <input type="number" value={tempSettings.shortBreak} onChange={(e) => setTempSettings({...tempSettings, shortBreak: e.target.value})} />
                  </div>
                  <div className="d-input">
                    <label>Long Break</label>
                    <input type="number" value={tempSettings.longBreak} onChange={(e) => setTempSettings({...tempSettings, longBreak: e.target.value})} />
                  </div>
                </div>
              </div>

              {/* Automation Settings */}
              <div className="settings-group">
                <label className="settings-group-label">⚙️ AUTOMATION</label>
                <div className="toggle-row">
                  <div>
                    <h4>Auto-start focus session</h4>
                    <p>Automatically start the next focus block</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" checked={tempSettings.autoFocus} onChange={(e) => setTempSettings({...tempSettings, autoFocus: e.target.checked})} />
                    <span className="slider round"></span>
                  </label>
                </div>
                <div className="toggle-row">
                  <div>
                    <h4>Auto-start break</h4>
                    <p>Jump right into recovery time</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" checked={tempSettings.autoBreak} onChange={(e) => setTempSettings({...tempSettings, autoBreak: e.target.checked})} />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="settings-modal-footer">
              <button className="btn-cancel" onClick={() => setIsSettingsOpen(false)}>Cancel</button>
              <button className="btn-save" onClick={saveSettings}>Save Settings</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default FocusTimerPage;