import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudyPlanGeneratorPage.css';
import { LuPlus, LuCalendar } from "react-icons/lu"; 
import { FiLoader, FiCheckCircle } from "react-icons/fi";

// Layout Components Import
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { useTasks } from '../context/TaskContext';

const StudyPlanGeneratorPage = () => {
  const navigate = useNavigate();
  const { addTask } = useTasks();
  const fileInputRef = useRef(null);
  
  const [intensity, setIntensity] = useState('Moderate');
  const [date, setDate] = useState('');
  const [commitment, setCommitment] = useState('3 - 4 Hours');

  // Dynamic Documents State
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Calculus_Syllabus.pdf', size: '1.2 MB', uploaded: '2h ago', color: '#FF4D4F', bg: '#FFE0E0' },
    { id: 2, name: 'Physics_Notes_V2.pdf', size: '4.5 MB', uploaded: '1d ago', color: '#1890FF', bg: '#E6F7FF' }
  ]);

  // AI Generation States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  // File Upload Handlers
  const handleAddMoreClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newDocs = files.map((f, index) => ({
        id: Date.now() + index,
        name: f.name,
        size: (f.size / (1024 * 1024)).toFixed(1) + ' MB',
        uploaded: 'Just now',
        color: '#20C997', // Greenish for new
        bg: '#E6FCF5'
      }));
      setDocuments([...documents, ...newDocs]);
    }
  };

  // AI Mock Generation
  const generateStudyPlan = () => {
    if (!date) {
      alert("Please select a target exam date.");
      return;
    }
    if (documents.length === 0) {
      alert("Please add at least one document for the AI to analyze.");
      return;
    }

    setIsGenerating(true);

    // Simulate AI processing delay
    setTimeout(() => {
      // Create mock plan tasks
      const mockTasks = [
        {
          title: `Study Session 1: ${documents[0]?.name.split('.')[0] || 'Core Concepts'}`,
          description: `AI Generated task based on ${intensity} intensity plan.`,
          priority: 'high',
          type: 'task'
        },
        {
          title: `Practice Questions for ${date}`,
          description: `Daily ${commitment} commitment requirement.`,
          priority: 'medium',
          type: 'task'
        },
        {
          title: 'Review Notes and Summary',
          description: 'Spaced repetition block for uploaded materials.',
          priority: 'medium',
          type: 'lecture'
        }
      ];

      // Automatically add to TaskContext (Calendar & Tasks)
      const targetDateObj = new Date(date);
      mockTasks.forEach((task, index) => {
        // Distribute dates leading up to the exam
        const taskDate = new Date(targetDateObj);
        taskDate.setDate(taskDate.getDate() - (index + 1));
        
        addTask({
          title: task.title,
          description: task.description,
          status: 'to-do',
          priority: task.priority,
          dueDate: taskDate.toISOString(),
          type: task.type
        });
      });

      setGeneratedPlan(mockTasks);
      setIsGenerating(false);
    }, 2500); // 2.5s generation time
  };



  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <div className="main-content">
    
        <Header />
        
        <div className="page-content">
          <div className="spg-workspace">
            
            {/* Title Breadcrumb */}
            <div className="study-breadcrumb">
              <span className="sb-link" onClick={() => navigate('/study-tools')}>Study Tools</span>
              <span className="sb-separator"> &gt; </span>
              <span className="sb-current">Study Plan Generator</span>
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
                    <input 
                      type="file" 
                      multiple 
                      ref={fileInputRef} 
                      style={{ display: 'none' }} 
                      onChange={handleFileChange} 
                    />
                    <button className="spg-add-btn" onClick={handleAddMoreClick}>
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

                {/* AI Generation State or Generated Plan View */}
                {isGenerating ? (
                  <div className="spg-generating-state">
                    <FiLoader className="spg-spinner" size={48} />
                    <h3>AI is analyzing your materials...</h3>
                    <p>Extracting topics, calculating difficulty, and scheduling your study blocks.</p>
                  </div>
                ) : generatedPlan ? (
                  <div className="spg-generated-view">
                    <div className="spg-success-banner">
                      <FiCheckCircle size={24} color="#20C997" />
                      <div>
                        <h3>Study Plan Generated!</h3>
                        <p>We've automatically added these blocks to your Tasks & Calendar.</p>
                      </div>
                    </div>
                    
                    <div className="spg-plan-list">
                      {generatedPlan.map((task, idx) => (
                        <div className="spg-plan-item" key={`plan-task-${idx}`}>
                          <div className="spg-plan-item-left">
                            <span className={`spg-plan-dot ${task.type}`}></span>
                            <div className="spg-plan-item-info">
                              <h4>{task.title}</h4>
                              <p>{task.description}</p>
                            </div>
                          </div>
                          <span className={`spg-plan-badge priority-${task.priority}`}>{task.priority}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="spg-empty-state">
                    <div className="spg-empty-icon" style={{ fontSize: '28px' }}>
                      ✨ 
                    </div>
                    <h3>Ready to curate?</h3>
                    <p>Configure your goals on the right and tap generate to see<br/>your AI-crafted academic path appear here.</p>
                  </div>
                )}

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

                
                  <button className="spg-generate-btn" onClick={generateStudyPlan} disabled={isGenerating}>
                    {isGenerating ? 'Generating...' : '⚡ Generate Study Plan'}
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