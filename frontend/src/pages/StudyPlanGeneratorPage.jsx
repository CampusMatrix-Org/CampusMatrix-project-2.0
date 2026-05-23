import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudyPlanGeneratorPage.css';
import { LuPlus, LuCalendar } from "react-icons/lu"; // 

// Layout Components Import
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

const StudyPlanGeneratorPage = () => {
  const navigate = useNavigate();
  const [intensity, setIntensity] = useState('Moderate');
  const [date, setDate] = useState('');
  const [commitment, setCommitment] = useState('3 - 4 Hours');

  // Dummy documents data
  const documents = [
    { id: 1, name: 'Calculus_Syllabus.pdf', size: '1.2 MB', uploaded: '2h ago', color: '#FF4D4F', bg: '#FFE0E0' },
    { id: 2, name: 'Physics_Notes_V2.pdf', size: '4.5 MB', uploaded: '1d ago', color: '#1890FF', bg: '#E6F7FF' }
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <div className="main-content">
    
        <Header />
        
        <div className="page-content">
          <div className="spg-container scrollable">
            
            {/* Title Breadcrumb */}
            <div className="spg-breadcrumb">
              <h1 className="breadcrumb-light" onClick={() => navigate('/study-tools')}>
                Study Tools
              </h1>
              <span className="breadcrumb-arrow">&gt;</span>
              <h1 className="breadcrumb-dark">Study Plan Generator</h1>
            </div>

            <div className="spg-layout">
              {/* --- LEFT COLUMN --- */}
              <div className="spg-left-col">
                
                {/* Documents Card */}
                <div className="spg-card">
                  <div className="spg-card-header">
                    <div>
                      <h2>Selected Documents</h2>
                      <p>Files used as context for your study plan</p>
                    </div>
                    <button className="spg-add-btn">
                      <LuPlus size={18} /> Add More
                    </button>
                  </div>
                  
                  <div className="spg-doc-list">
                    {documents.map(doc => (
                      <div className="spg-doc-item" key={doc.id}>
                        <div className="spg-doc-icon" style={{ backgroundColor: doc.bg, color: doc.color, fontSize: '20px' }}>
                          📄 
                        </div>
                        <div className="spg-doc-info">
                          <h4>{doc.name}</h4>
                          <span>{doc.size} • Uploaded {doc.uploaded}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Empty State / Ready to Curate */}
                <div className="spg-empty-state">
                  <div className="spg-empty-icon" style={{ fontSize: '28px' }}>
                    ✨ 
                  </div>
                  <h3>Ready to curate?</h3>
                  <p>Configure your goals on the right and tap generate to see<br/>your AI-crafted academic path appear here.</p>
                </div>

              </div>

              {/* --- RIGHT COLUMN --- */}
              <div className="spg-right-col">
                
                {/* Configuration Card */}
                <div className="spg-card">
                  <h2 className="spg-card-title">Plan Configuration</h2>

                  {/* Date Input */}
                  <div className="spg-form-group">
                    <label>TARGET EXAM DATE</label>
                    <div className="spg-input-wrapper">
                      <LuCalendar className="spg-input-icon" />
                      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
                    </div>
                  </div>

                  {/* Intensity Toggles */}
                  <div className="spg-form-group">
                    <label>STUDY INTENSITY</label>
                    <div className="spg-segmented-control">
                      <button type="button" className={intensity === 'Light' ? 'active' : ''} onClick={() => setIntensity('Light')}>Light</button>
                      <button type="button" className={intensity === 'Moderate' ? 'active' : ''} onClick={() => setIntensity('Moderate')}>Moderate</button>
                      <button type="button" className={intensity === 'Intensive' ? 'active' : ''} onClick={() => setIntensity('Intensive')}>Intensive</button>
                    </div>
                    <span className="spg-hint">ⓘ Recommended for steady progress and retention.</span>
                  </div>

                  {/* Time Commitment Dropdown */}
                  <div className="spg-form-group">
                    <label>DAILY TIME COMMITMENT</label>
                    <div className="spg-input-wrapper">
                      <span className="spg-input-icon" style={{ fontSize: '16px' }}>🕒</span> {/* Icon wenuwata */}
                      <select value={commitment} onChange={e => setCommitment(e.target.value)}>
                        <option value="1 - 2 Hours">1 - 2 Hours</option>
                        <option value="2 - 3 Hours">2 - 3 Hours</option>
                        <option value="3 - 4 Hours">3 - 4 Hours</option>
                        <option value="4 - 6 Hours">4 - 6 Hours</option>
                      </select>
                    </div>
                  </div>

                
                  <button className="spg-generate-btn">
                    ⚡ Generate Study Plan
                  </button>
                </div>

        
                <div className="spg-info-card">
                  <p>Link your calendar to automatically block study times based on your existing schedule.</p>
                  <button className="spg-link-btn">
                    Configure Integration <span style={{ fontWeight: 'bold' }}>&gt;</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanGeneratorPage;