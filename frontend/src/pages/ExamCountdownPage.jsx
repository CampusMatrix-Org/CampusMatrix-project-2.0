import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExamCountdownPage.css';
import { LuCalendar, LuLightbulb, LuUsers, LuTrendingUp, LuPlus, LuX, LuCalendarDays } from "react-icons/lu";

// Layout Components Import
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { useTasks } from '../context/TaskContext';

const ExamCountdownPage = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState('All Exams'); 

  // Live timer update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const exams = tasks.filter(t => t.type === 'exam').map(t => ({
    ...t,
    datetime: t.dueDate 
  }));

  // Modals State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: null, title: '', date: '', time: '', target: 'A', priority: 'low' });

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);

  // Time Calculation
  const calculateTimeLeft = (targetDateStr) => {
    const total = Date.parse(targetDateStr) - currentTime.getTime();
    if (total <= 0) return { days: '00', hours: '00', mins: '00' };

    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((total / 1000 / 60) % 60);

    return {
      days: days.toString().padStart(2, '0'),
      hours: hours.toString().padStart(2, '0'),
      mins: mins.toString().padStart(2, '0')
    };
  };

  const getPriorityDetails = (priority, isCompleted) => {
    if (isCompleted) return { color: 'gray', status: 'COMPLETED', badge: 'bg-light-gray' };
    if (priority === 'high') return { color: 'red', status: 'URGENT', badge: 'bg-light-red' };
    if (priority === 'medium') return { color: 'yellow', status: 'UPCOMING', badge: 'bg-light-yellow' };
    return { color: 'green', status: 'ON TRACK', badge: 'bg-light-green' };
  };

  const openAddModal = () => {
    setFormData({ id: null, title: '', date: '', time: '', target: 'A', priority: 'low' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (exam) => {
    const dateObj = new Date(exam.datetime);
    const date = dateObj.toISOString().split('T')[0];
    const time = dateObj.toTimeString().slice(0, 5);
    setFormData({ id: exam.id, title: exam.title, date, time, target: exam.target || 'A', priority: exam.priority });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // --- New Delete Logic ---
  const handleDeleteClick = (id) => {
    setExamToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteTask(examToDelete);
    setIsDeleteModalOpen(false);
    setExamToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setExamToDelete(null);
  };
  // ------------------------

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.time) return;

    const newExam = {
      id: isEditing ? formData.id : Date.now(),
      title: formData.title,
      description: `Target Grade: ${formData.target}`,
      target: formData.target,
      dueDate: new Date(`${formData.date}T${formData.time}`).toISOString(),
      priority: formData.priority,
      status: 'to-do',
      type: 'exam'
    };

    if (isEditing) {
      updateTask(newExam);
    } else {
      addTask(newExam);
    }
    setIsModalOpen(false);
  };

  // Filters & Sorting 
  const filteredExams = exams.filter(exam => {
    const isCompleted = new Date(exam.datetime) <= currentTime || exam.status === 'completed';
    if (activeFilter === 'Completed') return isCompleted;
    return !isCompleted; 
  }).sort((a, b) => {
    if (activeFilter === 'High Priority') {
      const p = { high: 3, medium: 2, low: 1 };
      return p[b.priority] - p[a.priority]; 
    }
    return new Date(a.datetime) - new Date(b.datetime); 
  });

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR COMPONENT */}
      <Sidebar />

      <div className="main-content">
        {/* HEADER COMPONENT */}
        <Header />

        <div className="page-content">
          <div className="ec-workspace">
            
            {/* Title Breadcrumb */}
            <div className="study-breadcrumb">
              <span className="sb-link" onClick={() => navigate('/study-tools')}>Study Tools</span>
              <span className="sb-separator"> &gt; </span>
              <span className="sb-current">Exam Countdown</span>
            </div>

            {/* Filter Bar */}
            <div className="ec-filter-bar">
              <div className="ec-filters">
                <button className={`ec-filter-btn ${activeFilter === 'All Exams' ? 'active' : ''}`} onClick={() => setActiveFilter('All Exams')}>All Exams</button>
                <button className={`ec-filter-btn ${activeFilter === 'High Priority' ? 'active' : ''}`} onClick={() => setActiveFilter('High Priority')}>High Priority</button>
                <button className={`ec-filter-btn ${activeFilter === 'Completed' ? 'active' : ''}`} onClick={() => setActiveFilter('Completed')}>Completed</button>
              </div>
            </div>

            {/* Exam List */}
            <div className="ec-list">
              {filteredExams.length === 0 ? (
                <div className="ec-empty-state">No exams found in this category.</div>
              ) : (
                filteredExams.map((exam) => {
                  const isCompleted = new Date(exam.datetime) <= currentTime || exam.status === 'completed';
                  const timeLeft = calculateTimeLeft(exam.datetime);
                  const details = getPriorityDetails(exam.priority, isCompleted);
                  const dateObj = new Date(exam.datetime);
                  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) + ' • ' + dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div className={`ec-card border-${details.color}`} key={exam.id}>
                      <div className="ec-card-left">
                        <div className="ec-card-header">
                          <h2>{exam.title}</h2>
                          <span className={`ec-target-badge ${details.badge}`}>Target: {exam.target}</span>
                        </div>
                        <div className="ec-card-date">
                          <LuCalendar size={14} />
                          <span>{formattedDate}</span>
                        </div>
                        <div className="ec-countdown">
                          <div className="ec-time-block"><span className="ec-time-num">{timeLeft.days}</span><span className="ec-time-lbl">DAYS</span></div>
                          <span className="ec-time-sep">:</span>
                          <div className="ec-time-block"><span className="ec-time-num">{timeLeft.hours}</span><span className="ec-time-lbl">HOURS</span></div>
                          <span className="ec-time-sep">:</span>
                          <div className="ec-time-block"><span className="ec-time-num">{timeLeft.mins}</span><span className="ec-time-lbl">MINS</span></div>
                        </div>
                      </div>
                      <div className="ec-card-right">
                        <span className={`ec-status-badge text-${details.color}`}>{details.status}</span>
                        <div className="ec-actions-row">
                          <div className="ec-buttons">
                            <button className="ec-btn-edit" onClick={() => openEditModal(exam)}>Edit</button>
                            <button className="ec-btn-delete" onClick={() => handleDeleteClick(exam.id)}>Delete</button>
                          </div>
                          <div className={`ec-placeholder-img bg-${details.color}`}></div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <button className="fab-button" onClick={openAddModal}>+</button>

            {/* Bottom Cards */}
            <div className="ec-bottom-cards">
              <div className="ec-info-card"><LuLightbulb className="ec-info-icon" size={24} color="#FF7043" /><h3>Study Tip</h3><p>Active recall and spaced repetition are your best friends.</p></div>
              <div className="ec-info-card"><LuUsers className="ec-info-icon" size={24} color="#5C7CFA" /><h3>Study Groups</h3><p>Join the active study group for your upcoming exams.</p></div>
              <div className="ec-info-card"><LuTrendingUp className="ec-info-icon" size={24} color="#20C997" /><h3>Overall Progress</h3><div className="ec-progress-bar"><div className="ec-progress-fill" style={{ width: '65%' }}></div></div><p className="ec-progress-text">65% of course materials covered.</p></div>
            </div>

          </div>
        </div>
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {isModalOpen && (
        <div className="ec-modal-overlay">
          <div className="ec-modal">
            <div className="ec-modal-header">
              <div className="flex-align">
                <LuCalendarDays color="#FF7043" size={20} />
                <h3>{isEditing ? 'Edit Exam' : 'Add New Exam'}</h3>
              </div>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
            </div>
            <form onSubmit={handleSubmit} className="ec-modal-form">
              <div className="ec-form-group">
                <label>Subject Name</label>
                <input type="text" placeholder="e.g., Software Engineering" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="ec-form-row">
                <div className="ec-form-group flex-1">
                  <label>Exam Date</label>
                  <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                </div>
                <div className="ec-form-group flex-1">
                  <label>Exam Time</label>
                  <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} required />
                </div>
              </div>
              <div className="ec-form-group">
                <label>Target Grade</label>
                <select value={formData.target} onChange={e => setFormData({...formData, target: e.target.value})}>
                  <option value="A+">A+</option><option value="A">A</option><option value="A-">A-</option><option value="B+">B+</option><option value="B">B</option><option value="C">C</option>
                </select>
              </div>
              <div className="ec-form-group">
                <label>Priority / Urgency Level</label>
                <div className="ec-priority-group">
                  <button type="button" className={`ec-pri-btn ${formData.priority === 'low' ? 'active-low' : ''}`} onClick={() => setFormData({...formData, priority: 'low'})}><span className="dot dot-green"></span> Low</button>
                  <button type="button" className={`ec-pri-btn ${formData.priority === 'medium' ? 'active-medium' : ''}`} onClick={() => setFormData({...formData, priority: 'medium'})}><span className="dot dot-yellow"></span> Medium</button>
                  <button type="button" className={`ec-pri-btn ${formData.priority === 'high' ? 'active-high' : ''}`} onClick={() => setFormData({...formData, priority: 'high'})}><span className="dot dot-red"></span> High</button>
                </div>
              </div>
              <div className="ec-modal-actions">
                <button type="submit" className="ec-submit-btn">{isEditing ? 'Save Changes' : 'Add Exam'}</button>
                <button type="button" className="ec-cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CUSTOM DELETE CONFIRMATION MODAL --- */}
      {isDeleteModalOpen && (
        <div className="ec-modal-overlay">
          <div className="ec-delete-modal">
            <h3>Are You Sure Delete this ?</h3>
            <div className="ec-delete-actions">
              <button className="ec-delete-btn-yes" onClick={confirmDelete}>YES</button>
              <button className="ec-delete-btn-no" onClick={cancelDelete}>NO</button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default ExamCountdownPage;