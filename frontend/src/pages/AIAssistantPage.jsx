import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import ShareModal from '../components/ai-assistant/ShareModal';
import '../components/ai-assistant/AIAssistant.css';
import './DashboardPage.css'; // Global layout styles

function AIAssistantPage() {
  const [notes, setNotes] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [generatedCards, setGeneratedCards] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Simulated AI Generation Logic
  const handleGenerate = () => {
    if (!notes.trim()) {
      alert("Please paste some notes first!");
      return;
    }
    
    setIsGenerating(true);
    setSavedSuccess(false);
    
    // Simulate API Delay
    setTimeout(() => {
      const newCards = [
        { id: Date.now(), q: "What are the three main components of a neural network?", a: "Input layer, Hidden layers, and Output layer." },
        { id: Date.now() + 1, q: "Explain 'Backpropagation' in simple terms.", a: "It is the process of moving backward through the network to calculate errors and update weights." }
      ];
      setGeneratedCards(newCards);
      setIsGenerating(false);
    }, 1500);
  };

  const handleSaveToFlashcards = () => {
    if (generatedCards.length === 0) return;
    const existingCards = JSON.parse(localStorage.getItem('campusMatrixFlashcards')) || [];
    const formattedForDB = generatedCards.map(c => ({
      id: c.id, deck: "AI Generated", question: c.q, answer: c.a 
    }));
    const merged = [...existingCards, ...formattedForDB];
    localStorage.setItem('campusMatrixFlashcards', JSON.stringify(merged));
    // Fire storage event so FlashcardWidget updates in real-time
    window.dispatchEvent(new Event('storage'));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddMore = () => {
    const extraCard = { id: Date.now(), q: "What is an Activation Function?", a: "A mathematical 'gate' that determines whether a neuron should be activated or not." };
    setGeneratedCards([...generatedCards, extraCard]);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      console.log("Sending to AI:", chatInput);
      setChatInput('');
      // Open a chat popup or handle inline later
    }
  };

  // Trigger file upload
  const fileInputRef = React.useRef(null);
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <div className="main-content">
        <Header />
        
        <div className="page-content ai-workspace">
          
          {/* Top Section: Split Panels */}
          <div className="ai-split-panels">
            
            {/* Left Panel: Notes Input */}
            <div className="ai-panel">
              <div className="ai-panel-header">
                <div>
                  <h2 className="ai-panel-title">Paste Your Notes</h2>
                  <p className="ai-panel-subtitle">Convert your lectures or book excerpts into structured study material.</p>
                </div>
              </div>
              <textarea 
                className="ai-textarea"
                placeholder="Paste your lecture notes or textbook excerpts here to generate study materials..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <button className="ai-generate-btn" onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? "Generating..." : <><span>✨</span> Generate Flashcards</>}
              </button>
            </div>

            {/* Right Panel: Output */}
            <div className="ai-panel">
              <div className="ai-panel-header">
                <div>
                  <h2 className="ai-panel-title">AI-Generated Flashcards</h2>
                </div>
                <button className="ai-icon-btn" onClick={() => setIsShareModalOpen(true)} title="Share">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                </button>
              </div>

              <div className="ai-cards-container">
                {generatedCards.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#B2BEC3', marginTop: '50px' }}>
                    Your generated flashcards will appear here.
                  </div>
                ) : (
                  <>
                    {generatedCards.map((card, index) => (
                      <div className="ai-gen-card" key={card.id}>
                        <div className="ai-gen-card-label">QUESTION {String(index + 1).padStart(2, '0')}</div>
                        <h3 className="ai-gen-card-text">{card.q}</h3>
                      </div>
                    ))}
                    
                    <button className="ai-add-more-btn" onClick={handleAddMore}>
                      <span style={{ fontSize: '1.5rem', fontWeight: '400' }}>+</span>
                      Click generate to create more cards
                    </button>

                    <button 
                      className="ai-save-btn"
                      onClick={handleSaveToFlashcards}
                      style={savedSuccess ? { background: '#52C41A' } : {}}
                    >
                      {savedSuccess ? '✅ Saved to Smart Flashcards!' : '💾 Save to Smart Flashcards'}
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>

          {/* Bottom Section: Chat Bar */}
          <form className="ai-chat-bar" onSubmit={handleChatSubmit}>
            <input 
              type="text" 
              className="ai-chat-input"
              placeholder="Ask Gemini AI Assistant anything about your notes..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <div className="ai-chat-actions">
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={(e) => console.log("File selected:", e.target.files[0])}
              />
              <button type="button" className="ai-upload-btn" onClick={handleFileUpload} title="Attach File">
                📎
              </button>
              <button type="submit" className="ai-send-btn" title="Send Message">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </div>
          </form>

        </div>
      </div>

      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </div>
  );
}

export default AIAssistantPage;