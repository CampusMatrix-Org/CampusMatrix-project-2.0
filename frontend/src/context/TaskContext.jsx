import React, { createContext, useState, useContext } from 'react';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([
    // --- TO DO ---
    { id: 1, title: 'B-Tree Implementation', description: 'Advanced Algorithms', status: 'to-do', priority: 'high', dueDate: '2026-04-10T00:00:00Z' },
    { id: 2, title: 'Normalization Report', description: 'Database Systems', status: 'to-do', priority: 'medium', dueDate: '2026-04-12T00:00:00Z' },
    { id: 7, title: 'Figma Prototype Phase 2', description: 'Human-Computer Interaction', status: 'to-do', priority: 'high', dueDate: '2026-04-15T00:00:00Z' },
    { id: 8, title: 'Write API Documentation', description: 'Software Engineering', status: 'to-do', priority: 'medium', dueDate: '2026-04-18T00:00:00Z' },
    { id: 9, title: 'Prepare Presentation Slides', description: 'Technical Writing', status: 'to-do', priority: 'low', dueDate: '2026-04-20T00:00:00Z' },
    { id: 10, title: 'Database Schema Review', description: 'Database Systems', status: 'to-do', priority: 'high', dueDate: '2026-04-11T00:00:00Z' },
    { id: 11, title: 'Study for Midterms', description: 'Macroeconomics', status: 'to-do', priority: 'high', dueDate: '2026-04-25T00:00:00Z' },

    // --- IN PROGRESS ---
    { id: 3, title: 'Java Multithreading', description: 'Java OOP Workshop', status: 'in-progress', priority: 'high', dueDate: '2026-04-05T00:00:00Z' },
    { id: 4, title: 'CampusMatrix API', description: 'Frontend Sync', status: 'in-progress', priority: 'low', dueDate: '2026-04-08T00:00:00Z' },
    { id: 12, title: 'User Authentication Flow', description: 'Web Development', status: 'in-progress', priority: 'high', dueDate: '2026-04-06T00:00:00Z' },
    { id: 13, title: 'Dashboard UI Animations', description: 'Frontend Engineering', status: 'in-progress', priority: 'medium', dueDate: '2026-04-07T00:00:00Z' },
    { id: 14, title: 'MongoDB Connection Logic', description: 'Backend Systems', status: 'in-progress', priority: 'high', dueDate: '2026-04-09T00:00:00Z' },

    // --- COMPLETED ---
    { id: 5, title: 'Macroeconomics Essay', description: 'Draft 1', status: 'completed', priority: 'low', dueDate: '2026-03-25T00:00:00Z' },
    { id: 6, title: 'UI/UX Mockups', description: 'Project Phase 1', status: 'completed', priority: 'medium', dueDate: '2026-03-28T00:00:00Z' },
    { id: 15, title: 'Initial Repo Setup', description: 'CampusMatrix Project', status: 'completed', priority: 'low', dueDate: '2026-03-10T00:00:00Z' },
    { id: 16, title: 'Requirements Gathering', description: 'Software Engineering', status: 'completed', priority: 'medium', dueDate: '2026-03-15T00:00:00Z' },
    { id: 17, title: 'Login Page Design', description: 'Figma Prototype', status: 'completed', priority: 'high', dueDate: '2026-03-18T00:00:00Z' },
    { id: 18, title: 'Sidebar Navigation component', description: 'React Frontend', status: 'completed', priority: 'medium', dueDate: '2026-03-22T00:00:00Z' },
    { id: 19, title: 'Git Branching Strategy setup', description: 'Team Coordination', status: 'completed', priority: 'low', dueDate: '2026-03-12T00:00:00Z' },
  ]);

  const addTask = (newTask) => {
    const taskWithId = { ...newTask, id: Date.now() };
    setTasks((prevTasks) => [...prevTasks, taskWithId]);
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTaskStatus }}>
      {children}
    </TaskContext.Provider>
  );
};