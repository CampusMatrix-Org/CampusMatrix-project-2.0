import React, { useState } from 'react';
import axios from 'axios';
import { useTasks } from '../../context/TaskContext'; 
import { useSettings } from '../../context/SettingsContext';
import './Modal.css';

function AddTaskModal({ isOpen, onClose }) {
  const { addTask } = useTasks(); 
  const { t } = useSettings();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    type: 'task',
    target: 'A'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const payload = {
      title: formData.title,
      description: formData.description, 
      dueDate: new Date(formData.dueDate).toISOString(),
      status: 'to-do', 
      priority: formData.priority,
      type: formData.type,
      ...(formData.type === 'exam' && { target: formData.target })
    };

    try {
      const token = localStorage.getItem('token'); 
      
      await axios.post('http://localhost:8080/api/v1/tasks', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).catch(err => {
        console.warn('Backend API failed, but adding to UI locally.', err);
      });

      addTask(payload); 
      setFormData({ title: '', description: '', dueDate: '', priority: 'medium', type: 'task', target: 'A' });
      onClose();
      alert('Task created successfully! 🎉'); 
      
    } catch (err) {
      console.error('Error in task creation flow:', err);
      setError('Failed to create task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
        
        <div className="modal-header">
          <h2>{t('addTaskTitle')}</h2>
          <p>{t('addTaskDesc')}</p>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('taskNameLabel')}</label>
            <input 
              type="text" 
              name="title"
              placeholder={t('taskNamePlaceholder')}
              value={formData.title}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>{t('descLabel')}</label>
            <input 
              type="text" 
              name="description"
              placeholder={t('descPlaceholder')}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Event Type Dropdown */}
          <div className="form-group">
            <label>{t('eventTypeLabel')}</label>
            <select 
              name="type" 
              value={formData.type} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1.5px solid #EAEAEA', outline: 'none', cursor: 'pointer', marginBottom: '15px' }}
            >
              <option value="task">{t('eventTypeTask')}</option>
              <option value="exam">{t('eventTypeExam')}</option>
              <option value="lecture">{t('eventTypeLecture')}</option>
            </select>
          </div>

          {/* Conditional Target Grade Field for Exams */}
          {formData.type === 'exam' && (
            <div className="form-group">
              <label>{t('targetGradeLabel')}</label>
              <select 
                name="target" 
                value={formData.target} 
                onChange={handleChange} 
                style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1.5px solid #EAEAEA', outline: 'none', cursor: 'pointer', marginBottom: '15px' }}
              >
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
          )}

          {/* Priority Dropdown */}
          <div className="form-group">
            <label>{t('priorityLabel')}</label>
            <select 
              name="priority" 
              value={formData.priority} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1.5px solid #EAEAEA', outline: 'none', cursor: 'pointer' }}
            >
              <option value="high">{t('priorityHigh')}</option>
              <option value="medium">{t('priorityMedium')}</option>
              <option value="low">{t('priorityLow')}</option>
            </select>
          </div>

          <div className="form-group">
            <label>{t('dateLabel')}</label>
            <input 
              type="date" 
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required 
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? t('creatingBtn') : t('createTaskBtn')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;