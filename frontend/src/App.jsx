import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext'; 
import DashboardPage from './pages/DashboardPage';
import TaskManagementPage from './pages/TaskManagementPage'; 
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
        </Routes>
      </TaskProvider>
    </Router>
  );
}

export default App;