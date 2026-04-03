import React, { useState } from 'react';
import axios from 'axios';
import './Modal.css';

function AddTaskModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: ''
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

    try {

      const token = localStorage.getItem('token'); 
      
      await axios.post('http://localhost:8080/api/v1/tasks', {
        title: formData.title,
        description: formData.description, 
        dueDate: new Date(formData.dueDate).toISOString(),
        status: 'pending',
        priority: 'medium'
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });


      setFormData({ title: '', description: '', dueDate: '' });
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
        <button className="modal-close" onClick={onClose}>&times;</button>
        
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
              placeholder="First Project" 
              value={formData.description}
              onChange={handleChange}
              required
            />
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