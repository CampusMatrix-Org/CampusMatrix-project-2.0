import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Layout.css';
import { useSettings } from '../../context/SettingsContext';
import { useTasks } from '../../context/TaskContext';

function Header() {
  const { t } = useSettings();
  const navigate = useNavigate();
  const { tasks } = useTasks();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() !== '') {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  };

  const handleResultClick = (task) => {
    setSearchTerm('');
    setIsDropdownOpen(false);
    if (task.type === 'exam') {
      navigate('/exam-countdown');
    } else {
      navigate('/task-manager');
    }
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()))
  ).slice(0, 5);

  return (
    <header className="header">
      <div className="search-container" ref={searchRef}>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder={t('searchPlaceholder')} 
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => { if(searchTerm.trim() !== '') setIsDropdownOpen(true); }}
          />
        </div>

        {isDropdownOpen && searchTerm.trim() !== '' && (
          <div className="search-dropdown">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <div key={task.id} className="search-result-item" onClick={() => handleResultClick(task)}>
                  <div className="result-icon">{task.type === 'exam' ? '📅' : task.type === 'lecture' ? '🏫' : '📝'}</div>
                  <div className="result-info">
                    <h4>{task.title}</h4>
                    <p>{task.type}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="search-no-results">No results found for "{searchTerm}"</div>
            )}
          </div>
        )}
      </div>

      <div className="header-right">
        <button className="notification-btn" onClick={() => navigate('/notifications')}>
          🔔 <span className="notification-dot"></span>
        </button>
        <div className="profile-section" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
          <div className="profile-info">
            <h4 className="profile-name">Jeewantha</h4>
            <p className="profile-degree">Software Engineering</p>
          </div>
          <div className="profile-avatar">
            <img src="https://ui-avatars.com/api/?name=Jeewantha&background=FF7043&color=fff" alt="Profile" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;