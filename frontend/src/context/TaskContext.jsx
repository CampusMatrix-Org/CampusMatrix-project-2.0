/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

const fallbackTasks = [
  { id: 1, title: 'B-Tree Implementation', description: 'Advanced Algorithms', status: 'to-do', priority: 'high', dueDate: '2026-04-10T10:00:00Z', type: 'task' },
  { id: 2, title: 'Normalization Report', description: 'Database Systems', status: 'to-do', priority: 'medium', dueDate: '2026-04-12T14:00:00Z', type: 'task' },
  { id: 3, title: 'Midterm Exam: Macroeconomics', description: 'Hall B', status: 'to-do', priority: 'high', dueDate: '2026-04-15T09:00:00Z', type: 'exam', target: 'A' },
  { id: 4, title: 'Lecture: CS501', description: 'Main Auditorium', status: 'completed', priority: 'low', dueDate: '2026-04-06T08:00:00Z', type: 'lecture' },
  { id: 5, title: 'Library Session', description: 'Group Work', status: 'to-do', priority: 'medium', dueDate: '2026-04-08T11:00:00Z', type: 'lecture' },
  { id: 6, title: 'Lab: React Basics', description: 'Computer Lab 3', status: 'in-progress', priority: 'medium', dueDate: '2026-04-14T13:00:00Z', type: 'lecture' },
];

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks');
        setTasks(response.data || []);
      } catch (error) {
        console.warn('Failed to fetch tasks from API. Loading fallback data.', error);
        setTasks(fallbackTasks);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async (newTask) => {
    try {
      const response = await api.post('/tasks', newTask);
      setTasks((prevTasks) => [...prevTasks, response.data]);
    } catch (error) {
      console.warn('Failed to add task to API. Adding locally.', error);
      const taskWithId = { ...newTask, id: Date.now(), type: newTask.type || 'task' };
      setTasks((prevTasks) => [...prevTasks, taskWithId]);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.warn('Failed to update task status in API. Updating locally.', error);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    }
  };

  const updateTaskDate = async (taskId, newDate) => {
    try {
      await api.patch(`/tasks/${taskId}`, { dueDate: newDate.toISOString() });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, dueDate: newDate.toISOString() } : task
        )
      );
    } catch (error) {
      console.warn('Failed to update task date in API. Updating locally.', error);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, dueDate: newDate.toISOString() } : task
        )
      );
    }
  };

  const updateTask = async (updatedTask) => {
    try {
      await api.put(`/tasks/${updatedTask.id}`, updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    } catch (error) {
      console.warn('Failed to replace task in API. Updating locally.', error);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.warn('Failed to delete task in API. Deleting locally.', error);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTaskStatus, updateTaskDate, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};
