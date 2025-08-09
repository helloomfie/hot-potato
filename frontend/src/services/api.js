const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const REQUEST_TIMEOUT = 10000;

const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

export const taskAPI = {
  getAllTasks: async () => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/tasks`);
      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  createTask: async (taskData) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create task: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  updateTask: async (taskId, taskData) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update task: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  deleteTask: async (taskId) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete task: ${response.status}`);
      }
      
      const text = await response.text();
      return text ? JSON.parse(text) : { success: true };
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  getArchivedTasks: async () => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/tasks/archived`);
      if (!response.ok) {
        throw new Error(`Failed to fetch archived tasks: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching archived tasks:', error);
      throw error;
    }
  },

  archiveTask: async (taskId, archiveData) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/tasks/${taskId}/archive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(archiveData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to archive task: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error archiving task:', error);
      throw error;
    }
  },

  healthCheck: async () => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL.replace('/api', '')}/api/health`, {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
};

export const handleAPIError = (error) => {
  console.error('API Error:', error);
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return {
      success: false,
      message: 'Network error - check your internet connection',
      type: 'network'
    };
  }
  
  if (error.message === 'Request timeout') {
    return {
      success: false,
      message: 'Request timed out - server may be slow',
      type: 'timeout'
    };
  }
  
  if (error.message.includes('500')) {
    return {
      success: false,
      message: 'Server error - please try again later',
      type: 'server'
    };
  }
  
  if (error.message.includes('4')) {
    return {
      success: false,
      message: 'Request error - please check your data',
      type: 'client'
    };
  }
  
  return {
    success: false,
    message: error.message || 'An unexpected error occurred',
    type: 'unknown'
  };
};

export const checkConnection = async () => {
  try {
    return await taskAPI.healthCheck();
  } catch (error) {
    return false;
  }
};