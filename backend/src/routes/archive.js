const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');

// Import controller (lowercase)
const archivecontroller = require('../controllers/archivecontroller');

// Validation middleware
const archiveValidation = [
  body('taskId')
    .notEmpty()
    .withMessage('Task ID is required'),
  
  body('completedBy')
    .notEmpty()
    .withMessage('Completed by is required')
    .isIn(['ilan', 'nas', 'juan', 'jessie', 'brandon'])
    .withMessage('Invalid user'),
  
  body('earnedValue')
    .optional()
    .isNumeric()
    .withMessage('Earned value must be a number')
];

const reportValidation = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be valid ISO date'),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be valid ISO date'),
  
  query('userId')
    .optional()
    .isIn(['ilan', 'nas', 'juan', 'jessie', 'brandon'])
    .withMessage('Invalid user ID'),
  
  query('category')
    .optional()
    .isIn(['Sales', 'New Lead', 'New Customer', 'Pre-Construction', 'Construction', 'Post Construction'])
    .withMessage('Invalid category')
];

// Routes

/**
 * @route   GET /api/archive
 * @desc    Get all archived tasks
 * @access  Public
 */
router.get('/', archivecontroller.getAllArchivedTasks);

/**
 * @route   GET /api/archive/stats
 * @desc    Get archive statistics
 * @access  Public
 */
router.get('/stats', archivecontroller.getArchiveStats);

/**
 * @route   GET /api/archive/report
 * @desc    Get archive report with filters
 * @access  Public
 */
router.get('/report', reportValidation, archivecontroller.getArchiveReport);

/**
 * @route   GET /api/archive/user/:userId
 * @desc    Get archived tasks by user
 * @access  Public
 */
router.get('/user/:userId', archivecontroller.getArchivedTasksByUser);

/**
 * @route   GET /api/archive/category/:category
 * @desc    Get archived tasks by category
 * @access  Public
 */
router.get('/category/:category', archivecontroller.getArchivedTasksByCategory);

/**
 * @route   GET /api/archive/:id
 * @desc    Get archived task by ID
 * @access  Public
 */
router.get('/:id', archivecontroller.getArchivedTaskById);

/**
 * @route   POST /api/archive
 * @desc    Archive a completed task
 * @access  Public
 */
router.post('/', archiveValidation, archivecontroller.archiveTask);

/**
 * @route   DELETE /api/archive/:id
 * @desc    Delete archived task (admin only)
 * @access  Public
 */
router.delete('/:id', archivecontroller.deleteArchivedTask);

/**
 * @route   GET /api/archive/export/csv
 * @desc    Export archive data as CSV
 * @access  Public
 */
router.get('/export/csv', archivecontroller.exportToCSV);

module.exports = router;