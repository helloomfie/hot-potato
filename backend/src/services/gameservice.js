const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const userservice = require('./userservice');
const taskservice = require('./taskservice');

// Path to data files
const GAME_STATS_FILE = path.join(__dirname, '../../data/gamestats.json');
const GAME_SESSIONS_FILE = path.join(__dirname, '../../data/gamesessions.json');
const ACHIEVEMENTS_FILE = path.join(__dirname, '../../data/achievements.json');

/**
 * Read game stats from JSON file
 */
const readGameStats = async () => {
  try {
    const data = await fs.readFile(GAME_STATS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      const defaultStats = {};
      await writeGameStats(defaultStats);
      return defaultStats;
    }
    throw error;
  }
};

/**
 * Write game stats to JSON file
 */
const writeGameStats = async (stats) => {
  await fs.writeFile(GAME_STATS_FILE, JSON.stringify(stats, null, 2));
};

/**
 * Read game sessions from JSON file
 */
const readGameSessions = async () => {
  try {
    const data = await fs.readFile(GAME_SESSIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

/**
 * Write game sessions to JSON file
 */
const writeGameSessions = async (sessions) => {
  await fs.writeFile(GAME_SESSIONS_FILE, JSON.stringify(sessions, null, 2));
};

/**
 * Read achievements from JSON file
 */
const readAchievements = async () => {
  try {
    const data = await fs.readFile(ACHIEVEMENTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

/**
 * Write achievements to JSON file
 */
const writeAchievements = async (achievements) => {
  await fs.writeFile(ACHIEVEMENTS_FILE, JSON.stringify(achievements, null, 2));
};

/**
 * Get overall game statistics
 */
const getGameStats = async () => {
  const gameStats = await readGameStats();
  const userStats = await userservice.getUserStats();
  const taskStats = await taskservice.getTaskStats();
  const sessions = await readGameSessions();
  const achievements = await readAchievements();

  const stats = {
    overview: {
      totalPlayers: userStats.totalUsers,
      activePlayers: userStats.activeUsers,
      totalTasksCompleted: userStats.totalCompletedTasks,
      totalGameSessions: sessions.length,
      totalAchievements: achievements.length
    },
    gameMetrics: {
      averageSessionDuration: sessions.length > 0 ? 
        sessions.reduce((sum, session) => sum + session.sessionDuration, 0) / sessions.length : 0,
      totalGameTime: sessions.reduce((sum, session) => sum + session.sessionDuration, 0),
      mostActivePlayer: userStats.topPerformer?.name || 'None',
      longestStreak: userStats.longestStreak
    },
    taskMetrics: {
      totalActiveTasks: taskStats.total,
      hotTasks: taskStats.hotTasks,
      averageTemperature: taskStats.avgTemperature,
      categoryDistribution: taskStats.byCategory,
      userDistribution: taskStats.byUser
    }
  };

  return stats;
};

/**
 * Get game leaderboard
 */
const getLeaderboard = async (sortBy = 'score', limit = 10) => {
  const gameStats = await readGameStats();
  const users = await userservice.getAllUsers();
  
  // Combine user data with game stats
  const leaderboard = users.map(user => {
    const userGameStats = gameStats[user.id] || {
      highScore: 0,
      totalScore: 0,
      gamesPlayed: 0,
      averageScore: 0
    };

    return {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      speciality: user.speciality,
      level: user.level,
      xp: user.xp,
      potatoesCompleted: user.potatoesCompleted,
      streak: user.streak,
      ...userGameStats
    };
  });

  // Sort based on criteria
  leaderboard.sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return (b.highScore || 0) - (a.highScore || 0);
      case 'xp':
        return (b.xp || 0) - (a.xp || 0);
      case 'level':
        return (b.level || 0) - (a.level || 0);
      case 'completed':
        return (b.potatoesCompleted || 0) - (a.potatoesCompleted || 0);
      case 'streak':
        return (b.streak || 0) - (a.streak || 0);
      default:
        return (b.highScore || 0) - (a.highScore || 0);
    }
  });

  return leaderboard.slice(0, limit);
};

/**
 * Get game stats for specific user
 */
const getUserGameStats = async (userId) => {
  const gameStats = await readGameStats();
  const user = await userservice.getUserById(userId);
  const sessions = await readGameSessions();
  const achievements = await readAchievements();

  if (!user) {
    return null;
  }

  const userGameStats = gameStats[userId] || {
    highScore: 0,
    totalScore: 0,
    gamesPlayed: 0,
    averageScore: 0,
    totalGameTime: 0
  };

  const userSessions = sessions.filter(session => session.userId === userId);
  const userAchievements = achievements.filter(achievement => achievement.userId === userId);

  return {
    user: {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      level: user.level,
      xp: user.xp
    },
    gameStats: userGameStats,
    recentSessions: userSessions.slice(-5), // Last 5 sessions
    achievements: userAchievements,
    performance: {
      totalSessions: userSessions.length,
      totalGameTime: userSessions.reduce((sum, session) => sum + session.sessionDuration, 0),
      averageSessionTime: userSessions.length > 0 ? 
        userSessions.reduce((sum, session) => sum + session.sessionDuration, 0) / userSessions.length : 0,
      bestSession: userSessions.reduce((best, session) => 
        session.score > (best.score || 0) ? session : best, {})
    }
  };
};

/**
 * Update user game score
 */
const updateScore = async (userId, score, level, tasksCompleted) => {
  const gameStats = await readGameStats();
  
  if (!gameStats[userId]) {
    gameStats[userId] = {
      highScore: 0,
      totalScore: 0,
      gamesPlayed: 0,
      averageScore: 0,
      totalGameTime: 0,
      lastPlayed: null
    };
  }

  const userStats = gameStats[userId];
  
  // Update stats
  userStats.highScore = Math.max(userStats.highScore, score);
  userStats.totalScore += score;
  userStats.gamesPlayed += 1;
  userStats.averageScore = userStats.totalScore / userStats.gamesPlayed;
  userStats.lastPlayed = new Date().toISOString();

  await writeGameStats(gameStats);

  // Update user XP if score is significant
  if (score > 50) {
    const xpGained = Math.floor(score / 10);
    await userservice.addXPToUser(userId, xpGained);
  }

  // Increment completed tasks if provided
  if (tasksCompleted && tasksCompleted > 0) {
    for (let i = 0; i < tasksCompleted; i++) {
      await userservice.incrementCompletedTasks(userId);
    }
  }

  return {
    updatedStats: userStats,
    scoreImprovement: score > userStats.highScore,
    xpGained: score > 50 ? Math.floor(score / 10) : 0
  };
};

/**
 * Record game session
 */
const recordSession = async (sessionData) => {
  const sessions = await readGameSessions();
  
  const session = {
    id: uuidv4(),
    userId: sessionData.userId,
    startTime: sessionData.startTime || new Date().toISOString(),
    endTime: sessionData.endTime || new Date().toISOString(),
    sessionDuration: sessionData.sessionDuration,
    score: sessionData.score || 0,
    level: sessionData.level || 1,
    tasksInteracted: sessionData.tasksInteracted || [],
    createdAt: new Date().toISOString()
  };

  sessions.push(session);
  await writeGameSessions(sessions);

  return session;
};

/**
 * Get user achievements
 */
const getUserAchievements = async (userId) => {
  const achievements = await readAchievements();
  return achievements.filter(achievement => achievement.userId === userId);
};

/**
 * Award achievement to user
 */
const awardAchievement = async (userId, achievementId, achievementName) => {
  const achievements = await readAchievements();
  
  // Check if user already has this achievement
  const existingAchievement = achievements.find(
    achievement => achievement.userId === userId && achievement.achievementId === achievementId
  );

  if (existingAchievement) {
    throw new Error('User already has this achievement');
  }

  const achievement = {
    id: uuidv4(),
    userId,
    achievementId,
    achievementName,
    awardedAt: new Date().toISOString()
  };

  achievements.push(achievement);
  await writeAchievements(achievements);

  // Award XP for achievement
  await userservice.addXPToUser(userId, 100);

  return achievement;
};

/**
 * Check and award automatic achievements
 */
const checkAchievements = async (userId) => {
  const user = await userservice.getUserById(userId);
  const userTasks = await userservice.getUserCompletedTasks(userId);
  const existingAchievements = await getUserAchievements(userId);
  
  const newAchievements = [];

  // Achievement checks
  const achievementChecks = [
    {
      id: 'first_task',
      name: 'First Task Completed',
      condition: userTasks.length >= 1,
      hasAchievement: existingAchievements.some(a => a.achievementId === 'first_task')
    },
    {
      id: 'task_master',
      name: 'Task Master (10 tasks)',
      condition: userTasks.length >= 10,
      hasAchievement: existingAchievements.some(a => a.achievementId === 'task_master')
    },
    {
      id: 'level_5',
      name: 'Level 5 Reached',
      condition: user.level >= 5,
      hasAchievement: existingAchievements.some(a => a.achievementId === 'level_5')
    },
    {
      id: 'xp_1000',
      name: '1000 XP Earned',
      condition: user.xp >= 1000,
      hasAchievement: existingAchievements.some(a => a.achievementId === 'xp_1000')
    },
    {
      id: 'streak_7',
      name: '7 Day Streak',
      condition: user.streak >= 7,
      hasAchievement: existingAchievements.some(a => a.achievementId === 'streak_7')
    }
  ];

  for (const check of achievementChecks) {
    if (check.condition && !check.hasAchievement) {
      const achievement = await awardAchievement(userId, check.id, check.name);
      newAchievements.push(achievement);
    }
  }

  return newAchievements;
};

module.exports = {
  getGameStats,
  getLeaderboard,
  getUserGameStats,
  updateScore,
  recordSession,
  getUserAchievements,
  awardAchievement,
  checkAchievements
};