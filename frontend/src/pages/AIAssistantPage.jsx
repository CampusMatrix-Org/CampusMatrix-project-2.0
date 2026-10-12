import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import ShareModal from '../components/ai-assistant/ShareModal';
import api from '../services/api';
import '../components/ai-assistant/AIAssistant.css';
import './DashboardPage.css'; // Global layout styles

function AIAssistantPage() {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'flashcards'

  // --- Flashcard Generator State ---
  const [notes, setNotes] = useState('');
  const [generatedCards, setGeneratedCards] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // --- Chat State ---
  const [chatInput, setChatInput] = useState('');
  const [sessions, setSessions] = useState([
    { id: 1, title: 'Machine Learning Basics', updatedAt: 'Today' },
    { id: 2, title: 'Database Optimization', updatedAt: 'Yesterday' },
    { id: 3, title: 'React Hooks Explanation', updatedAt: 'Previous 7 Days' }
  ]);
  const [activeSessionId, setActiveSessionId] = useState(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am your AI Study Assistant. I can help you summarize notes, explain complex topics, generate quizzes, or answer any questions you have.' }
  ]);
  
  const chatWindowRef = React.useRef(null);
  const fileInputRef = React.useRef(null);

  // --- Handlers ---

  const handleGenerate = async () => {
    if (!notes.trim()) {
      alert("Please paste some notes first!");
      return;
    }
    
    setIsGenerating(true);
    setSavedSuccess(false);
    
    try {
      const response = await api.post('/ai/flashcards/generate', { notes });
      setGeneratedCards(response.data || []);
      setIsGenerating(false);
    } catch (err) {
      console.warn('Failed to generate flashcards from API. Using fallback simulation.', err);
      setTimeout(() => {
        const newCards = [
          { id: Date.now(), q: "What are the three main components of a neural network?", a: "Input layer, Hidden layers, and Output layer." },
          { id: Date.now() + 1, q: "Explain 'Backpropagation' in simple terms.", a: "It is the process of moving backward through the network to calculate errors and update weights." }
        ];
        setGeneratedCards(newCards);
        setIsGenerating(false);
      }, 1500);
    }
  };

  const handleSaveToFlashcards = async () => {
    if (generatedCards.length === 0) return;
    const formattedForDB = generatedCards.map(c => ({
      id: c.id, deck: "AI Generated", question: c.q, answer: c.a 
    }));

    try {
      await api.post('/flashcards', formattedForDB);
    } catch (err) {
      console.warn('Failed to save flashcards via API. Saving to localStorage as fallback.', err);
      const existingCards = JSON.parse(localStorage.getItem('campusMatrixFlashcards')) || [];
      const merged = [...existingCards, ...formattedForDB];
      localStorage.setItem('campusMatrixFlashcards', JSON.stringify(merged));
    }

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
      const userMessage = { role: 'user', content: chatInput };
      setChatMessages(prev => [...prev, userMessage]);
      setChatInput('');
      
      setTimeout(() => {
        if (chatWindowRef.current) {
          chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
      }, 50);

      setTimeout(() => {
        const aiResponse = { role: 'assistant', content: `Here is a simulated response to: "${userMessage.content}". Once connected to the real backend, this will call /ai/chat with sessionId: ${activeSessionId}` };
        setChatMessages(prev => [...prev, aiResponse]);
        setTimeout(() => {
          if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
          }
        }, 50);
      }, 1000);
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleNewChat = () => {
    const newSession = { id: Date.now(), title: 'New Chat', updatedAt: 'Today' };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
    setChatMessages([
      { role: 'assistant', content: 'How can I help you today?' }
    ]);
  };

  const handleSelectSession = (id) => {
    setActiveSessionId(id);
    setChatMessages([
      { role: 'assistant', content: `You loaded session ${id}.` }
    ]);
  };

  // Group sessions by date
  const groupedSessions = sessions.reduce((acc, session) => {
    if (!acc[session.updatedAt]) acc[session.updatedAt] = [];
    acc[session.updatedAt].push(session);
    return acc;
  }, {});

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <div className="main-content">
        <Header />
        
        <div className="page-content ai-workspace">
          
          {/* Top Tabs */}
          <div className="ai-tabs-container">
            <button 
              className={`ai-tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              💬 AI Chat
            </button>
            <button 
              className={`ai-tab-btn ${activeTab === 'flashcards' ? 'active' : ''}`}
              onClick={() => setActiveTab('flashcards')}
            >
              📇 Flashcard Generator
            </button>
          </div>

          {activeTab === 'chat' && (
            <div className="ai-chat-layout">
              {/* Sidebar: Chat History */}
              <div className={`ai-chat-sidebar ${isMobileSidebarOpen ? 'open' : ''}`}>
                <div className="ai-chat-sidebar-mobile-header" style={{ display: 'none' }}>
                  <button className="ai-chat-close-sidebar" onClick={() => setIsMobileSidebarOpen(false)}>×</button>
                </div>
                <button className="ai-new-chat-btn" onClick={() => { handleNewChat(); setIsMobileSidebarOpen(false); }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  New Chat
                </button>
                
                <div className="ai-chat-history-list">
                  {Object.keys(groupedSessions).map(group => (
                    <div key={group} className="ai-chat-history-group">
                      <div className="ai-history-label">{group}</div>
                      {groupedSessions[group].map(session => (
                        <button 
                          key={session.id} 
                          className={`ai-history-item ${activeSessionId === session.id ? 'active' : ''}`}
                          onClick={() => { handleSelectSession(session.id); setIsMobileSidebarOpen(false); }}
                        >
                          <svg className="ai-history-item-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                          <span className="ai-history-item-text">{session.title}</span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Chat Area */}
              <div className="ai-main-chat">
                <div className="ai-chat-header-mobile">
                  <button className="ai-mobile-menu-btn" onClick={() => setIsMobileSidebarOpen(true)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                  </button>
                  <span className="ai-chat-header-title">AI Assistant</span>
                </div>
                <div className="ai-chat-messages-full" ref={chatWindowRef}>
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`ai-full-msg ${msg.role === 'user' ? 'msg-user-full' : 'msg-ai-full'}`}>
                      <div className="ai-full-avatar">
                        {msg.role === 'assistant' ? '🤖' : '👤'}
                      </div>
                      <div className="ai-full-bubble">{msg.content}</div>
                    </div>
                  ))}
                </div>

                <div className="ai-chat-input-wrapper">
                  <form className="ai-chat-bar-full" onSubmit={handleChatSubmit}>
                    <input 
                      type="text" 
                      className="ai-chat-textarea-full"
                      placeholder="Ask Gemini AI Assistant anything..."
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
            </div>
          )}

          {activeTab === 'flashcards' && (
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
          )}

        </div>
      </div>

      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </div>
  );
}

export default AIAssistantPage;