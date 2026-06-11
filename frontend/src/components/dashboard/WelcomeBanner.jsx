import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import api from '../../services/api';

function WelcomeBanner() {
  const navigate = useNavigate();
  const { t } = useSettings();
  const [stats, setStats] = useState({ pendingAssignments: 3, gpa: 3.8 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/me');
        if (response.data) setStats(response.data);
      } catch (err) {
        console.warn('Failed to fetch dashboard stats. Using fallback.', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="welcome-banner">
      <div className="banner-content">
        <h2>{t('welcomeTitle')}</h2>
        <p>{t('welcomeSubtitle1')}<strong>{stats.pendingAssignments}{t('welcomeSubtitle2')}</strong>{t('welcomeSubtitle3')}<br/>{t('welcomeGpa')}<strong>{stats.gpa}</strong>{t('welcomeGpaEnd')}</p>
        <div className="banner-buttons">
          <button className="btn primary-btn btn-white" onClick={() => navigate('/exam-countdown')}>{t('viewExamSchedule')}</button>
          <button className="btn secondary-btn btn-outline-white" onClick={() => navigate('/personal-library')}>{t('courseMaterials')}</button>
        </div>
      </div>
    </div>
  );
}
export default WelcomeBanner;