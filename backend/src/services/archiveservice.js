const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Path to data files
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
 * Write archive to JSON file
 */
const writeArchive = async (archive) => {
  await fs.writeFile(ARCHIVE_FILE, JSON.stringify(archive, null, 2));
};

/**
 * Get all archived tasks with pagination
 */
const getAllArchivedTasks = async (page = 1, limit = 20, sortBy = 'completedAt', sortOrder = 'desc') => {
  const archive = await readArchive();
  
  // Sort archive
  archive.sort((a, b) => {
    const aValue = a[sortBy] || '';
    const bValue = b[sortBy] || '';
    
    if (sortOrder === 'desc') {
      return bValue.localeCompare ? bValue.localeCompare(aValue) : bValue - aValue;
    } else {
      return aValue.localeCompare ? aValue.localeCompare(bValue) : aValue - bValue;
    }
  });

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = archive.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    total: archive.length,
    page,
    limit
  };
};

/**
 * Get archived task by ID
 */
const getArchivedTaskById = async (id) => {
  const archive = await readArchive();
  return archive.find(task => task.id === id);
};

/**
 * Archive a completed task
 */
const archiveTask = async (archiveData) => {
  const archive = await readArchive();
  
  const archivedTask = {
    id: archiveData.taskId || uuidv4(),
    title: archiveData.title,
    description: archiveData.description,
    category: archiveData.category,
    difficulty: archiveData.difficulty,
    value: archiveData.value,
    holder: archiveData.holder,
    completedBy: archiveData.completedBy,
    completedAt: archiveData.completedAt || new Date().toISOString(),
    earnedValue: archiveData.earnedValue || archiveData.value,
    temperature: archiveData.temperature || 0,
    temperatureBonus: archiveData.temperatureBonus || 1,
    passCount: archiveData.passCount || 0,
    timeLeft: archiveData.timeLeft || 0,
    createdAt: archiveData.createdAt || new Date().toISOString(),
    archivedAt: new Date().toISOString()
  };

  archive.push(archivedTask);
  await writeArchive(archive);
  
  return archivedTask;
};

/**
 * Get archived tasks by user
 */
const getArchivedTasksByUser = async (userId, page = 1, limit = 20) => {
  const archive = await readArchive();
  const userTasks = archive.filter(task => task.completedBy === userId);
  
  // Sort by completion date (newest first)
  userTasks.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = userTasks.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    total: userTasks.length,
    page,
    limit
  };
};

/**
 * Get archived tasks by category
 */
const getArchivedTasksByCategory = async (category, page = 1, limit = 20) => {
  const archive = await readArchive();
  const categoryTasks = archive.filter(task => task.category === category);
  
  // Sort by completion date (newest first)
  categoryTasks.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = categoryTasks.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    total: categoryTasks.length,
    page,
    limit
  };
};

/**
 * Get archive statistics
 */
