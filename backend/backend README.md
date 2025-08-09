# Backend - Hot Potato API

Node.js Express API server for task management system with game integration.

## Project Structure

```
src/
├── controllers/             # Request handlers
│   ├── archivecontroller.js # Task completion history
│   ├── earningscontroller.js # User earnings tracking
│   ├── gamecontroller.js    # Game state management
│   ├── taskcontroller.js    # Task CRUD operations
│   └── usercontroller.js    # User management
├── middleware/
│   ├── errorhandler.js      # Global error handling
│   └── logger.js            # Request logging
├── routes/                  # API route definitions
│   ├── archive.js           # /api/archive routes
│   ├── earnings.js          # /api/earnings routes
│   ├── game.js              # /api/game routes
│   ├── tasks.js             # /api/tasks routes
│   └── users.js             # /api/users routes
├── services/                # Business logic layer
│   ├── archiveservice.js    # Archive operations
│   ├── earningsservice.js   # Earnings calculations
│   ├── gameservice.js       # Game logic
│   ├── taskservice.js       # Task operations
│   └── userservice.js       # User operations
└── app.js                   # Express app configuration
data/
├── archive.json             # Completed task history
└── tasks.json               # Active task storage
server.js                    # Application entry point
```

## API Endpoints

### Tasks API (/api/tasks)
```
GET    /api/tasks           # Get all active tasks
POST   /api/tasks           # Create new task
GET    /api/tasks/:id       # Get specific task
PUT    /api/tasks/:id       # Update task
DELETE /api/tasks/:id       # Delete/complete task
```

### Archive API (/api/archive)
```
GET    /api/archive         # Get completed task history
POST   /api/archive         # Archive completed task
GET    /api/archive/:id     # Get specific archived task
```

### Users API (/api/users)
```
GET    /api/users           # Get all users
GET    /api/users/:id       # Get specific user
PUT    /api/users/:id       # Update user stats
```

### Game API (/api/game)
```
GET    /api/game/state      # Get current game state
POST   /api/game/score      # Update game score
GET    /api/game/stats      # Get game statistics
```

### Earnings API (/api/earnings)
```
GET    /api/earnings        # Get earnings summary
GET    /api/earnings/:userId # Get user earnings
POST   /api/earnings        # Record new earnings
```

## Data Models

### Task Schema
```javascript
{
  id: string,                    # Unique identifier
  title: string,                 # Task title with emoji
  description: string,           # Detailed description
  category: string,              # Workflow stage
  difficulty: 'common'|'rare'|'epic', # Task complexity
  value: number,                 # Point/monetary value
  holder: string,                # Current assignee ID
  temperature: number,           # Urgency indicator (0-100)
  timeLeft: number,              # Seconds remaining
  passCount: number,             # Times passed between users
  lastPasser: string,            # Previous holder ID
  combo: number,                 # Consecutive passes to same user
  createdAt: string,             # ISO timestamp
  updatedAt: string              # ISO timestamp
}
```

### Archive Entry Schema
```javascript
{
  taskId: string,                # Original task ID
  completedBy: string,           # User who completed
  completedAt: string,           # ISO timestamp
  earnedValue: number,           # Points/money earned
  originalTask: object,          # Full task data snapshot
  completionTime: number,        # Time taken to complete
  bonusMultiplier: number        # Temperature-based bonus
}
```

### User Schema
```javascript
{
  id: string,                    # User identifier
  name: string,                  # Display name
  avatar: string,                # Emoji avatar
  title: string,                 # Job title
  status: 'active'|'break',      # Availability
  level: number,                 # Game level
  xp: number,                    # Experience points
  potatoesCompleted: number,     # Tasks completed
  streak: number,                # Current completion streak
  speciality: string,            # Area of expertise
  totalEarnings: number,         # Lifetime earnings
  lastActive: string             # ISO timestamp
}
```

## Game Integration

### Task Temperature System
- **Automatic Increment**: +0.1 per second
- **Pass Penalty**: +5 per pass
- **Bonus Threshold**: >80 temperature = 1.5x value multiplier
- **Visual Indicators**: Affects spirit display in game

### Difficulty Mapping
- **Common**: Basic tasks, spirit1.png representation
- **Rare**: Moderate complexity, spirit2.png representation  
- **Epic**: High-value tasks, spirit3.png representation

### Scoring System
- **Base Score**: Task value / 10
- **Temperature Bonus**: 1.5x multiplier for hot tasks (>80°)
- **Streak Bonuses**: Consecutive completions
- **Pass Penalties**: Reduced value after multiple passes

## Data Storage

### File-Based Storage
- **tasks.json**: Active task database
- **archive.json**: Completed task history
- **Atomic Writes**: Prevent data corruption
- **Backup Strategy**: Timestamped backups on write

### Migration Ready
- Service layer abstraction for easy database integration
- Consistent data access patterns
- Schema validation ready

## Error Handling

### Global Error Middleware
```javascript
// Centralized error handling
app.use(errorHandler);

// Error response format
{
  success: false,
  error: {
    message: string,
    code: string,
    details: object
  }
}
```

### API Response Format
```javascript
// Success responses
{
  success: true,
  data: object|array,
  message?: string
}

// Error responses  
{
  success: false,
  error: {
    message: string,
    code: string
  }
}
```

## Middleware Stack

1. **CORS**: Cross-origin resource sharing
2. **JSON Parser**: Request body parsing
3. **Logger**: Request/response logging
4. **Routes**: API endpoint routing
5. **Error Handler**: Global error management

## Development Setup

```bash
npm install
npm start              # Production mode
npm run dev           # Development with nodemon
```

### Environment Variables
```
PORT=5000             # Server port
NODE_ENV=development  # Environment mode
DATA_PATH=./data      # Data file location
```

## Testing

### API Testing
```bash
# Get all tasks
curl http://localhost:5000/api/tasks

# Create task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","category":"Sales","difficulty":"common"}'

# Update task
curl -X PUT http://localhost:5000/api/tasks/task-id \
  -H "Content-Type: application/json" \
  -d '{"holder":"user-id"}'
```

## Performance Considerations

- **File I/O**: Asynchronous operations
- **Memory Usage**: Efficient JSON parsing
- **Concurrent Access**: File locking for writes
- **Response Times**: Optimized data queries

## Security Features

- **Input Validation**: Request data sanitization
- **Error Masking**: Production error messages
- **CORS Configuration**: Controlled client access
- **Rate Limiting**: Ready for implementation

## Monitoring

- **Request Logging**: All API calls logged
- **Error Tracking**: Detailed error information
- **Performance Metrics**: Response time tracking
- **Health Checks**: API availability monitoring

## Integration Points

- **Frontend API Client**: services/api.js integration
- **Real-time Updates**: Polling-based synchronization
- **Offline Fallback**: Graceful degradation support
- **Game State Sync**: Live game data updates