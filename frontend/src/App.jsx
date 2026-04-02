import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import './App.css'; // Global styles mona hari thiyenawanam meka thiyanna

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main page eka (http://localhost:5173/) load weddi LandingPage eka pennanawa */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Issarahata hadana pages mehema yatin add karan yanna puluwan */}
        {/* <Route path="/dashboard" element={<StudentDashboard />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;