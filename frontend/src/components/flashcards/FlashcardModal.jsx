import React, { useState, useEffect } from 'react';
import '../dashboard/Modal.css'; // Reusing existing modal styles

function FlashcardModal({ isOpen, onClose, editData }) {
  const [formData, setFormData] = useState({
    deck: 'Algorithms',
    question: '',
    answer: ''
  });

  const isEditMode = !!editData;

  // Pre-fill data if editing
  useEffect(() => {
    if (editData) {
      setFormData({
        deck: 'Algorithms',
        question: editData.question || '',
        answer: editData.answer || ''
      });
    } else {
      setFormData({ deck: 'Algorithms', question: '', answer: '' });
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isEditMode ? "Updating Card:" : "Creating Card:", formData);
    // Add API logic here later
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ width: '500px' }}>
        <button className="modal-close" onClick={onClose}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
        
        <div className="modal-header">
          <h2>{isEditMode ? 'Edit Flashcard' : 'Create Flashcard'}</h2>
          <p>{isEditMode ? 'Update content for your active recall sessions' : 'Create your own flashcards'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Study Deck</label>
            <select name="deck" value={formData.deck} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
              <option value="Algorithms">Algorithms</option>
              <option value="Database Systems">Database Systems</option>
              <option value="Macroeconomics">Macroeconomics</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Front (Question)</label>
            <textarea 
              name="question"
              rows="3"
              value={formData.question}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #EAEAEA', resize: 'none' }}
              required 
            />
          </div>

          <div className="form-group">
            <label>Back (Answer)</label>
            <textarea 
              name="answer"
              rows="4"
              value={formData.answer}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #EAEAEA', resize: 'none' }}
              required 
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn outline-btn" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
              {isEditMode ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FlashcardModal;