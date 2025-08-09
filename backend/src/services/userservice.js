// userservice.js - User-related service functions

// Mock user data based on your frontend teamStats
const users = {
  ilan: { 
    id: "ilan", 
    name: "Ilan", 
    avatar: "👨‍💻", 
    title: "Admin 1", 
    status: "active", 
    level: 12, 
    xp: 2847, 
    potatoesCompleted: 23, 
    streak: 7, 
    speciality: "Game Master",
    totalScore: 2847,
    gamesPlayed: 45,
    achievements: []
  },
  nas: { 
    id: "nas", 
    name: "Nas", 
    avatar: "👩‍🎨", 
    title: "Admin 3", 
    status: "active", 
    level: 15, 
    xp: 3421, 
    potatoesCompleted: 31, 
    streak: 12, 
    speciality: "Quality Queen",
    totalScore: 3421,
    gamesPlayed: 62,
    achievements: []
  },
  juan: { 
    id: "juan", 
    name: "Juan", 
    avatar: "👨‍💼", 
    title: "Admin 2", 
    status: "break", 
    level: 10, 
    xp: 2156, 
    potatoesCompleted: 18, 
    streak: 4, 
    speciality: "Strategic Mind",
    totalScore: 2156,
    gamesPlayed: 34,
    achievements: []
  },
  jessie: { 
    id: "jessie", 
    name: "Jessie", 
    avatar: "👩‍💻", 
    title: "Admin 5", 
    status: "active", 
    level: 11, 
    xp: 2654, 
    potatoesCompleted: 20, 
    streak: 9, 
    speciality: "Bug Crusher",
    totalScore: 2654,
    gamesPlayed: 41,
    achievements: []
  },
  brandon: { 
    id: "brandon", 
    name: "Brandon", 
    avatar: "👨‍🔬", 
    title: "Admin 4", 
    status: "active", 
    level: 13, 
    xp: 2983, 
    potatoesCompleted: 25, 
    streak: 6, 
    speciality: "Data Wizard",
    totalScore: 2983,
    gamesPlayed: 51,
    achievements: []
  }
};

const userservice = {
  // Get user by ID
  getUserById: async (userId) => {
    return users[userId] || null;
  },

  // Get all users
  getAllUsers: async () => {
    return Object.values(users);
  },

  // Update user stats
  updateUserStats: async (userId, stats) => {
    if (users[userId]) {
      users[userId] = { ...users[userId], ...stats };
      return users[userId];
    }
    return null;
  },

  // Update user score
  updateUserScore: async (userId, score) => {
    if (users[userId]) {
      users[userId].totalScore = (users[userId].totalScore || 0) + score;
      users[userId].xp = (users[userId].xp || 0) + score;
      
      // Update level based on XP (every 250 XP = 1 level)
      users[userId].level = Math.floor(users[userId].xp / 250) + 1;
      
      return users[userId];
    }
    return null;
  },

  // Get user achievements
  getUserAchievements: async (userId) => {
    if (users[userId]) {
      return users[userId].achievements || [];
    }
    return [];
  },

  // Award achievement to user
  awardAchievement: async (userId, achievementId, achievementName) => {
    if (users[userId]) {
      if (!users[userId].achievements) {
        users[userId].achievements = [];
      }
      
      const achievement = {
        id: achievementId,
        name: achievementName,
        awardedAt: new Date().toISOString()
      };
      
      users[userId].achievements.push(achievement);
      return achievement;
    }
    return null;
  },

  // Record game session for user
  recordUserSession: async (userId, sessionData) => {
    if (users[userId]) {
      users[userId].gamesPlayed = (users[userId].gamesPlayed || 0) + 1;
      users[userId].lastPlayedAt = new Date().toISOString();
      
      // Update streak logic could go here
      if (sessionData.tasksCompleted && sessionData.tasksCompleted > 0) {
        users[userId].potatoesCompleted = (users[userId].potatoesCompleted || 0) + sessionData.tasksCompleted;
      }
      
      return users[userId];
    }
    return null;
  },

  // Get leaderboard data
  getLeaderboard: async (sortBy = 'xp', limit = 10) => {
    const userList = Object.values(users);
    
    // Sort based on the specified field
    userList.sort((a, b) => {
      if (sortBy === 'level') return b.level - a.level;
      if (sortBy === 'potatoesCompleted') return b.potatoesCompleted - a.potatoesCompleted;
      if (sortBy === 'streak') return b.streak - a.streak;
      if (sortBy === 'totalScore') return b.totalScore - a.totalScore;
      return b.xp - a.xp; // default to xp
    });
    
    return userList.slice(0, limit).map((user, index) => ({
      ...user,
      rank: index + 1
    }));
  },

  // Validate user ID
  isValidUserId: (userId) => {
    return ['ilan', 'nas', 'juan', 'jessie', 'brandon'].includes(userId);
  }
};

module.exports = userservice;