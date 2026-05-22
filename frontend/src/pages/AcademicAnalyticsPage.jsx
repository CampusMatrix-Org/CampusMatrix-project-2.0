import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import './AcademicAnalyticsPage.css';

// Dummy Data
const gpaData = [
  { name: 'SEM 1', gpa: 3.2 },
  { name: 'SEM 2', gpa: 3.4 },
  { name: 'SEM 3', gpa: 3.5 },
  { name: 'SEM 4', gpa: 3.6 },
  { name: 'SEM 5', gpa: 3.75 },
  { name: 'SEM 6', gpa: 3.85 },
];

const studyData = [
  { name: 'Math', hours: 45 },
  { name: 'Physics', hours: 30 },
  { name: 'CS', hours: 60 },
  { name: 'English', hours: 20 },
  { name: 'History', hours: 25 },
  { name: 'Art', hours: 15 },
];

function AcademicAnalyticsPage() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        
        <div className="page-content">
          <div className="analytics-workspace">
            
            {/* Breadcrumbs */}
            <div className="analytics-breadcrumb">
              <span className="analytics-link" onClick={() => navigate('/study-tools')}>Study Tools</span>
              <span className="analytics-separator"> &gt; </span>
              <span className="analytics-current">Academic Analytics</span>
            </div>

            <p className="analytics-subtitle">Detailed insights into your academic journey and learning efficiency.</p>

            {/* Top Metrics Cards */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-title">Overall GPA</span>
                  <span className="metric-trend positive">+0.05</span>
                </div>
                <h2 className="metric-value">3.85</h2>
              </div>
              
              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-title">Total Credits</span>
                  <span className="metric-trend requirement">Requirement: 120</span>
                </div>
                <h2 className="metric-value">112</h2>
                <div className="progress-bar-bg"><div className="progress-bar-fill" style={{width: '93%'}}></div></div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-title">Ranking</span>
                  <span className="metric-trend positive">+2%</span>
                </div>
                <h2 className="metric-value">Top 5%</h2>
              </div>
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
              <div className="chart-card">
                <div className="chart-header">
                  <div>
                    <h3>GPA Trend</h3>
                    <p>Performance over semesters</p>
                  </div>
                  <select className="chart-select"><option>Last 6 Semesters</option></select>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={gpaData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF7043" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#FF7043" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                      <YAxis domain={[2.0, 4.0]} axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                      <Tooltip contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}} />
                      <Area type="monotone" dataKey="gpa" stroke="#FF7043" strokeWidth={3} fillOpacity={1} fill="url(#colorGpa)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <div>
                    <h3>Study Distribution</h3>
                    <p>Hours spent across core subjects</p>
                  </div>
                  <div className="chart-legend"><span className="legend-dot"></span> Active Week</div>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={studyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barSize={30}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                      <Tooltip cursor={{fill: '#FFF0EB'}} contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}} />
                      <Bar dataKey="hours" fill="#FF7043" radius={[4, 4, 0, 0]}>
                        {studyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 2 ? '#FF7043' : '#FFDDCB'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="skills-section">
              <div className="skills-header">
                <h3>Strengths & Weaknesses</h3>
                <p>A breakdown of proficiency across core academic skills.</p>
              </div>
              <div className="circular-skills-grid">
                {[
                  { title: "Mathematics", desc: "Strong Proficiency", val: 90, color: "#2E86AB" },
                  { title: "Writing & Composition", desc: "Needs Improvement", val: 70, color: "#F4A261" },
                  { title: "Scientific Research", desc: "Solid Baseline", val: 85, color: "#2A9D8F" },
                  { title: "Public Speaking", desc: "Development Area", val: 40, color: "#E76F51" }
                ].map((skill, idx) => (
                  <div className="circular-skill-card" key={idx}>
                    <div className="circular-progress" style={{background: `conic-gradient(${skill.color} ${skill.val * 3.6}deg, #F0F0F0 0deg)`}}>
                      <div className="inner-circle"><span>{skill.val}%</span></div>
                    </div>
                    <h4>{skill.title}</h4>
                    <p>{skill.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Workload & Stress Analysis */}
            <div className="workload-section">
              <div className="workload-info">
                <h3>Workload & Stress Analysis</h3>
                <p className="workload-desc">Real-time mental health and capacity monitoring calculated based on upcoming deadlines and active study sessions.</p>
                <div className="stress-tip">
                  <span className="tip-icon">💡</span>
                  <div>
                    <strong>STRESS TIP</strong>
                    <p>Consider a 15-minute mindfulness break to reset your focus.</p>
                  </div>
                </div>
              </div>
              
              <div className="stress-meter-box">
                 <div className="stress-circle">
                    <span>HIGH</span>
                    <strong>Elevated Risk</strong>
                 </div>
              </div>

              <div className="workload-bars">
                <div className="w-bar-row">
                  <div className="w-label"><span>UPCOMING DEADLINES</span> <span className="badge">6 Tasks</span></div>
                </div>
                <div className="w-bar-row">
                  <div className="w-label"><span>STUDY INTENSITY</span> <span>Heavy</span></div>
                  <div className="w-bg"><div className="w-fill" style={{width: '85%', background: '#FF7043'}}></div></div>
                </div>
                <div className="w-bar-row">
                  <div className="w-label"><span>COURSE DIFFICULTY</span> <span>Moderate</span></div>
                  <div className="w-bg"><div className="w-fill" style={{width: '60%', background: '#FDCB6E'}}></div></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default AcademicAnalyticsPage;