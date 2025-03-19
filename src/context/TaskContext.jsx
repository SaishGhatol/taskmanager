import React, { createContext, useState, useEffect } from 'react';
import { fetchTasks } from '../api/taskApi';

// Create context
export const TaskContext = createContext();

// Provider component
export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch tasks on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const data = await fetchTasks();
        setTasks(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadTasks();
  }, []);
  
  // Add a new task
  const addTask = (task) => {
    setTasks(prev => [task, ...prev]);
  };
  
  // Update a task
  const updateTask = (updatedTask) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };
  
  // Delete a task
  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };
  
  // Context value
  const value = {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask
  };
  
  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};