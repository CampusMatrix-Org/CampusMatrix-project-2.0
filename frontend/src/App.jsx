import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- Context Providers ---
import { TaskProvider } from './context/TaskContext'; 
import { SettingsProvider } from './context/SettingsContext';
import { MaintenanceProvider } from './context/MaintenanceContext';
import { ThemeProvider } from './context/ThemeContext';
import { AdminProvider } from './context/AdminContext';

// --- Auth Pages ---
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import SupportPage from './pages/SupportPage';

// --- Admin Auth & Portal Pages ---
import AdminLoginPage from './pages/AdminLoginPage';
import AdminRegisterPage from './pages/AdminRegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import StudentManagementPage from './pages/StudentManagementPage';
import ResourceModerationPage from './pages/ResourceModerationPage';
import SystemSettingsPage from './pages/SystemSettingsPage';
import AdminProfilePage from './pages/AdminProfilePage';
import AdminNotificationsPage from './pages/AdminNotificationsPage';

// --- Main App Pages (Student) ---
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
import StudyPlanGeneratorPage from './pages/StudyPlanGeneratorPage';

import ThemeController from './components/ThemeController';

import './App.css';
import './responsive.css';

function App() {
  return (
    <SettingsProvider>
      <ThemeProvider> 
        <MaintenanceProvider> 
          <AdminProvider>
            <Router>
              <ThemeController />
              <TaskProvider> 
                <Routes>
                  {/* Public Auth Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/support" element={<SupportPage />} />

                  {/* Admin Auth Routes */}
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route path="/admin/register" element={<AdminRegisterPage />} />
                  
                  {/* Protected Main Routes (Student Dashboard & Tools) */}
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/tasks" element={<TaskManagementPage />} />
                  <Route path="/task-manager" element={<TaskManagementPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/study-tools" element={<StudyToolsPage />} />
                  <Route path="/smart-flashcards" element={<FlashcardsPage />} />
                  <Route path="/focus-timer" element={<FocusTimerPage />} />
                  <Route path="/ai-assistant" element={<AIAssistantPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/change-password" element={<ChangePasswordPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/personal-library" element={<PersonalLibraryPage />} />
                  <Route path="/academic-analytics" element={<AcademicAnalyticsPage />} />
                  <Route path="/exam-countdown" element={<ExamCountdownPage />} />
                  <Route path="/study-plan-generator" element={<StudyPlanGeneratorPage />} />

                  {/* Admin Portal Routes */}
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/admin/users" element={<StudentManagementPage />} />
                  <Route path="/admin/resources" element={<ResourceModerationPage />} />
                  <Route path="/admin/settings" element={<SystemSettingsPage />} />
                  <Route path="/admin/profile" element={<AdminProfilePage />} />
                  <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
                </Routes>
              </TaskProvider>
            </Router>
          </AdminProvider>
        </MaintenanceProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
}

export default App;