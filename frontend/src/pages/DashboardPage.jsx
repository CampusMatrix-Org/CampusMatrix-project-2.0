import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import TodaySchedule from '../components/dashboard/TodaySchedule';
import PendingAssignments from '../components/dashboard/PendingAssignments';
import SemesterGoals from '../components/dashboard/SemesterGoals';
import './DashboardPage.css';

function DashboardPage() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-content">
          <WelcomeBanner />
          
          <div className="dashboard-grid">
            <TodaySchedule />
            <PendingAssignments />
            <SemesterGoals />
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;