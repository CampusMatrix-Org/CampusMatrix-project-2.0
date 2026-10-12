import React from 'react';
import './TaskManager.css';

function TaskCard({ task }) {
  const onDragStart = (e) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  const priorityText = `${task.priority} Priority`.toUpperCase();


  const formattedDate = task.dueDate 
    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'No Date';

  return (
    <div 
      className={`task-card ${task.priority} ${task.status === 'completed' ? 'completed-card' : ''}`} 
      draggable 
      onDragStart={onDragStart}
    >
      <span className={`badge badge-${task.priority}`}>{priorityText}</span>
      <h4>{task.title}</h4>
      <p className="task-desc">{task.description}</p>
      

      <div className="task-date">
        <span className="date-icon">📅</span> {formattedDate}
      </div>
    </div>
  );
}

export default TaskCard;