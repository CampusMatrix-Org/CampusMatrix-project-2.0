import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import TodaySchedule from '../components/dashboard/TodaySchedule';
import PendingAssignments from '../components/dashboard/PendingAssignments';
import SemesterGoals from '../components/dashboard/SemesterGoals';
import './DashboardPage.css';


import { useMaintenance } from '../context/MaintenanceContext'; 

function DashboardPage() {

  const { isMaintenanceMode } = useMaintenance();

 
  if (isMaintenanceMode) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#FFF6EC', fontFamily: 'Inter, sans-serif' }}>
        <h1 style={{ fontSize: '60px', margin: '0 0 20px 0' }}>🛠️</h1>
        <h2 style={{ color: '#1A1A1A', marginBottom: '15px', fontSize: '28px', fontWeight: '800' }}>System Maintenance Break</h2>
        <p style={{ color: '#666', textAlign: 'center', maxWidth: '450px', lineHeight: '1.6', fontSize: '15px' }}>
          CampusMatrix is currently undergoing scheduled maintenance to improve your experience. Please check back later.
        </p>
        <a href="/admin" style={{ marginTop: '30px', backgroundColor: '#E64A19', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
          Admin Login
        </a>
      </div>
    );
  }

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