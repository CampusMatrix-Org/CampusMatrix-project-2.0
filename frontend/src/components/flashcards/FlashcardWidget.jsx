import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import './SmartFlashcards.css';

const hardcodedCards = [
  { id: 1, deck: "Algorithms", question: "What is a Hash Collision?", answer: "A Hash Collision occurs when a hash function maps two distinct keys and calculates the exact same index for both of them in a hash table." },
  { id: 2, deck: "Algorithms", question: "Time complexity of Binary Search?", answer: "The time complexity is O(log n). This is because with each comparison, the search space is effectively halved." },
  { id: 3, deck: "Database Systems", question: "What is ACID property?", answer: "ACID stands for Atomicity, Consistency, Isolation, and Durability. It ensures reliable processing of database transactions." }
];

function FlashcardWidget({ onEditClick }) {
  const [activeTab, setActiveTab] = useState('study'); 
  
  // Load from localStorage + hardcoded on mount
  const getInitialCards = () => {
    const saved = JSON.parse(localStorage.getItem('campusMatrixFlashcards')) || [];
    // Merge: avoid duplicate IDs
    const savedIds = new Set(saved.map(c => c.id));
    const unique = hardcodedCards.filter(c => !savedIds.has(c.id));
    return [...unique, ...saved];
  };

  // App State
  const [cards, setCards] = useState(getInitialCards);
  const [selectedDeck, setSelectedDeck] = useState('All');
  const [cardToDelete, setCardToDelete] = useState(null);
  const [newAiCount, setNewAiCount] = useState(0);

  // Watch localStorage for new AI cards being added
  useEffect(() => {
    const handleStorage = () => {
      const saved = JSON.parse(localStorage.getItem('campusMatrixFlashcards')) || [];
      const savedIds = new Set(saved.map(c => c.id));
      const existing = hardcodedCards.filter(c => !savedIds.has(c.id));
      const merged = [...existing, ...saved];
      setCards(merged);
      const aiCards = saved.filter(c => c.deck === 'AI Generated');
      setNewAiCount(aiCards.length);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);
  
  // Study Session State
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showSRS, setShowSRS] = useState(false);

  // --- Logic: Filter Cards ---
  const decks = ['All', ...new Set(cards.map(c => c.deck))];
  const studyCards = selectedDeck === 'All' ? cards : cards.filter(c => c.deck === selectedDeck);
  const currentCard = studyCards[currentCardIndex];

  // --- Navigation Controls ---
  const handleNext = () => {
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
      setShowSRS(false);
    }
  };

  const handlePrev = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
      setShowSRS(false);
    }
  };

  // --- Study Mode Actions ---
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) setShowSRS(true);
  };

  const handleSRSChoice = (choice) => {
    console.log(`User selected: ${choice} for Card ID: ${currentCard.id}`);
    setIsFlipped(false);
    setShowSRS(false);
    
    // Auto-advance on SRS click
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      alert("Session Complete! You've reviewed all cards in this deck.");
      setCurrentCardIndex(0); 
    }
  };

  const handleDeckChange = (e) => {
    setSelectedDeck(e.target.value);
    setCurrentCardIndex(0); 
    setIsFlipped(false);
    setShowSRS(false);
  };

  const confirmDelete = () => {
    setCards(cards.filter(c => c.id !== cardToDelete.id)); 
    setCardToDelete(null); 
    setCurrentCardIndex(0); 
  };

  return (
    <div className="flashcard-widget-wrapper" style={{ position: 'relative' }}>
      <div className="fc-workspace">
      
      <div className="flashcard-header">
        <div className="study-breadcrumb">
          <Link className="sb-link" to="/study-tools">Study Tools</Link> <span className="sb-separator">&gt;</span> <span className="sb-current">Smart Flashcards</span>
        </div>
      </div>

      <div className="flashcard-tabs">
        <button className={`tab-btn ${activeTab === 'study' ? 'active' : ''}`} onClick={() => setActiveTab('study')}>Study Session</button>
        <button className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`} onClick={() => setActiveTab('manage')}>
          Manage Cards
          {newAiCount > 0 && <span className="ai-badge-count">{newAiCount} AI</span>}
        </button>
      </div>

      {/* --- View 1: STUDY SESSION MODE --- */}
      {activeTab === 'study' && (
        <>
          <div className="deck-selector">
            <label>Select Deck: </label>
            <select className="deck-select-input" value={selectedDeck} onChange={handleDeckChange}>
              {decks.map(deck => <option key={deck} value={deck}>{deck}</option>)}
            </select>
          </div>

          {studyCards.length > 0 ? (
            <div className="flashcard-container" style={{ marginTop: '0' }}>
              <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
                <div className="card-face front">
                  <button className="card-edit-btn" onClick={(e) => { e.stopPropagation(); onEditClick(currentCard); }}>✏️</button>
                  <span className="card-label">Question ({currentCard.deck})</span>
                  <h2 className="card-text">{currentCard.question}</h2>
                </div>
                <div className="card-face back">
                  <button className="card-edit-btn" onClick={(e) => { e.stopPropagation(); onEditClick(currentCard); }}>✏️</button>
                  <span className="card-label">Answer</span>
                  <p className="card-text" style={{ fontSize: '1.2rem', fontWeight: '500' }}>{currentCard.answer}</p>
                </div>
              </div>

              <div className="card-navigation">
                <button className="nav-btn" onClick={handlePrev} disabled={currentCardIndex === 0} title="Previous Card">
                  &larr;
                </button>
                <span className="card-counter">
                  {currentCardIndex + 1} / {studyCards.length}
                </span>
                <button className="nav-btn" onClick={handleNext} disabled={currentCardIndex === studyCards.length - 1} title="Next Card">
                  &rarr;
                </button>
              </div>

              <div className="srs-buttons" style={{ opacity: showSRS ? 1 : 0, pointerEvents: showSRS ? 'auto' : 'none', transition: 'opacity 0.3s', marginTop: '20px' }}>
                <div className="srs-btn again" onClick={() => handleSRSChoice('again')}><span className="srs-label">Again</span><span className="srs-time">&lt;1m</span></div>
                <div className="srs-btn hard" onClick={() => handleSRSChoice('hard')}><span className="srs-label">Hard</span><span className="srs-time">2d</span></div>
                <div className="srs-btn good" onClick={() => handleSRSChoice('good')}><span className="srs-label">Good</span><span className="srs-time">4d</span></div>
                <div className="srs-btn easy" onClick={() => handleSRSChoice('easy')}><span className="srs-label">Easy</span><span className="srs-time">7d</span></div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>
              <h2>No cards found in "{selectedDeck}".</h2>
              <p>Switch to Manage Cards and create some new ones!</p>
            </div>
          )}
        </>
      )}

      {/* --- View 2: MANAGE CARDS MODE --- */}
      {activeTab === 'manage' && (
        <div className="cards-grid">
          {cards.map((card) => (
            <div className={`mini-card ${card.deck === 'AI Generated' ? 'ai-generated-card' : ''}`} key={card.id}>
              <div className="mini-card-deck">
                {card.deck}
                {card.deck === 'AI Generated' && <span className="ai-chip">✨ AI</span>}
              </div>
              <div className="mini-card-q">{card.question}</div>
              <div className="mini-card-a">{card.answer}</div>
              <div className="mini-card-actions">
                <button className="icon-btn" onClick={() => onEditClick(card)} title="Edit">✏️</button>
                <button className="icon-btn delete" onClick={() => setCardToDelete(card)} title="Delete">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- Delete Confirmation Modal --- */}
      {cardToDelete && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3>Delete Flashcard?</h3>
            <p>Are you sure you want to delete this card? This action cannot be undone.</p>
            <div className="delete-actions">
              <button className="del-btn del-cancel" onClick={() => setCardToDelete(null)}>Cancel</button>
              <button className="del-btn del-confirm" onClick={confirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      </div>{/* end fc-workspace */}
    </div>
  );
}

export default FlashcardWidget;