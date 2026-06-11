import React, { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import api from '../../services/api';

const fallbackGoals = [
  { title: 'CampusMatrix Project', progress: '85%', color: '#FF7043' },
  { title: 'Java & OOP Mastery', progress: '92%', color: '#0984E3' },
  { title: 'HCI & UX Design', progress: '75%', color: '#6C5CE7' },
  { title: 'Database Systems', progress: '65%', color: '#E17055' },
  { title: 'Statistics & Probability', progress: '60%', color: '#00B894' },
  { title: 'Graphic Design Portfolio', progress: '80%', color: '#FDCB6E' },
  { title: 'Macroeconomics', progress: '40%', color: '#A0A0A0' },
  { title: 'VotingApp Frontend', progress: '30%', color: '#FF7043' },
  { title: 'Network Security', progress: '88%', color: '#0984E3' },
  { title: 'Software Design Patterns', progress: '55%', color: '#6C5CE7' },
  { title: 'React.js Advanced Concepts', progress: '45%', color: '#00B894' },
  { title: 'MongoDB Optimization', progress: '70%', color: '#E17055' },
  { title: 'API Contract Designing', progress: '85%', color: '#FDCB6E' },
  { title: 'Version Control (Advanced Git)', progress: '60%', color: '#FF7043' },
  { title: 'Open Source Contribution', progress: '15%', color: '#0984E3' }
];

function SemesterGoals() {
  const { t } = useSettings();
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState({ gpa: 3.8, credits: 18 });

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await api.get('/dashboard/me');
        if (response.data) {
          setGoals(response.data.goals || fallbackGoals);
          setStats({ gpa: response.data.gpa || 3.8, credits: response.data.credits || 18 });
        }
      } catch (err) {
        console.warn('Failed to fetch semester goals. Using fallback.', err);
        setGoals(fallbackGoals);
      }
    };
    fetchGoals();
  }, []);

  return (
    <div className="widget-card flex-col">
      <div className="widget-header">
        <h3>{t('semesterGoals')}</h3>
        <span className="subtitle-tag">{t('spring2026')}</span>
      </div>
      
      <div className="widget-scroll-area">
        {goals.map((goal, index) => (
          <div className="goal-item" key={index}>
            <div className="goal-info">
              <span>{goal.title}</span>
              <span>{goal.progress}</span>
            </div>
            <div className="progress-bg">
              <div 
                className="progress-fill" 
                style={{ width: goal.progress, background: goal.color }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="widget-fixed-footer stats-footer">
        <div className="stat-box">
          <h2>{stats.gpa}</h2>
          <p>{t('currentGpa')}</p>
        </div>
        <div className="stat-box border-left">
          <h2>{stats.credits}</h2>
          <p>{t('credits')}</p>
        </div>
      </div>
    </div>
  );
}

export default SemesterGoals;