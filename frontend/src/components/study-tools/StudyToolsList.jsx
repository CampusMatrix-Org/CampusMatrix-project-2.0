import React from 'react';
import './StudyTools.css';


const toolsData = [
  { id: 1, title: 'Smart Flashcards', description: 'Spaced-repetition systems that adapt to your specific learning pace.', icon: '📇' },
  { id: 2, title: 'Focus Timer', description: 'Pomodoro techniques and LoFi audio to keep you in the deep work zone.', icon: '⏱️' },
  { id: 3, title: 'Academic Analytics', description: 'Visual feedback on your study patterns and grade projections.', icon: '📊' },
  { id: 4, title: 'Personal Library', description: 'High-end file management for your academic resources.', icon: '📚' },
  { id: 5, title: 'Exam Countdown', description: 'Stay ahead with smart, color-coded urgency timers for major exams.', icon: '⏳' },
  { id: 6, title: 'Study Plan Generator', description: 'Transform your course materials into a structured academic schedule tailored to your pace and goals.', icon: '🗓️' }
];

function StudyToolsList() {
  return (
    <div className="widget-card flex-col" style={{ height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
      <div className="widget-header">
        <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Study Tools</h3>
      </div>
      
      <div className="study-tools-container">
        {toolsData.map((tool) => (
          <div className="tool-card" key={tool.id}>
            <div className="tool-icon-box">
              {tool.icon}
            </div>
            <div className="tool-info">
              <h4>{tool.title}</h4>
              <p>{tool.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudyToolsList;