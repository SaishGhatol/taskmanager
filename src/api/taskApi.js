import mockTasks from '../data/mockData';

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch all tasks
export const fetchTasks = async () => {
  try {
    await delay(800);
    return [...mockTasks];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Failed to fetch tasks');
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    await delay(1000);
    const newTask = {
      ...taskData,
      createdAt: new Date().toISOString()
    };
    
    // Add to mock data 
    mockTasks.unshift(newTask);
    
    return newTask;
  } catch (error) {
    console.error('Error creating task:', error);
    throw new Error('Failed to create task');
  }
};

// Update a task
export const updateTask = async (taskId, taskData) => {
  try {
    await delay(1000);
    const taskIndex = mockTasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    // Update the task
    mockTasks[taskIndex] = {
      ...mockTasks[taskIndex],
      ...taskData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...mockTasks[taskIndex] };
  } catch (error) {
    console.error('Error updating task:', error);
    throw new Error('Failed to update task');
  }
};

// Mark task as complete
export const markTaskAsComplete = async (taskId) => {
  try {
    await delay(800);
    
    const taskIndex = mockTasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    // Update the task to be completed
    mockTasks[taskIndex] = {
      ...mockTasks[taskIndex],
      completed: true,
      completedAt: new Date().toISOString()
    };
    
    return { ...mockTasks[taskIndex] };
  } catch (error) {
    console.error('Error marking task as complete:', error);
    throw new Error('Failed to mark task as complete');
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    await delay(800);
    
    const taskIndex = mockTasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    // Remove the task
    mockTasks.splice(taskIndex, 1);
    
    return { success: true, message: 'Task deleted successfully' };
  } catch (error) {
    console.error('Error deleting task:', error);
    throw new Error('Failed to delete task');
  }
};