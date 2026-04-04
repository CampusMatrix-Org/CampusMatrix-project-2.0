import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import './SmartFlashcards.css';

const initialCard = {
  question: "What is a Hash Collision?",
  answer: "A Hash Collision occurs when a hash function maps two distinct keys and calculates the exact same index for both of them in a hash table."
};

function FlashcardWidget({ onEditClick }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showSRS, setShowSRS] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setShowSRS(true);
    }
  };

  const handleSRSChoice = (choice) => {
 
    console.log(`User selected: ${choice}`);
    
    setIsFlipped(false);
    setShowSRS(false);
  };

  return (
    <div className="widget-card flex-col" style={{ height: 'calc(100vh - 120px)' }}>
      
      <div className="flashcard-header">
        <div className="breadcrumb">
          <Link to="/study-tools">Study Tools</Link> <span>{'>'}</span> Smart Flashcards
        </div>
      </div>

      <div className="flashcard-container">
        
        <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
          <div className="card-face front">
            <button className="card-edit-btn" onClick={(e) => { e.stopPropagation(); onEditClick(initialCard); }}>✏️</button>
            <span className="card-label">Question</span>
            <h2 className="card-text">{initialCard.question}</h2>
          </div>

          <div className="card-face back">
            <button className="card-edit-btn" onClick={(e) => { e.stopPropagation(); onEditClick(initialCard); }}>✏️</button>
            <span className="card-label">Answer</span>
            <p className="card-text" style={{ fontSize: '1.2rem', fontWeight: '500' }}>
              {initialCard.answer}
            </p>
          </div>
        </div>

        <div className="srs-buttons" style={{ opacity: showSRS ? 1 : 0, pointerEvents: showSRS ? 'auto' : 'none', transition: 'opacity 0.3s' }}>
          <div className="srs-btn again" onClick={() => handleSRSChoice('again')}>
            <span className="srs-label">Again</span>
            <span className="srs-time">&lt;1m</span>
          </div>
          <div className="srs-btn hard" onClick={() => handleSRSChoice('hard')}>
            <span className="srs-label">Hard</span>
            <span className="srs-time">2d</span>
          </div>
          <div className="srs-btn good" onClick={() => handleSRSChoice('good')}>
            <span className="srs-label">Good</span>
            <span className="srs-time">4d</span>
          </div>
          <div className="srs-btn easy" onClick={() => handleSRSChoice('easy')}>
            <span className="srs-label">Easy</span>
            <span className="srs-time">7d</span>
          </div>
        </div>

        <div className="status-indicators">
          <div className="status-item"><div className="dot new"></div> New: 12</div>
          <div className="status-item"><div className="dot learning"></div> Learning: 5</div>
          <div className="status-item"><div className="dot due"></div> Due: 33</div>
        </div>

      </div>
    </div>
  );
}

export default FlashcardWidget;