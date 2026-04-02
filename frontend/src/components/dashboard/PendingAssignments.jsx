import React from 'react';

function PendingAssignments() {
  return (
    <div className="widget-card flex-col">
      <div className="widget-header">
        <h3>Pending Assignments</h3>
      </div>
      <div className="widget-scroll-area">
        <div className="task-card danger">
          <span className="badge badge-danger">DUE IN 2 DAYS</span>
          <h4>B-Tree Implementation</h4>
          <p>Advanced Algorithms • Assignment 4</p>
        </div>
        <div className="task-card danger">
          <span className="badge badge-danger">DUE IN 3 DAYS</span>
          <h4>CampusMatrix UI Mockups</h4>
          <p>Human-Computer Interaction • Project</p>
        </div>
        <div className="task-card warning">
          <span className="badge badge-warning">DUE IN 4 DAYS</span>
          <h4>Normalization Report</h4>
          <p>Database Systems • Phase 2</p>
        </div>
        <div className="task-card warning">
          <span className="badge badge-warning">DUE IN 5 DAYS</span>
          <h4>Supply & Demand Analysis</h4>
          <p>Macroeconomics • Essay</p>
        </div>
        <div className="task-card neutral">
          <span className="badge badge-neutral">DUE IN 8 DAYS</span>
          <h4>Final Research Proposal</h4>
          <p>Technical Writing • Draft</p>
        </div>
        <div className="task-card neutral">
          <span className="badge badge-neutral">DUE IN 10 DAYS</span>
          <h4>Multithreading Assignment</h4>
          <p>Java OOP Workshop • Practical</p>
        </div>
      </div>
      <div className="widget-fixed-footer">
        <button className="btn outline-btn full-width">+ Add New Task</button>
      </div>
    </div>
  );
}

export default PendingAssignments;