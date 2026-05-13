import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext'; 

// Auth Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Main App Pages
import DashboardPage from './pages/DashboardPage';
import TaskManagementPage from './pages/TaskManagementPage'; 
import CalendarPage from './pages/CalendarPage';
import StudyToolsPage from './pages/StudyToolsPage';
import FlashcardsPage from './pages/FlashcardsPage';
import AIAssistantPage from './pages/AIAssistantPage';

import './App.css';

function App() {
  return (
    <Router>
      <TaskProvider> 
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Protected Main Routes (Dashboard & Tools) */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tasks" element={<TaskManagementPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/study-tools" element={<StudyToolsPage />} />
          <Route path="/smart-flashcards" element={<FlashcardsPage />}/>
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
        </Routes>
      </TaskProvider>
    </Router>
  );
}

export default App;