const getArchiveStats = async () => {
  const archive = await readArchive();
  
  const stats = {
    totalCompleted: archive.length,
    totalValueEarned: archive.reduce((sum, task) => sum + (task.earnedValue || 0), 0),
    averageValuePerTask: archive.length > 0 ? 
      archive.reduce((sum, task) => sum + (task.earnedValue || 0), 0) / archive.length : 0,
    
    byCategory: {},
    byUser: {},
    byDifficulty: {},
    
    performanceMetrics: {
      averageTemperature: archive.length > 0 ? 
        archive.reduce((sum, task) => sum + (task.temperature || 0), 0) / archive.length : 0,
      highTemperatureTasks: archive.filter(task => task.temperature > 80).length,
      bonusTasksCount: archive.filter(task => task.temperatureBonus > 1).length,
      totalBonusEarned: archive.reduce((sum, task) => 
        sum + ((task.earnedValue || 0) - (task.value || 0)), 0)
    },

    timeMetrics: {
      tasksThisWeek: archive.filter(task => {
        const completedDate = new Date(task.completedAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return completedDate >= weekAgo;
      }).length,
      
      tasksThisMonth: archive.filter(task => {
        const completedDate = new Date(task.completedAt);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return completedDate >= monthAgo;
      }).length
    }
  };

  // Calculate category distribution
  archive.forEach(task => {
    stats.byCategory[task.category] = (stats.byCategory[task.category] || 0) + 1;
  });

  // Calculate user distribution
  archive.forEach(task => {
    if (!stats.byUser[task.completedBy]) {
      stats.byUser[task.completedBy] = {
        count: 0,
        totalEarned: 0,
        averageEarned: 0
      };
    }
    stats.byUser[task.completedBy].count += 1;
    stats.byUser[task.completedBy].totalEarned += task.earnedValue || 0;
    stats.byUser[task.completedBy].averageEarned = 
      stats.byUser[task.completedBy].totalEarned / stats.byUser[task.completedBy].count;
  });

  // Calculate difficulty distribution
  archive.forEach(task => {
    const difficulty = task.difficulty || 'common';
    stats.byDifficulty[difficulty] = (stats.byDifficulty[difficulty] || 0) + 1;
  });

  return stats;
};

/**
 * Get archive report with filters
 */
const getArchiveReport = async (filters = {}) => {
  const archive = await readArchive();
  let filteredArchive = [...archive];

  // Apply filters
  if (filters.startDate) {
    const startDate = new Date(filters.startDate);
    filteredArchive = filteredArchive.filter(task => 
      new Date(task.completedAt) >= startDate
    );
  }

  if (filters.endDate) {
    const endDate = new Date(filters.endDate);
    filteredArchive = filteredArchive.filter(task => 
      new Date(task.completedAt) <= endDate
    );
  }

  if (filters.userId) {
    filteredArchive = filteredArchive.filter(task => 
      task.completedBy === filters.userId
    );
  }

  if (filters.category) {
    filteredArchive = filteredArchive.filter(task => 
      task.category === filters.category
    );
  }

  if (filters.difficulty) {
    filteredArchive = filteredArchive.filter(task => 
      task.difficulty === filters.difficulty
    );
  }

  // Generate report
  const report = {
    filters: filters,
    period: {
      startDate: filters.startDate || 'All time',
      endDate: filters.endDate || 'Present',
      totalDays: filters.startDate && filters.endDate ? 
        Math.ceil((new Date(filters.endDate) - new Date(filters.startDate)) / (1000 * 60 * 60 * 24)) : null
    },
    summary: {
      totalTasks: filteredArchive.length,
      totalValue: filteredArchive.reduce((sum, task) => sum + (task.earnedValue || 0), 0),
      averageValue: filteredArchive.length > 0 ? 
        filteredArchive.reduce((sum, task) => sum + (task.earnedValue || 0), 0) / filteredArchive.length : 0,
      highestValue: Math.max(...filteredArchive.map(task => task.earnedValue || 0), 0),
      lowestValue: filteredArchive.length > 0 ? 
        Math.min(...filteredArchive.map(task => task.earnedValue || 0)) : 0
    },
    breakdown: {
      byCategory: {},
      byUser: {},
      byDifficulty: {},
      byMonth: {}
    },
    topPerformers: [],
    data: filteredArchive.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
  };

  // Calculate breakdowns
  filteredArchive.forEach(task => {
    // By category
    if (!report.breakdown.byCategory[task.category]) {
      report.breakdown.byCategory[task.category] = { count: 0, totalValue: 0 };
    }
    report.breakdown.byCategory[task.category].count += 1;
    report.breakdown.byCategory[task.category].totalValue += task.earnedValue || 0;

    // By user
    if (!report.breakdown.byUser[task.completedBy]) {
      report.breakdown.byUser[task.completedBy] = { count: 0, totalValue: 0 };
    }
    report.breakdown.byUser[task.completedBy].count += 1;
    report.breakdown.byUser[task.completedBy].totalValue += task.earnedValue || 0;

    // By difficulty
    const difficulty = task.difficulty || 'common';
    if (!report.breakdown.byDifficulty[difficulty]) {
      report.breakdown.byDifficulty[difficulty] = { count: 0, totalValue: 0 };
    }
    report.breakdown.byDifficulty[difficulty].count += 1;
    report.breakdown.byDifficulty[difficulty].totalValue += task.earnedValue || 0;

    // By month
    const month = new Date(task.completedAt).toISOString().substring(0, 7); // YYYY-MM
    if (!report.breakdown.byMonth[month]) {
      report.breakdown.byMonth[month] = { count: 0, totalValue: 0 };
    }
    report.breakdown.byMonth[month].count += 1;
    report.breakdown.byMonth[month].totalValue += task.earnedValue || 0;
  });

  // Calculate top performers
  report.topPerformers = Object.entries(report.breakdown.byUser)
    .map(([userId, data]) => ({
      userId,
      ...data,
      averageValue: data.totalValue / data.count
    }))
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5);

  return report;
};

