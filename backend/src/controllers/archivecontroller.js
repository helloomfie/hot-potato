const archiveservice = require('../services/archiveservice');
const { validationResult } = require('express-validator');

/**
 * Get all archived tasks
 * GET /api/archive
 */
const getAllArchivedTasks = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, sortBy = 'completedAt', sortOrder = 'desc' } = req.query;
    const result = await archiveservice.getAllArchivedTasks(
      parseInt(page), 
      parseInt(limit), 
      sortBy, 
      sortOrder
    );

    res.status(200).json({
      success: true,
      count: result.data.length,
      totalCount: result.total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(result.total / parseInt(limit)),
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get archived task by ID
 * GET /api/archive/:id
 */
const getArchivedTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await archiveservice.getArchivedTaskById(id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Archived task with ID ${id} not found`
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
 * Archive a completed task
 * POST /api/archive
 */
const archiveTask = async (req, res, next) => {
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

    const archiveData = req.body;
    const archivedTask = await archiveservice.archiveTask(archiveData);

    res.status(201).json({
      success: true,
      message: 'Task archived successfully',
      data: archivedTask
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get archived tasks by user
 * GET /api/archive/user/:userId
 */
const getArchivedTasksByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const result = await archiveservice.getArchivedTasksByUser(
      userId, 
      parseInt(page), 
      parseInt(limit)
    );

    res.status(200).json({
      success: true,
      count: result.data.length,
      totalCount: result.total,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get archived tasks by category
 * GET /api/archive/category/:category
 */
const getArchivedTasksByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const result = await archiveservice.getArchivedTasksByCategory(
      category, 
      parseInt(page), 
      parseInt(limit)
    );

    res.status(200).json({
      success: true,
      count: result.data.length,
      totalCount: result.total,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get archive statistics
 * GET /api/archive/stats
 */
const getArchiveStats = async (req, res, next) => {
  try {
    const stats = await archiveservice.getArchiveStats();

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get archive report with filters
 * GET /api/archive/report
 */
const getArchiveReport = async (req, res, next) => {
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

    const filters = req.query;
    const report = await archiveservice.getArchiveReport(filters);

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete archived task
 * DELETE /api/archive/:id
 */
const deleteArchivedTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await archiveservice.deleteArchivedTask(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Archived task with ID ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Archived task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Export archive data as CSV
 * GET /api/archive/export/csv
 */
const exportToCSV = async (req, res, next) => {
  try {
    const filters = req.query;
    const csvData = await archiveservice.exportToCSV(filters);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="archive-${new Date().toISOString().split('T')[0]}.csv"`);
    
    res.status(200).send(csvData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllArchivedTasks,
  getArchivedTaskById,
  archiveTask,
  getArchivedTasksByUser,
  getArchivedTasksByCategory,
  getArchiveStats,
  getArchiveReport,
  deleteArchivedTask,
  exportToCSV
};