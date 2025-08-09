const express = require('express');
const router = express.Router();

// Import earnings controller
const earningsController = require('../controllers/earningscontroller');

/**
 * @route   GET /api/earnings/all
 * @desc    Get all users' earnings
 * @access  Public
 */
router.get('/all', earningsController.getAllUsersEarnings);

/**
 * @route   GET /api/earnings/leaderboard
 * @desc    Get earnings leaderboard
 * @access  Public
 */
router.get('/leaderboard', earningsController.getEarningsLeaderboard);

/**
 * @route   GET /api/earnings/potential
 * @desc    Get potential earnings from active tasks
 * @access  Public
 */
router.get('/potential', earningsController.getPotentialEarnings);

/**
 * @route   GET /api/earnings/user/:userId
 * @desc    Get specific user's earnings
 * @access  Public
 */
router.get('/user/:userId', earningsController.getUserEarnings);

/**
 * @route   GET /api/earnings/user/:userId/stats
 * @desc    Get user performance statistics
 * @access  Public
 */
router.get('/user/:userId/stats', earningsController.getUserPerformanceStats);

module.exports = router;