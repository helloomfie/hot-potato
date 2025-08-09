# hot-potato

A gamified task management system for solar installation workflows with an interactive visual game interface.

## Overview

Hot Potato is a task management application that gamifies workflow processes through an interactive game interface. Team members can view, complete, and pass tasks ("hot potatoes") through a visual game built on HTML5 Canvas, featuring a solar installation neighborhood background with animated spirits representing different task difficulties.

## Architecture

```
hot-potato/
├── frontend/          # React.js client application
├── backend/           # Node.js API server
└── README.md         # This file
```

## Key Features

- **Visual Game Interface**: Interactive canvas-based game with background and sprite graphics
- **Task Management**: Create, assign, complete, and pass tasks between team members
- **Real-time Updates**: Live task status and team member activity
- **Gamification**: Scoring system, celebrations, and interactive elements
- **Solar Workflow**: Specialized for solar installation project management
- **Responsive Design**: Works on desktop and mobile devices

## Game Mechanics

- **Spirits**: Visual representations of tasks based on difficulty (common/rare/epic)
- **Locations**: Six workflow stages (Sales Office, New Lead, New Customer, Pre-Construction, Construction, Post Construction)
- **Interactions**: Click spirits to view task details, complete ("cook"), or pass to teammates
- **Scoring**: Earn points for completing tasks with value-based rewards

## Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hot-potato
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Game Assets

Place these image files in `frontend/public/myimages/`:
- `background.png` - Solar neighborhood background (1536×1024 recommended)
- `spirit1.png` - Common difficulty tasks
- `spirit2.png` - Rare difficulty tasks  
- `spirit3.png` - Epic difficulty tasks

## Technology Stack

- **Frontend**: React.js, HTML5 Canvas, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Data**: JSON file storage (easily replaceable with database)
- **Real-time**: RESTful API with polling

## Application Views

- **Game View**: Interactive canvas game with visual task management
- **List View**: Traditional task list with filtering and actions
- **Board View**: Kanban-style task board organized by categories
- **Leaderboard**: Team member statistics and achievements
- **Bank**: Task completion history and earnings tracking

## Team Configuration

Default team members are configured in the application:
- Ilan (Admin 1) - Game Master
- Nas (Admin 3) - Quality Queen  
- Juan (Admin 2) - Strategic Mind
- Jessie (Admin 5) - Bug Crusher
- Brandon (Admin 4) - Data Wizard

## Development Notes

- Game coordinates use percentage-based positioning for responsive design
- Spirit hover effects change size from 100px to 120px
- Canvas rendering uses high-quality image smoothing
- Modal system integrates React components with canvas interactions
- Task data structure supports category, difficulty, value, and holder properties

## API Integration

The application supports both online and offline modes:
- **Online**: Full API integration with backend services
- **Offline**: Fallback to local task data when backend unavailable

## Contributing

See individual frontend and backend README files for detailed development setup and contribution guidelines.