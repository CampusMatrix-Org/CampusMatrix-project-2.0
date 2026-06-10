import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import './StudyTools.css';


const toolsData = [
  { id: 1, title: 'Smart Flashcards', description: 'Spaced-repetition systems that adapt to your specific learning pace.', icon: '📇', route: '/smart-flashcards' },
  { id: 2, title: 'Focus Timer', description: 'Pomodoro techniques and LoFi audio to keep you in the deep work zone.', icon: '⏱️', route: '/focus-timer' },
  { id: 3, title: 'Academic Analytics', description: 'Visual feedback on your study patterns and grade projections.', icon: '📊', route: '/academic-analytics' },
  { id: 4, title: 'Personal Library', description: 'High-end file management for your academic resources.', icon: '📚', route: '/personal-library' },
  { id: 5, title: 'Exam Countdown', description: 'Stay ahead with smart, color-coded urgency timers for major exams.', icon: '⏳', route: '/exam-countdown' },
  { id: 6, title: 'Study Plan Generator', description: 'Transform your course materials into a structured academic schedule tailored to your pace and goals.', icon: '🗓️', route: '/study-plan-generator' }
];

function StudyToolsList() {
  const { t } = useSettings();

  const getTranslatedTitle = (title) => {
    switch (title) {
      case 'Smart Flashcards': return t('flashcards');
      case 'Focus Timer': return t('focusTimer');
      case 'Academic Analytics': return t('academicAnalytics');
      case 'Personal Library': return t('libraryTitle');
      case 'Exam Countdown': return t('examCountdown');
      case 'Study Plan Generator': return t('studyPlan');
      default: return title;
    }
  };

  const getTranslatedDescription = (title) => {
    switch (title) {
      case 'Smart Flashcards': return t('flashcardsDesc');
      case 'Focus Timer': return t('focusTimerDesc');
      case 'Academic Analytics': return t('academicAnalyticsDesc');
      case 'Personal Library': return t('libraryDesc2');
      case 'Exam Countdown': return t('examCountdownDesc');
      case 'Study Plan Generator': return t('studyPlanDesc');
      default: return "";
    }
  };

  return (
    <div className="study-tools-wrapper">
      <div className="study-tools-header" style={{ marginBottom: '20px', padding: '0 15px' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0 }}>{t('studyToolsTitle')}</h3>
      </div>
      
      <div className="study-tools-container">
        {toolsData.map((tool) => (
          <Link 
            to={tool.route} 
            className="tool-card" 
            key={tool.id}
          >
            <div className="tool-icon-box">
              {tool.icon}
            </div>
            <div className="tool-info">
              <h4>{getTranslatedTitle(tool.title)}</h4>
              <p>{getTranslatedDescription(tool.title)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default StudyToolsList;