/**
 * Delete archived task
 */
const deleteArchivedTask = async (id) => {
  const archive = await readArchive();
  const taskIndex = archive.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return false;
  }

  archive.splice(taskIndex, 1);
  await writeArchive(archive);
  return true;
};

/**
 * Export archive data to CSV
 */
const exportToCSV = async (filters = {}) => {
  const report = await getArchiveReport(filters);
  const tasks = report.data;

  if (tasks.length === 0) {
    return 'No data available for the specified filters\n';
  }

  // CSV Headers
  const headers = [
    'ID',
    'Title',
    'Description',
    'Category',
    'Difficulty',
    'Original Value',
    'Earned Value',
    'Temperature',
    'Temperature Bonus',
    'Pass Count',
    'Completed By',
    'Completed At',
    'Created At'
  ];

  // Convert tasks to CSV rows
  const csvRows = tasks.map(task => [
    task.id,
    `"${(task.title || '').replace(/"/g, '""')}"`,
    `"${(task.description || '').replace(/"/g, '""')}"`,
    task.category || '',
    task.difficulty || '',
    task.value || 0,
    task.earnedValue || 0,
    task.temperature || 0,
    task.temperatureBonus || 1,
    task.passCount || 0,
    task.completedBy || '',
    task.completedAt || '',
    task.createdAt || ''
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...csvRows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
};

/**
 * Get recent archived tasks
 */
const getRecentArchivedTasks = async (limit = 10) => {
  const archive = await readArchive();
  
  return archive
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    .slice(0, limit);
};

/**
 * Get archive trends
 */
const getArchiveTrends = async (days = 30) => {
  const archive = await readArchive();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const recentTasks = archive.filter(task => 
    new Date(task.completedAt) >= cutoffDate
  );

  const trends = {
    dailyCompletions: {},
    dailyEarnings: {},
    categoryTrends: {},
    userTrends: {}
  };

  recentTasks.forEach(task => {
    const date = task.completedAt.split('T')[0]; // YYYY-MM-DD
    
    // Daily completions
    trends.dailyCompletions[date] = (trends.dailyCompletions[date] || 0) + 1;
    
    // Daily earnings
    trends.dailyEarnings[date] = (trends.dailyEarnings[date] || 0) + (task.earnedValue || 0);
    
    // Category trends
    if (!trends.categoryTrends[task.category]) {
      trends.categoryTrends[task.category] = {};
    }
    trends.categoryTrends[task.category][date] = 
      (trends.categoryTrends[task.category][date] || 0) + 1;
    
    // User trends
    if (!trends.userTrends[task.completedBy]) {
      trends.userTrends[task.completedBy] = {};
    }
    trends.userTrends[task.completedBy][date] = 
      (trends.userTrends[task.completedBy][date] || 0) + 1;
  });

  return trends;
};

module.exports = {
  getAllArchivedTasks,
  getArchivedTaskById,
  archiveTask,
  getArchivedTasksByUser,
  getArchivedTasksByCategory,
  getArchiveStats,
  getArchiveReport,
  deleteArchivedTask,
  exportToCSV,
  getRecentArchivedTasks,
  getArchiveTrends
};