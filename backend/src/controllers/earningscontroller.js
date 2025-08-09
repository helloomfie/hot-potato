const earningsService = require('../services/earningsservice');

/**
 * Get user earnings
 * GET /api/earnings/user/:userId
 */
const getUserEarnings = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const earnings = await earningsService.getUserEarnings(userId);
    
    res.status(200).json({
      success: true,
      data: earnings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all users earnings
 * GET /api/earnings/all
 */
const getAllUsersEarnings = async (req, res, next) => {
  try {
    const earnings = await earningsService.getAllUsersEarnings();
    
    res.status(200).json({
      success: true,
      data: earnings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get earnings leaderboard
 * GET /api/earnings/leaderboard?timeframe=week|month|total
 */
const getEarningsLeaderboard = async (req, res, next) => {
  try {
    const { timeframe = 'week' } = req.query;
    const leaderboard = await earningsService.getEarningsLeaderboard(timeframe);
    
    res.status(200).json({
      success: true,
      data: leaderboard,
      timeframe
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get potential earnings
 * GET /api/earnings/potential
 */
const getPotentialEarnings = async (req, res, next) => {
  try {
    const potential = await earningsService.getPotentialEarnings();
    
    res.status(200).json({
      success: true,
      data: potential
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user performance stats
 * GET /api/earnings/user/:userId/stats
 */
const getUserPerformanceStats = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const stats = await earningsService.getUserPerformanceStats(userId);
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserEarnings,
  getAllUsersEarnings,
  getEarningsLeaderboard,
  getPotentialEarnings,
  getUserPerformanceStats
};