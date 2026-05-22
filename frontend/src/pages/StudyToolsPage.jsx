import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import StudyToolsList from '../components/study-tools/StudyToolsList';
import './DashboardPage.css'; // Shared layout styles


function StudyToolsPage() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-content">
          <StudyToolsList />
        </div>
      </div>
    </div>
  );
}

export default StudyToolsPage;