const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Import middleware (lowercase)
const errorhandler = require('./middleware/errorhandler');
const logger = require('./middleware/logger');

// Import routes (lowercase)
const taskroutes = require('./routes/tasks');
const userroutes = require('./routes/users');
const gameroutes = require('./routes/game');
const archiveroutes = require('./routes/archive');
const earningsroutes = require('./routes/earnings');

// Create Express app
const app = express();

// Middleware configuration
app.use(morgan('combined')); // HTTP request logging
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(logger); // Custom request logger

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'HotPotato Backend is running! 🔥',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/tasks', taskroutes);
app.use('/api/users', userroutes);
app.use('/api/game', gameroutes);
app.use('/api/archive', archiveroutes);
app.use('/api/earnings', earningsroutes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      'GET /health',
      'GET /api/tasks',
      'POST /api/tasks',
      'PUT /api/tasks/:id',
      'DELETE /api/tasks/:id',
      'POST /api/tasks/:id/pass',
      'POST /api/tasks/:id/complete',
      'GET /api/earnings/all',
      'GET /api/earnings/user/:userId',
      'GET /api/earnings/leaderboard',
      'GET /api/earnings/potential'
    ]
  });
});

// Global error handler (should be last middleware)
app.use(errorhandler);

module.exports = app;