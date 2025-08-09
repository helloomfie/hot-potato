const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Import controller (lowercase)
const taskcontroller = require('../controllers/taskcontroller');

// Validation middleware
const taskValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  
  body('category')
    .isIn(['Sales', 'New Lead', 'New Customer', 'Pre-Construction', 'Construction', 'Post Construction'])
    .withMessage('Invalid category'),
  
  body('difficulty')
    .optional()
    .isIn(['common', 'rare', 'epic'])
    .withMessage('Difficulty must be common, rare, or epic'),
  
  body('value')
    .isNumeric()
    .withMessage('Value must be a number')
    .isFloat({ min: 100, max: 50000 })
    .withMessage('Value must be between 100 and 50000'),
  
  body('holder')
    .notEmpty()
    .withMessage('Holder is required')
    .isIn(['ilan', 'nas', 'juan', 'jessie', 'brandon'])
    .withMessage('Invalid holder'),
  
  body('timeLeft')
    .optional()
    .isNumeric()
    .withMessage('TimeLeft must be a number')
];

const passValidation = [
  body('toUser')
    .notEmpty()
    .withMessage('toUser is required')
    .isIn(['ilan', 'nas', 'juan', 'jessie', 'brandon'])
    .withMessage('Invalid toUser'),
  
  body('fromUser')
    .notEmpty()
    .withMessage('fromUser is required')
    .isIn(['ilan', 'nas', 'juan', 'jessie', 'brandon'])
    .withMessage('Invalid fromUser')
];

const completeValidation = [
  body('completedBy')
    .notEmpty()
    .withMessage('completedBy is required')
    .isIn(['ilan', 'nas', 'juan', 'jessie', 'brandon'])
    .withMessage('Invalid completedBy'),
  
  body('earnedValue')
    .optional()
    .isNumeric()
    .withMessage('earnedValue must be a number')
];

// Routes

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks
 * @access  Public
 */
router.get('/', taskcontroller.getAllTasks);

/**
 * @route   GET /api/tasks/user/:userId
 * @desc    Get tasks by user
 * @access  Public
 */
router.get('/user/:userId', taskcontroller.getTasksByUser);

/**
 * @route   GET /api/tasks/category/:category
 * @desc    Get tasks by category
 * @access  Public
 */
router.get('/category/:category', taskcontroller.getTasksByCategory);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get task by ID
 * @access  Public
 */
router.get('/:id', taskcontroller.getTaskById);

/**
 * @route   POST /api/tasks
 * @desc    Create new task
 * @access  Public
 */
router.post('/', taskValidation, taskcontroller.createTask);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update task
 * @access  Public
 */
router.put('/:id', taskcontroller.updateTask);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete task
 * @access  Public
 */
router.delete('/:id', taskcontroller.deleteTask);

/**
 * @route   POST /api/tasks/:id/pass
 * @desc    Pass task to another user
 * @access  Public
 */
router.post('/:id/pass', passValidation, taskcontroller.passTask);

/**
 * @route   POST /api/tasks/:id/complete
 * @desc    Complete task
 * @access  Public
 */
router.post('/:id/complete', completeValidation, taskcontroller.completeTask);

module.exports = router;