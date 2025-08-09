const userService = require('../services/userservice');
const { validationResult } = require('express-validator');

/**
 * Get all users (team stats)
 * GET /api/users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get specific user by ID
 * GET /api/users/:userId
 */
const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User ${userId} not found`
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user statistics
 * GET /api/users/:userId/stats
 */
const getUserStats = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User ${userId} not found`
      });
    }

    // Return user stats formatted for frontend
    const stats = {
      id: user.id,
      name: user.name,
      level: user.level,
      xp: user.xp,
      totalScore: user.totalScore,
      potatoesCompleted: user.potatoesCompleted,
      streak: user.streak,
      gamesPlayed: user.gamesPlayed,
      status: user.status,
      achievements: user.achievements || []
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user information
 * PUT /api/users/:userId
 */
const updateUser = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { userId } = req.params;
    const updateData = req.body;
    
    const updatedUser = await userService.updateUserStats(userId, updateData);
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: `User ${userId} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user status
 * PUT /api/users/:userId/status
 */
const updateUserStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { userId } = req.params;
    const { status } = req.body;
    
    const updatedUser = await userService.updateUserStats(userId, { status });
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: `User ${userId} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: 'User status updated successfully',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add XP to user
 * POST /api/users/:userId/xp
 */
const addUserXP = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { userId } = req.params;
    const { xp } = req.body;
    
    const updatedUser = await userService.updateUserScore(userId, xp);
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: `User ${userId} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: 'XP added successfully',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user streak
 * POST /api/users/:userId/streak
 */
const updateUserStreak = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { increment, reset } = req.body;
    
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User ${userId} not found`
      });
    }

    let newStreak = user.streak || 0;
    
    if (reset) {
      newStreak = 0;
    } else if (increment) {
      newStreak += 1;
    }
    
    const updatedUser = await userService.updateUserStats(userId, { streak: newStreak });

    res.status(200).json({
      success: true,
      message: 'Streak updated successfully',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user achievements
 * GET /api/users/:userId/achievements
 */
const getUserAchievements = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const achievements = await userService.getUserAchievements(userId);

    res.status(200).json({
      success: true,
      count: achievements.length,
      data: achievements
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Record potato completion for user
 * POST /api/users/:userId/potato-complete
 */
const recordPotatoCompletion = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { userId } = req.params;
    const { value, temperature } = req.body;
    
    // Calculate bonus based on temperature
    const temperatureBonus = temperature > 80 ? 1.5 : 1;
    const earnedXP = Math.round(value * temperatureBonus);
    
    // Update user score and potato count
    const updatedUser = await userService.updateUserScore(userId, earnedXP);
    if (updatedUser) {
      updatedUser.potatoesCompleted = (updatedUser.potatoesCompleted || 0) + 1;
      await userService.updateUserStats(userId, { 
        potatoesCompleted: updatedUser.potatoesCompleted 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Potato completion recorded',
      data: {
        earnedXP,
        temperatureBonus,
        user: updatedUser
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserStats,
  updateUser,
  updateUserStatus,
  addUserXP,
  updateUserStreak,
  getUserAchievements,
  recordPotatoCompletion
};