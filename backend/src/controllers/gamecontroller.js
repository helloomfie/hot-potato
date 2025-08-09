const gameservice = require('../services/gameservice');
const { validationResult } = require('express-validator');

/**
 * Get overall game statistics
 * GET /api/game/stats
 */
const getGameStats = async (req, res, next) => {
  try {
    const stats = await gameservice.getGameStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get game leaderboard
 * GET /api/game/leaderboard
 */
const getLeaderboard = async (req, res, next) => {
  try {
    const { sortBy = 'score', limit = 10 } = req.query;
    const leaderboard = await gameservice.getLeaderboard(sortBy, parseInt(limit));
    
    res.status(200).json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get game stats for specific user
 * GET /api/game/user/:userId
 */
const getUserGameStats = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const userStats = await gameservice.getUserGameStats(userId);
    
    if (!userStats) {
      return res.status(404).json({
        success: false,
        message: `Game stats for user ${userId} not found`
      });
    }

    res.status(200).json({
      success: true,
      data: userStats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user game score
 * POST /api/game/score
 */
const updateScore = async (req, res, next) => {
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

    const { userId, score, level, tasksCompleted } = req.body;
    const result = await gameservice.updateScore(userId, score, level, tasksCompleted);

    res.status(200).json({
      success: true,
      message: 'Score updated successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Record game session
 * POST /api/game/session
 */
const recordSession = async (req, res, next) => {
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

    const sessionData = req.body;
    const session = await gameservice.recordSession(sessionData);

    res.status(201).json({
      success: true,
      message: 'Game session recorded successfully',
      data: session
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user achievements
 * GET /api/game/achievements/:userId
 */
const getUserAchievements = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const achievements = await gameservice.getUserAchievements(userId);

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
 * Award achievement to user
 * POST /api/game/achievements
 */
const awardAchievement = async (req, res, next) => {
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

    const { userId, achievementId, achievementName } = req.body;
    const achievement = await gameservice.awardAchievement(userId, achievementId, achievementName);

    res.status(201).json({
      success: true,
      message: 'Achievement awarded successfully',
      data: achievement
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGameStats,
  getLeaderboard,
  getUserGameStats,
  updateScore,
  recordSession,
  getUserAchievements,
  awardAchievement
};