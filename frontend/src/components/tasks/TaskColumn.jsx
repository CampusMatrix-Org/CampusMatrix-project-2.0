import React from 'react';
import TaskCard from './TaskCard';
import './TaskManager.css';

function TaskColumn({ title, tasks, status, onDropTask }) {
  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    onDropTask(parseInt(taskId, 10), status);
  };

  return (
    <div className="task-column" onDragOver={onDragOver} onDrop={onDrop}>
      <div className="column-header">
        <h3>{title}</h3>
      </div>
      <div className="column-content scrollable">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

export default TaskColumn;