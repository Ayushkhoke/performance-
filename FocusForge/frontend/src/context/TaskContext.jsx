import { createContext, useState, useCallback } from 'react';
import api from '../services/api';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = async (taskData) => {
    try {
      const res = await api.post('/tasks', taskData);
      setTasks(prev => [res.data, ...prev]);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to add task' };
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const res = await api.put(`/tasks/${id}`, updates);
      setTasks(prev => prev.map(t => t._id === id ? res.data : t));
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Failed to update task' };
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Failed to delete task' };
    }
  };

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await api.get('/analytics');
      setAnalytics(res.data);
    } catch (error) {
      console.error('Failed to fetch analytics', error);
    }
  }, []);

  return (
    <TaskContext.Provider value={{
      tasks,
      analytics,
      loading,
      fetchTasks,
      addTask,
      updateTask,
      deleteTask,
      fetchAnalytics
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
