import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import TaskManager from '../components/tasks/TaskManager';
import './DashboardPage.css';

function TaskManagementPage() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-content">
          <TaskManager />
        </div>
      </div>
    </div>
  );
}

export default TaskManagementPage;