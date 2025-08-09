const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Path to data files
const TASKS_FILE = path.join(__dirname, '../../data/tasks.json');
const ARCHIVE_FILE = path.join(__dirname, '../../data/archive.json');

/**
 * Read tasks from JSON file
 */
const readTasks = async () => {
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

/**
 * Write tasks to JSON file
 */
const writeTasks = async (tasks) => {
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
};

/**
 * Read archive from JSON file
 */
const readArchive = async () => {
  try {
    const data = await fs.readFile(ARCHIVE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

/**
 * Write to archive JSON file
 */
const writeArchive = async (archive) => {
  await fs.writeFile(ARCHIVE_FILE, JSON.stringify(archive, null, 2));
};

/**
 * Get all tasks
 */
const getAllTasks = async () => {
  const tasks = await readTasks();
  
  // Update task temperatures and time left in real-time
  const updatedTasks = tasks.map(task => ({
    ...task,
    temperature: Math.min(100, (task.temperature || 0) + Math.random() * 0.5),
    timeLeft: Math.max(0, (task.timeLeft || 3600) - Math.floor(Math.random() * 10))
  }));

  return updatedTasks;
};

/**
 * Get task by ID
 */
const getTaskById = async (id) => {
  const tasks = await readTasks();
  return tasks.find(task => task.id === id);
};

/**
 * Create new task
 */
const createTask = async (taskData) => {
  const tasks = await readTasks();
  
  const newTask = {
    id: uuidv4(),
    title: taskData.title,
    description: taskData.description,
    category: taskData.category,
    difficulty: taskData.difficulty || 'common',
    value: taskData.value,
    holder: taskData.holder,
    timeLeft: taskData.timeLeft || 3600, // Default 1 hour
    temperature: taskData.temperature || 0,
    passCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tasks.push(newTask);
  await writeTasks(tasks);
  
  return newTask;
};

/**
 * Update task
 */
const updateTask = async (id, updateData) => {
  const tasks = await readTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return null;
  }

  // Update task with new data
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };

  await writeTasks(tasks);
  return tasks[taskIndex];
};

/**
 * Delete task
 */
const deleteTask = async (id) => {
  const tasks = await readTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return false;
  }

  tasks.splice(taskIndex, 1);
  await writeTasks(tasks);
  return true;
};

/**
 * Pass task to another user
 */
const passTask = async (id, fromUser, toUser) => {
  const tasks = await readTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return null;
  }

  const task = tasks[taskIndex];
  
  // Update task with pass information
  tasks[taskIndex] = {
    ...task,
    holder: toUser,
    lastPasser: fromUser,
    passCount: (task.passCount || 0) + 1,
    temperature: Math.min(100, (task.temperature || 0) + 5), // Increase temperature
    combo: task.lastPasser === toUser ? (task.combo || 0) + 1 : 0,
    updatedAt: new Date().toISOString()
  };

  await writeTasks(tasks);
  return tasks[taskIndex];
};

/**
 * Complete task and move to archive
 */
const completeTask = async (id, completedBy, earnedValue) => {
  const tasks = await readTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return null;
  }

  const task = tasks[taskIndex];
  
  // Calculate earned value with temperature bonus
  const temperatureBonus = task.temperature > 80 ? 1.5 : 1;
  const finalEarnedValue = earnedValue || Math.round(task.value * temperatureBonus);
  
  // Create archived task
  const archivedTask = {
    ...task,
    completedBy,
    completedAt: new Date().toISOString(),
    earnedValue: finalEarnedValue,
    temperatureBonus,
    archived: true
  };

  // Add to archive
  const archive = await readArchive();
  archive.push(archivedTask);
  await writeArchive(archive);

  // Remove from active tasks
  tasks.splice(taskIndex, 1);
  await writeTasks(tasks);

  return archivedTask;
};

/**
 * Get tasks by user
 */
const getTasksByUser = async (userId) => {
  const tasks = await readTasks();
  return tasks.filter(task => task.holder === userId);
};

/**
 * Get tasks by category
 */
const getTasksByCategory = async (category) => {
  const tasks = await readTasks();
  return tasks.filter(task => task.category === category);
};

/**
 * Get task statistics
 */
const getTaskStats = async () => {
  const tasks = await readTasks();
  const archive = await readArchive();
  
  const stats = {
    total: tasks.length,
    completed: archive.length,
    byCategory: {},
    byUser: {},
    avgTemperature: 0,
    hotTasks: tasks.filter(task => task.temperature > 80).length
  };

  // Calculate category distribution
  tasks.forEach(task => {
    stats.byCategory[task.category] = (stats.byCategory[task.category] || 0) + 1;
  });

  // Calculate user distribution
  tasks.forEach(task => {
    stats.byUser[task.holder] = (stats.byUser[task.holder] || 0) + 1;
  });

  // Calculate average temperature
  if (tasks.length > 0) {
    stats.avgTemperature = tasks.reduce((sum, task) => sum + (task.temperature || 0), 0) / tasks.length;
  }

  return stats;
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  passTask,
  completeTask,
  getTasksByUser,
  getTasksByCategory,
  getTaskStats
};