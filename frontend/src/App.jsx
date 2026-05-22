import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext'; 
import { SettingsProvider } from './context/SettingsContext';

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
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import NotificationsPage from './pages/NotificationsPage';
import FocusTimerPage from './pages/FocusTimerPage';
import PersonalLibraryPage from './pages/PersonalLibraryPage';
import AcademicAnalyticsPage from './pages/AcademicAnalyticsPage';
import ExamCountdownPage from './pages/ExamCountdownPage';

import './App.css';
import './responsive.css';

function App() {
  return (
    <SettingsProvider>
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
            <Route path="/focus-timer" element={<FocusTimerPage />} />
            <Route path="/ai-assistant" element={<AIAssistantPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/personal-library" element={<PersonalLibraryPage />} />
            <Route path="/academic-analytics" element={<AcademicAnalyticsPage />} />
            <Route path="/exam-countdown" element={<ExamCountdownPage />} />
          </Routes>
        </TaskProvider>
      </Router>
    </SettingsProvider>
  );
}

export default App;