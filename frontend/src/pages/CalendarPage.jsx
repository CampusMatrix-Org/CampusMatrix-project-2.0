import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import CalendarWidget from '../components/calendar/CalendarWidget';
import './DashboardPage.css'; 

function CalendarPage() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-content">
          <CalendarWidget />
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;