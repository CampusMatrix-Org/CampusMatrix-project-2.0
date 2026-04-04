import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import FlashcardWidget from '../components/flashcards/FlashcardWidget';
import FlashcardModal from '../components/flashcards/FlashcardModal';
import './DashboardPage.css';

function FlashcardsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  // Edit icon clicked on card
  const handleEditClick = (cardData) => {
    setEditingCard(cardData);
    setIsModalOpen(true);
  };

  // Create new FAB clicked
  const handleCreateClick = () => {
    setEditingCard(null); // Clear data for new card
    setIsModalOpen(true);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-content">
          <FlashcardWidget onEditClick={handleEditClick} />
        </div>
      </div>

      {/* Floating Action Button for Create */}
      <button className="fab-button" onClick={handleCreateClick}>+</button>

      {/* Shared Modal for Create and Edit */}
      <FlashcardModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editData={editingCard}
      />
    </div>
  );
}

export default FlashcardsPage;