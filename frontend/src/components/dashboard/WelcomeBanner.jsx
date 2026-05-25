import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

function WelcomeBanner() {
  const navigate = useNavigate();
  const { t } = useSettings();

  return (
    <div className="welcome-banner">
      <div className="banner-content">
        <h2>{t('welcomeTitle')}</h2>
        <p>{t('welcomeSubtitle1')}<strong>3{t('welcomeSubtitle2')}</strong>{t('welcomeSubtitle3')}<br/>{t('welcomeGpa')}<strong>3.8</strong>{t('welcomeGpaEnd')}</p>
        <div className="banner-buttons">
          <button className="btn primary-btn btn-white" onClick={() => navigate('/exam-countdown')}>{t('viewExamSchedule')}</button>
          <button className="btn secondary-btn btn-outline-white" onClick={() => navigate('/personal-library')}>{t('courseMaterials')}</button>
        </div>
      </div>
    </div>
  );
}
export default WelcomeBanner;