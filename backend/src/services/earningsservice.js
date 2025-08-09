// earningsservice.js - Calculate real earnings from archived tasks

const fs = require('fs').promises;
const path = require('path');

const ARCHIVE_FILE = path.join(__dirname, '../../data/archive.json');

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
 * Calculate user earnings from archived tasks
 */
const getUserEarnings = async (userId) => {
  const archive = await readArchive();
  const userTasks = archive.filter(task => task.completedBy === userId);
  
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const thisWeekTasks = userTasks.filter(task => 
    new Date(task.completedAt) >= startOfWeek
  );
  
  const thisMonthTasks = userTasks.filter(task => 
    new Date(task.completedAt) >= startOfMonth
  );
  
  const totalEarned = userTasks.reduce((sum, task) => sum + (task.earnedValue || task.value || 0), 0);
  const thisWeekEarned = thisWeekTasks.reduce((sum, task) => sum + (task.earnedValue || task.value || 0), 0);
  const thisMonthEarned = thisMonthTasks.reduce((sum, task) => sum + (task.earnedValue || task.value || 0), 0);
  
  const avgPerTask = userTasks.length > 0 ? totalEarned / userTasks.length : 0;
  const bestTask = userTasks.length > 0 ? Math.max(...userTasks.map(t => t.earnedValue || t.value || 0)) : 0;
  
  return {
    total: totalEarned,
    thisWeek: thisWeekEarned,
    thisMonth: thisMonthEarned,
    completedTasks: userTasks.length,
    avgPerTask: Math.round(avgPerTask),
    bestTask,
    thisWeekTasks: thisWeekTasks.length,
    thisMonthTasks: thisMonthTasks.length
  };
};

/**
 * Get all users earnings
 */
const getAllUsersEarnings = async () => {
  const archive = await readArchive();
  const users = ['ilan', 'nas', 'juan', 'jessie', 'brandon'];
  
  const earnings = {};
  
  for (const userId of users) {
    earnings[userId] = await getUserEarnings(userId);
  }
  
  return earnings;
};

/**
 * Get earnings leaderboard
 */
const getEarningsLeaderboard = async (timeframe = 'week') => {
  const allEarnings = await getAllUsersEarnings();
  
  const leaderboard = Object.entries(allEarnings).map(([userId, earnings]) => ({
    userId,
    earnings: timeframe === 'week' ? earnings.thisWeek : 
             timeframe === 'month' ? earnings.thisMonth : 
             earnings.total,
    completedTasks: timeframe === 'week' ? earnings.thisWeekTasks :
                   timeframe === 'month' ? earnings.thisMonthTasks :
                   earnings.completedTasks
  }));
  
  return leaderboard.sort((a, b) => b.earnings - a.earnings);
};

/**
 * Get potential earnings from active tasks
 */
const getPotentialEarnings = async () => {
  const TASKS_FILE = path.join(__dirname, '../../data/tasks.json');
  
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf8');
    const tasks = JSON.parse(data);
    
    return {
      total: tasks.reduce((sum, task) => {
        const baseValue = task.value || 1000;
        const tempBonus = (task.temperature || 0) > 80 ? 1.5 : 1;
        const difficultyMultiplier = task.difficulty === 'epic' ? 3 : 
                                   task.difficulty === 'rare' ? 2 : 1;
        return sum + Math.round(baseValue * tempBonus * difficultyMultiplier);
      }, 0),
      
      byUser: tasks.reduce((acc, task) => {
        const baseValue = task.value || 1000;
        const tempBonus = (task.temperature || 0) > 80 ? 1.5 : 1;
        const earning = Math.round(baseValue * tempBonus);
        
        acc[task.holder] = (acc[task.holder] || 0) + earning;
        return acc;
      }, {}),
      
      epic: tasks.filter(t => t.difficulty === 'epic').reduce((sum, task) => 
        sum + (task.value || 1000) * 3, 0),
      
      totalTasks: tasks.length,
      epicTasks: tasks.filter(t => t.difficulty === 'epic').length
    };
  } catch (error) {
    return { total: 0, byUser: {}, epic: 0, totalTasks: 0, epicTasks: 0 };
  }
};

/**
 * Get user performance stats
 */
const getUserPerformanceStats = async (userId) => {
  const archive = await readArchive();
  const userTasks = archive.filter(task => task.completedBy === userId);
  
  const categoryStats = userTasks.reduce((acc, task) => {
    const category = task.category || 'Unknown';
    acc[category] = (acc[category] || 0) + (task.earnedValue || task.value || 0);
    return acc;
  }, {});
  
  const hotTasksCompleted = userTasks.filter(task => (task.temperature || 0) > 80).length;
  const avgTemperature = userTasks.length > 0 ? 
    userTasks.reduce((sum, task) => sum + (task.temperature || 0), 0) / userTasks.length : 0;
  
  return {
    categoryEarnings: categoryStats,
    hotTasksCompleted,
    avgTemperature: Math.round(avgTemperature),
    totalBonusEarned: userTasks.reduce((sum, task) => 
      sum + ((task.earnedValue || task.value || 0) - (task.value || 0)), 0)
  };
};

module.exports = {
  getUserEarnings,
  getAllUsersEarnings,
  getEarningsLeaderboard,
  getPotentialEarnings,
  getUserPerformanceStats
};