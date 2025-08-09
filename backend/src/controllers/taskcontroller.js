const taskservice = require('../services/taskservice');
const { validationResult } = require('express-validator');

/**
 * Get all tasks
 * GET /api/tasks
 */
const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await taskservice.getAllTasks();
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get task by ID
 * GET /api/tasks/:id
 */
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await taskservice.getTaskById(id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new task
 * POST /api/tasks
 */
const createTask = async (req, res, next) => {
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

    const taskData = req.body;
    const newTask = await taskservice.createTask(taskData);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update task
 * PUT /api/tasks/:id
 */
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedTask = await taskservice.updateTask(id, updateData);
    
    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete task
 * DELETE /api/tasks/:id
 */
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await taskservice.deleteTask(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Pass task to another user
 * POST /api/tasks/:id/pass
 */
const passTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { toUser, fromUser } = req.body;

    if (!toUser || !fromUser) {
      return res.status(400).json({
        success: false,
        message: 'toUser and fromUser are required'
      });
    }

    const updatedTask = await taskservice.passTask(id, fromUser, toUser);
    
    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: `Task passed from ${fromUser} to ${toUser}`,
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Complete task
 * POST /api/tasks/:id/complete
 */
const completeTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { completedBy, earnedValue } = req.body;

    if (!completedBy) {
      return res.status(400).json({
        success: false,
        message: 'completedBy is required'
      });
    }

    const result = await taskservice.completeTask(id, completedBy, earnedValue);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task completed successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get tasks by user
 * GET /api/tasks/user/:userId
 */
const getTasksByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const tasks = await taskservice.getTasksByUser(userId);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get tasks by category
 * GET /api/tasks/category/:category
 */
const getTasksByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const tasks = await taskservice.getTasksByCategory(category);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  passTask,
  completeTask,
  getTasksByUser,
  getTasksByCategory
};