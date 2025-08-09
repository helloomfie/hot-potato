const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 8000; // Changed to port 8000 to avoid conflicts
const TASKS_FILE = path.join(__dirname, 'data', 'tasks.json');

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data directory exists
const ensureDataDir = async () => {
  try {
    await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
  } catch (error) {
    console.log('Data directory already exists');
  }
};

// Load tasks from file
const loadTasks = async () => {
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return initial tasks from your tasks.js
    const initialTasks = [
      {
        id: 'potato-1',
        title: "📞 Call New Lead",
        description: "Call New Lead - Customer in Nassau County - Referred by Edison",
        holder: "nas",
        temperature: 85,
        passCount: 1,
        value: 1500,
        timeLeft: 90,
        difficulty: "rare",
        combo: 0,
        lastPasser: null,
        tags: ["sales", "new-lead", "nassau"],
        category: "Sales"
      },
      {
        id: 'potato-2',
        title: "📝 Write Notes on New Lead",
        description: "Lead Notes - 2,200 sqft Home - $210/month PSEG Long Island - South-facing Roof",
        holder: "nas",
        temperature: 70,
        passCount: 0,
        value: 800,
        timeLeft: 60,
        difficulty: "common",
        combo: 0,
        lastPasser: null,
        tags: ["sales", "notes", "pge"],
        category: "Sales"
      },
      {
        id: 'potato-3',
        title: "📅 Schedule Sales Appointment",
        description: "Book Sales Call - Thursday @ 3PM via Zoom - Sent Calendar Invite to Customer",
        holder: "nas",
        temperature: 90,
        passCount: 2,
        value: 1200,
        timeLeft: 45,
        difficulty: "rare",
        combo: 1,
        lastPasser: "ilan",
        tags: ["sales", "appointment", "zoom"],
        category: "Sales"
      },
      {
        id: 'potato-4',
        title: "📊 Complete Solar Design",
        description: "Design - 7.2kW System - 18 Panels - South-Facing Roof - Good Sun Access",
        holder: "brandon",
        temperature: 75,
        passCount: 1,
        value: 2200,
        timeLeft: 180,
        difficulty: "epic",
        combo: 0,
        lastPasser: "nas",
        tags: ["sales", "design", "7.2kw"],
        category: "Sales"
      },
      {
        id: 'potato-5',
        title: "💰 Complete Solar Quote",
        description: "Quote - 7.2kW System - Cash Option + 25-Year Loan - $0 Down",
        holder: "ilan",
        temperature: 80,
        passCount: 1,
        value: 1800,
        timeLeft: 120,
        difficulty: "rare",
        combo: 0,
        lastPasser: "brandon",
        tags: ["sales", "quote", "financing"],
        category: "Sales"
      },
      {
        id: 'potato-6',
        title: "📋 Deliver Solar Design",
        description: "Proposal Delivered - Sent PDF + Zoom Walkthrough - Awaiting Customer Response",
        holder: "ilan",
        temperature: 95,
        passCount: 3,
        value: 2500,
        timeLeft: 30,
        difficulty: "epic",
        combo: 2,
        lastPasser: "nas",
        tags: ["sales", "proposal", "urgent"],
        category: "Sales"
      },
      {
        id: 'potato-7',
        title: "📋 New Trello Customer",
        description: "Create Trello Card - New Project - Add Customer Info + Checklist",
        holder: "nas",
        temperature: 65,
        passCount: 0,
        value: 600,
        timeLeft: 90,
        difficulty: "common",
        combo: 0,
        lastPasser: null,
        tags: ["customer-intake", "trello", "setup"],
        category: "New Customer"
      },
      {
        id: 'potato-8',
        title: "📄 Request New Plans",
        description: "Requested Drafting - Sent Site Data to Drafter - Awaiting Plan Set",
        holder: "ilan",
        temperature: 70,
        passCount: 1,
        value: 1000,
        timeLeft: 240,
        difficulty: "rare",
        combo: 0,
        lastPasser: "nas",
        tags: ["customer-intake", "plans", "drafting"],
        category: "New Customer"
      }
      // Add more tasks here or copy from your tasks.js
    ];
    
    await saveTasks(initialTasks);
    return initialTasks;
  }
};

// Save tasks to file
const saveTasks = async (tasks) => {
  try {
    await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
    console.log(`✅ Tasks saved to ${TASKS_FILE}`);
  } catch (error) {
    console.error('❌ Error saving tasks:', error);
    throw error;
  }
};

// Routes

app.get('/', (req, res) => {
  res.json({
    message: '🔥 Welcome to Hot Potato API!',
    endpoints: {
      'GET /api/health': 'Health check endpoint',
      'GET /api/tasks': 'Get all tasks',
      'POST /api/tasks': 'Create a new task',
      'PUT /api/tasks/:id': 'Update a task',
      'DELETE /api/tasks/:id': 'Delete a task'
    },
    status: 'Server is running! 🚀'
  });
});

// Health check endpoint for connection testing
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Hot Potato API is healthy! 🔥'
  });
});

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await loadTasks();
    console.log(`📋 Loaded ${tasks.length} tasks`);
    res.json(tasks);
  } catch (error) {
    console.error('❌ Error loading tasks:', error);
    res.status(500).json({ error: 'Failed to load tasks' });
  }
});

// POST new task
app.post('/api/tasks', async (req, res) => {
  try {
    const tasks = await loadTasks();
    const newTask = {
      ...req.body,
      id: `potato-${Date.now()}`,
      temperature: Math.floor(Math.random() * 40) + 30,
      passCount: 0,
      combo: 0,
      lastPasser: null,
      tags: [req.body.category.toLowerCase().replace(' ', '-'), "new"]
    };
    
    tasks.push(newTask);
    await saveTasks(tasks);
    console.log(`➕ Created new task: ${newTask.title}`);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('❌ Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT update task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const tasks = await loadTasks();
    const taskIndex = tasks.findIndex(task => task.id === req.params.id);
    
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
    await saveTasks(tasks);
    console.log(`✏️ Updated task: ${tasks[taskIndex].title}`);
    res.json(tasks[taskIndex]);
  } catch (error) {
    console.error('❌ Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const tasks = await loadTasks();
    const taskToDelete = tasks.find(task => task.id === req.params.id);
    const filteredTasks = tasks.filter(task => task.id !== req.params.id);
    
    if (filteredTasks.length === tasks.length) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    await saveTasks(filteredTasks);
    console.log(`🗑️ Deleted task: ${taskToDelete.title}`);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Start server
const startServer = async () => {
  await ensureDataDir();
  app.listen(PORT, () => {
    console.log(`🔥 Hot Potato Server running on http://localhost:${PORT}`);
    console.log(`📝 Tasks will be saved to: ${TASKS_FILE}`);
    console.log(`🌐 API available at: http://localhost:${PORT}/api/tasks`);
    console.log(`💚 Health check at: http://localhost:${PORT}/api/health`);
  });
};

startServer();