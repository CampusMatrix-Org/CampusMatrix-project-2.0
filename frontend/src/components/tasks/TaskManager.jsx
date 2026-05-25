import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import TaskColumn from './TaskColumn';
import AddTaskModal from '../dashboard/AddTaskModal';
import { useSettings } from '../../context/SettingsContext';
import './TaskManager.css';

function TaskManager() {
  const { tasks, updateTaskStatus } = useTasks();
  const { t } = useSettings();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Column structure based on task status
  const columns = [
    { title: t('todo'), status: 'to-do', tasks: tasks.filter(t => t.status === 'to-do') },
    { title: t('inProgress'), status: 'in-progress', tasks: tasks.filter(t => t.status === 'in-progress') },
    { title: t('completed'), status: 'completed', tasks: tasks.filter(t => t.status === 'completed') },
  ];

  return (
    <div className="task-manager">
      <div className="board-grid">
        {columns.map((column, index) => (
          <TaskColumn 
            key={index} 
            title={column.title} 
            tasks={column.tasks} 
            status={column.status} 
            onDropTask={updateTaskStatus}
          />
        ))}
      </div>

      {/* Floating Add New Task Button */}
      <button className="fab-button" onClick={() => setIsModalOpen(true)}>+</button>

      {/* Reusable Add Task Modal */}
      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default TaskManager;