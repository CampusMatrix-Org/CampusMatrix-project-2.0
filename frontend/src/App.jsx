import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext'; 
import DashboardPage from './pages/DashboardPage';
import TaskManagementPage from './pages/TaskManagementPage'; 
import CalendarPage from './pages/CalendarPage';
import StudyToolsPage from './pages/StudyToolsPage';
import FlashcardsPage from './pages/FlashcardsPage';
import LoginPage from './pages/LoginPage';
import './App.css';

function App() {
  return (
    <Router>
      <TaskProvider> 
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tasks" element={<TaskManagementPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/study-tools" element={<StudyToolsPage />} />
          <Route path="/smart-flashcards" element={<FlashcardsPage />} />
        </Routes>
      </TaskProvider>
    </Router>
  );
}

export default App;