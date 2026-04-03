import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext'; 
import TaskCard from '../tasks/TaskCard'; 
import AddTaskModal from './AddTaskModal';

function PendingAssignments() {
  const { tasks } = useTasks(); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter tasks with 'to-do' status to display in Pending Assignments
  const pendingTasks = tasks.filter((task) => task.status === 'to-do');

  return (
    <div className="widget-card flex-col">
      <div className="widget-header">
        <h3>Pending Assignments</h3>
      </div>
      <div className="widget-scroll-area">
        {/* Render only Pending (To Do) tasks */}
        {pendingTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
      
      <div className="widget-fixed-footer">
        <button 
          className="btn outline-btn full-width" 
          onClick={() => setIsModalOpen(true)}
        >
          + Add New Task
        </button>
      </div>

      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default PendingAssignments;