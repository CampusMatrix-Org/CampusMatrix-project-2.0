import React, { useState } from 'react';
import axios from 'axios';
import { useTasks } from '../../context/TaskContext'; 
import './Modal.css';

function AddTaskModal({ isOpen, onClose }) {
  const { addTask } = useTasks(); 
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' 
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
      priority: formData.priority 
    };

    try {
      const token = localStorage.getItem('token'); 
      
      await axios.post('http://localhost:8080/api/v1/tasks', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      addTask(payload); 
      setFormData({ title: '', description: '', dueDate: '', priority: 'medium' });
      onClose();
      alert('Task created successfully! 🎉'); 
      
    } catch (err) {
      console.error('Error creating task:', err);
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
          <h2>Add New Task</h2>
          <p>Add details to create a new task.</p>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Name</label>
            <input 
              type="text" 
              name="title"
              placeholder="Task Name" 
              value={formData.title}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <input 
              type="text" 
              name="description"
              placeholder="Description (e.g., Chapter 4 homework)" 
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Priority Dropdown */}
          <div className="form-group">
            <label>Priority Level</label>
            <select 
              name="priority" 
              value={formData.priority} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1.5px solid #EAEAEA', outline: 'none', cursor: 'pointer' }}
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input 
              type="date" 
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required 
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;