import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { Link } from 'react-router-dom'; 
import { useSettings } from '../../context/SettingsContext';

function TodaySchedule() {
  const { tasks } = useTasks();
  const { t } = useSettings();

  const todayString = new Date().toDateString();

  const todaysTasks = tasks
    .filter(task => task.dueDate && new Date(task.dueDate).toDateString() === todayString)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const getColor = (task) => {
    if (task.type === 'exam') return '#FF5252';
    if (task.type === 'lecture') return '#2196F3';
    return '#4CAF50'; 
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="widget-card flex-col">
      <div className="widget-header">
        <h3>{t('todaySchedule')}</h3>
        <Link to="/calendar">{t('seeFull')}</Link>
      </div>
      
      <div className="widget-scroll-area">
        {todaysTasks.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', marginTop: '30px' }}>
            <p style={{ fontWeight: '600', marginBottom: '5px' }}>{t('noEvents')}</p>
            <p style={{ fontSize: '0.8rem' }}>{t('dragEvent')}</p>
          </div>
        ) : (
          <div className="timeline">
            {todaysTasks.map((task) => (
              <div className="timeline-item" key={task.id}>
                <div className="time">{formatTime(task.dueDate)}</div>
                <div className="timeline-card" style={{ borderLeftColor: getColor(task) }}>
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TodaySchedule;