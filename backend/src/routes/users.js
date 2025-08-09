const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Import user controller
const userController = require('../controllers/usercontroller');

// Validation middleware for user updates
const userValidation = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isIn(['ilan', 'nas', 'juan', 'jessie', 'brandon'])
    .withMessage('Invalid user ID'),
];

const userStatsValidation = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isIn(['ilan', 'nas', 'juan', 'jessie', 'brandon'])
    .withMessage('Invalid user ID'),
  
  body('level')
    .optional()
    .isNumeric()
    .withMessage('Level must be a number'),
  
  body('xp')
    .optional()
    .isNumeric()
    .withMessage('XP must be a number'),
  
  body('streak')
    .optional()
    .isNumeric()
    .withMessage('Streak must be a number'),
  
  body('status')
    .optional()
    .isIn(['active', 'break', 'offline'])
    .withMessage('Status must be active, break, or offline')
];

// Routes

/**
 * @route   GET /api/users
 * @desc    Get all users (team stats)
 * @access  Public
 */
router.get('/', userController.getAllUsers);

/**
 * @route   GET /api/users/:userId
 * @desc    Get specific user stats
 * @access  Public
 */
router.get('/:userId', userController.getUserById);

/**
 * @route   GET /api/users/:userId/stats
 * @desc    Get detailed user statistics
 * @access  Public
 */
router.get('/:userId/stats', userController.getUserStats);

/**
 * @route   PUT /api/users/:userId
 * @desc    Update user information
 * @access  Public
 */
router.put('/:userId', userStatsValidation, userController.updateUser);

/**
 * @route   PUT /api/users/:userId/status
 * @desc    Update user status (active, break, offline)
 * @access  Public
 */
router.put('/:userId/status', [
  body('status')
    .isIn(['active', 'break', 'offline'])
    .withMessage('Status must be active, break, or offline')
], userController.updateUserStatus);

/**
 * @route   POST /api/users/:userId/xp
 * @desc    Add XP to user (for task completions, etc.)
 * @access  Public
 */
router.post('/:userId/xp', [
  body('xp')
    .isNumeric()
    .withMessage('XP must be a number')
    .isFloat({ min: 0 })
    .withMessage('XP must be positive')
], userController.addUserXP);

/**
 * @route   POST /api/users/:userId/streak
 * @desc    Update user streak
 * @access  Public
 */
router.post('/:userId/streak', [
  body('increment')
    .optional()
    .isBoolean()
    .withMessage('Increment must be boolean'),
  
  body('reset')
    .optional()
    .isBoolean()
    .withMessage('Reset must be boolean')
], userController.updateUserStreak);

/**
 * @route   GET /api/users/:userId/achievements
 * @desc    Get user achievements
 * @access  Public
 */
router.get('/:userId/achievements', userController.getUserAchievements);

/**
 * @route   POST /api/users/:userId/potato-complete
 * @desc    Record potato completion for user
 * @access  Public
 */
router.post('/:userId/potato-complete', [
  body('value')
    .isNumeric()
    .withMessage('Potato value must be a number'),
  
  body('temperature')
    .optional()
    .isNumeric()
    .withMessage('Temperature must be a number')
], userController.recordPotatoCompletion);

module.exports = router;