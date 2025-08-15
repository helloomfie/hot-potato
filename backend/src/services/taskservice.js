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
 * Calculate real-time task temperature based on age and passes
 */
const calculateTemperature = (task) => {
  const now = new Date();
  const created = new Date(task.createdAt);
  const ageInSeconds = (now - created) / 1000;
  
  // Base temperature increase: 0.1 per second (6 per minute)
  let temperature = Math.min(ageInSeconds * 0.1, 100);
  
  // Pass penalty: +5 per pass
  temperature += (task.passCount || 0) * 5;
  
  // Add stored temperature if any
  temperature += (task.storedTemperature || 0);
  
  return Math.min(temperature, 100);
};

/**
 * Calculate time left for task completion
 */
const calculateTimeLeft = (task) => {
  const now = new Date();
  const created = new Date(task.createdAt);
  const elapsed = (now - created) / 1000;
  
  const timeLimit = task.timeLeft || 3600; // Default 1 hour
  return Math.max(timeLimit - elapsed, 0);
};

/**
 * Get bonus multiplier based on temperature
 */
const getBonusMultiplier = (task) => {
  const temperature = calculateTemperature(task);
  
  if (temperature > 90) return 2.0;    // Critical: 2x bonus
  if (temperature > 80) return 1.5;    // Hot: 1.5x bonus  
  if (temperature > 60) return 1.2;    // Warm: 1.2x bonus
  return 1.0;                          // Normal: no bonus
};

/**
 * Get default task value based on difficulty
 */
const getDefaultValue = (difficulty) => {
  const values = {
    common: 10,
    rare: 25,
    epic: 50
  };
  return values[difficulty] || 10;
};

/**
 * Get all tasks with real-time calculations
 */
const getAllTasks = async () => {
  const tasks = await readTasks();
  
  // Update tasks with real-time calculations
  const updatedTasks = tasks.map(task => ({
    ...task,
    temperature: calculateTemperature(task),
    timeLeft: calculateTimeLeft(task),
    bonusMultiplier: getBonusMultiplier(task)
  }));

  return updatedTasks;
};

/**
 * Get task by ID
 */
const getTaskById = async (id) => {
  const tasks = await readTasks();
  const task = tasks.find(task => task.id === id);
  
  if (task) {
    return {
      ...task,
      temperature: calculateTemperature(task),
      timeLeft: calculateTimeLeft(task),
      bonusMultiplier: getBonusMultiplier(task)
    };
  }
  
  return null;
};

/**
 * Create new task
 */
