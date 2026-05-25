import React, { createContext, useState, useContext } from 'react';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([
    // Tasks (Personal Study - Green)
    { id: 1, title: 'B-Tree Implementation', description: 'Advanced Algorithms', status: 'to-do', priority: 'high', dueDate: '2026-04-10T10:00:00Z', type: 'task' },
    { id: 2, title: 'Normalization Report', description: 'Database Systems', status: 'to-do', priority: 'medium', dueDate: '2026-04-12T14:00:00Z', type: 'task' },
    
    // Exams (Red)
    { id: 3, title: 'Midterm Exam: Macroeconomics', description: 'Hall B', status: 'to-do', priority: 'high', dueDate: '2026-04-15T09:00:00Z', type: 'exam', target: 'A' },
    
    // Lectures (Blue)
    { id: 4, title: 'Lecture: CS501', description: 'Main Auditorium', status: 'completed', priority: 'low', dueDate: '2026-04-06T08:00:00Z', type: 'lecture' },
    { id: 5, title: 'Library Session', description: 'Group Work', status: 'to-do', priority: 'medium', dueDate: '2026-04-08T11:00:00Z', type: 'lecture' },
    { id: 6, title: 'Lab: React Basics', description: 'Computer Lab 3', status: 'in-progress', priority: 'medium', dueDate: '2026-04-14T13:00:00Z', type: 'lecture' },
  ]);

  const addTask = (newTask) => {
    const taskWithId = { ...newTask, id: Date.now(), type: newTask.type || 'task' };
    setTasks((prevTasks) => [...prevTasks, taskWithId]);
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const updateTaskDate = (taskId, newDate) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, dueDate: newDate.toISOString() } : task
      )
    );
  };

  const updateTask = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTaskStatus, updateTaskDate, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};