const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Import controller (lowercase)
const gamecontroller = require('../controllers/gamecontroller');

// Validation middleware
const scoreValidation = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isIn(['ilan', 'nas', 'juan', 'jessie', 'brandon'])
    .withMessage('Invalid user ID'),
  
  body('score')
    .isNumeric()
    .withMessage('Score must be a number')
    .isFloat({ min: 0 })
    .withMessage('Score must be positive'),
  
  body('level')
    .optional()
    .isNumeric()
    .withMessage('Level must be a number'),
  
  body('tasksCompleted')
    .optional()
    .isNumeric()
    .withMessage('Tasks completed must be a number')
];

const sessionValidation = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required'),
  
  body('sessionDuration')
    .isNumeric()
    .withMessage('Session duration must be a number'),
  
  body('tasksInteracted')
    .optional()
    .isArray()
    .withMessage('Tasks interacted must be an array')
];

// Routes

/**
 * @route   GET /api/game/stats
 * @desc    Get overall game statistics
 * @access  Public
 */
router.get('/stats', gamecontroller.getGameStats);

/**
 * @route   GET /api/game/leaderboard
 * @desc    Get game leaderboard
 * @access  Public
 */
router.get('/leaderboard', gamecontroller.getLeaderboard);

/**
 * @route   GET /api/game/user/:userId
 * @desc    Get game stats for specific user
 * @access  Public
 */
router.get('/user/:userId', gamecontroller.getUserGameStats);

/**
 * @route   POST /api/game/score
 * @desc    Update user game score
 * @access  Public
 */
router.post('/score', scoreValidation, gamecontroller.updateScore);

/**
 * @route   POST /api/game/session
 * @desc    Record game session
 * @access  Public
 */
router.post('/session', sessionValidation, gamecontroller.recordSession);

/**
 * @route   GET /api/game/achievements/:userId
 * @desc    Get user achievements
 * @access  Public
 */
router.get('/achievements/:userId', gamecontroller.getUserAchievements);

/**
 * @route   POST /api/game/achievements
 * @desc    Award achievement to user
 * @access  Public
 */
router.post('/achievements', [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('achievementId').notEmpty().withMessage('Achievement ID is required'),
  body('achievementName').notEmpty().withMessage('Achievement name is required')
], gamecontroller.awardAchievement);

module.exports = router;