const createTask = async (taskData) => {
  const tasks = await readTasks();
  
  const newTask = {
    id: uuidv4(),
    title: taskData.title,
    description: taskData.description || '',
    category: taskData.category || 'Sales',
    difficulty: taskData.difficulty || 'common',
    value: taskData.value || getDefaultValue(taskData.difficulty),
    holder: taskData.holder || null,
    timeLeft: taskData.timeLeft || 3600, // Default 1 hour
    storedTemperature: 0, // Base temperature stored in file
    passCount: 0,
    lastPasser: null,
    combo: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tasks.push(newTask);
  await writeTasks(tasks);
  
  // Return with calculated fields
  return {
    ...newTask,
    temperature: calculateTemperature(newTask),
    bonusMultiplier: getBonusMultiplier(newTask)
  };
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
  
  // Return with calculated fields
  const updatedTask = tasks[taskIndex];
  return {
    ...updatedTask,
    temperature: calculateTemperature(updatedTask),
    timeLeft: calculateTimeLeft(updatedTask),
    bonusMultiplier: getBonusMultiplier(updatedTask)
  };
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
 * Pass task to another user with enhanced game mechanics
 */
const passTask = async (id, fromUser, toUser) => {
  const tasks = await readTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return null;
  }

  const task = tasks[taskIndex];
  
  // Calculate current temperature and add pass penalty
  const currentTemp = calculateTemperature(task);
  const newStoredTemp = Math.min(currentTemp + 5, 100);
  
  // Update task with pass information
  tasks[taskIndex] = {
    ...task,
    holder: toUser,
    lastPasser: fromUser,
    passCount: (task.passCount || 0) + 1,
    storedTemperature: newStoredTemp, // Store the penalty
    combo: task.lastPasser === toUser ? (task.combo || 0) + 1 : 0,
    updatedAt: new Date().toISOString()
  };

  await writeTasks(tasks);
  
  // Return with calculated fields
  const updatedTask = tasks[taskIndex];
  return {
    ...updatedTask,
    temperature: calculateTemperature(updatedTask),
    timeLeft: calculateTimeLeft(updatedTask),
    bonusMultiplier: getBonusMultiplier(updatedTask)
  };
};

/**
 * Complete task and move to archive with game scoring
 */
const completeTask = async (id, completedBy, completionData) => {
  const tasks = await readTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return null;
  }

  const task = tasks[taskIndex];
  
  // Calculate game values
  const temperature = calculateTemperature(task);
  const bonusMultiplier = getBonusMultiplier(task);
  const baseValue = task.value || getDefaultValue(task.difficulty);
  const earnedValue = Math.floor(baseValue * bonusMultiplier);
  
  // Create comprehensive archive entry
  const archivedTask = {
    ...task,
    completedBy,
    completedAt: new Date().toISOString(),
    earnedValue,
    finalTemperature: temperature,
    bonusMultiplier,
    gameScore: Math.floor(earnedValue / 10),
    completionTime: Date.now() - new Date(task.createdAt).getTime(),
    archived: true,
    ...completionData // Any additional completion data
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
  const userTasks = tasks.filter(task => task.holder === userId);
  
  // Add calculated fields
  return userTasks.map(task => ({
    ...task,
    temperature: calculateTemperature(task),
    timeLeft: calculateTimeLeft(task),
    bonusMultiplier: getBonusMultiplier(task)
  }));
};

/**
 * Get tasks by category
 */
const getTasksByCategory = async (category) => {
  const tasks = await readTasks();
  const categoryTasks = tasks.filter(task => task.category === category);
  
  // Add calculated fields
  return categoryTasks.map(task => ({
    ...task,
    temperature: calculateTemperature(task),
    timeLeft: calculateTimeLeft(task),
    bonusMultiplier: getBonusMultiplier(task)
  }));
};

/**
 * Get enhanced task statistics for game
 */
const getTaskStats = async () => {
  const tasks = await readTasks();
  const archive = await readArchive();
  
  const stats = {
    total: tasks.length,
    completed: archive.length,
    byCategory: {},
    byUser: {},
    byDifficulty: {},
    avgTemperature: 0,
    hotTasks: 0, // tasks with temperature > 80
    criticalTasks: 0, // tasks with temperature > 90
    totalValue: 0,
    potentialEarnings: 0
  };

  let temperatureSum = 0;

  // Calculate enhanced statistics
  tasks.forEach(task => {
    const temperature = calculateTemperature(task);
    const bonusMultiplier = getBonusMultiplier(task);
    const value = task.value || getDefaultValue(task.difficulty);
    
    temperatureSum += temperature;
    
    if (temperature > 90) stats.criticalTasks++;
    if (temperature > 80) stats.hotTasks++;
    
    stats.totalValue += value;
    stats.potentialEarnings += Math.floor(value * bonusMultiplier);

    // Category distribution
    stats.byCategory[task.category] = (stats.byCategory[task.category] || 0) + 1;
    
    // Difficulty distribution
    stats.byDifficulty[task.difficulty] = (stats.byDifficulty[task.difficulty] || 0) + 1;

    // User distribution
    if (task.holder) {
      stats.byUser[task.holder] = (stats.byUser[task.holder] || 0) + 1;
    }
  });

  // Calculate average temperature
  stats.avgTemperature = tasks.length > 0 ? temperatureSum / tasks.length : 0;

  return stats;
};

/**
 * Get archived tasks with pagination
 */
const getArchivedTasks = async (limit = 50, offset = 0) => {
  const archive = await readArchive();
  
  // Sort by completion date (newest first)
  const sortedArchive = archive.sort((a, b) => 
    new Date(b.completedAt) - new Date(a.completedAt)
  );
  
  return {
    tasks: sortedArchive.slice(offset, offset + limit),
    total: archive.length,
    hasMore: offset + limit < archive.length
  };
};

/**
 * Get user performance statistics
 */
const getUserStats = async (userId) => {
  const tasks = await readTasks();
  const archive = await readArchive();
  
  const userTasks = tasks.filter(task => task.holder === userId);
  const userCompleted = archive.filter(task => task.completedBy === userId);
  
  const stats = {
    activeTasks: userTasks.length,
    completedTasks: userCompleted.length,
    totalEarnings: userCompleted.reduce((sum, task) => sum + (task.earnedValue || 0), 0),
    averageTemperature: 0,
    hotTasksHeld: userTasks.filter(task => calculateTemperature(task) > 80).length,
    fastestCompletion: null,
    slowestCompletion: null
  };
  
  if (userTasks.length > 0) {
    stats.averageTemperature = userTasks.reduce((sum, task) => 
      sum + calculateTemperature(task), 0) / userTasks.length;
  }
  
  if (userCompleted.length > 0) {
    const completionTimes = userCompleted
      .filter(task => task.completionTime)
      .map(task => task.completionTime);
    
    if (completionTimes.length > 0) {
      stats.fastestCompletion = Math.min(...completionTimes);
      stats.slowestCompletion = Math.max(...completionTimes);
    }
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
  getTaskStats,
  getArchivedTasks,
  getUserStats,
  // New game calculation methods
  calculateTemperature,
  calculateTimeLeft,
  getBonusMultiplier,
  getDefaultValue
};