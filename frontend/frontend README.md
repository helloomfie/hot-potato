# Frontend - Hot Potato Game

React.js client application with HTML5 Canvas game interface for task management.

## Project Structure

```
src/
├── components/              # React components
│   ├── errorboundary.js    # Error handling wrapper
│   ├── gameview.js         # Canvas game container
│   ├── header.js           # App header with stats
│   ├── hotpotatocard.js    # Task card component
│   ├── listview.js         # Task list view
│   ├── modals.js           # Modal dialogs (pass/completion)
│   └── navigationtabs.js   # View navigation
├── data/
│   └── archive.js          # Task archiving utilities
├── services/
│   └── api.js              # Backend API integration
├── app.js                  # Main application component
├── game.js                 # Canvas game logic (CORE)
├── bank.js                 # Earnings tracking view
├── boardview.js            # Kanban board view
├── leaderboard.js          # Team statistics view
├── index.js                # React app entry point
├── index.css               # Global styles
└── app.css                 # Component styles
```

## Core Game Engine (game.js)

The main game logic handles:

### Canvas Setup
- 800x400 canvas with high-quality rendering
- Percentage-based coordinate system for responsive design
- Background image scaling and smoothing

### Location System
```javascript
[
  { name: "Sales Office", x: 20.8, y: 76.2, category: "Sales" },
  { name: "New Lead", x: 20.2, y: 39.1, category: "New Lead" },
  { name: "New Customer", x: 42.0, y: 26.0, category: "New Customer" },
  { name: "Pre-Construction", x: 69.0, y: 24.4, category: "Pre-Construction" },
  { name: "Construction", x: 71.6, y: 65.4, category: "Construction" },
  { name: "Post Construction", x: 86.6, y: 77.1, category: "Post Construction" }
]
```

### Spirit System
- **Dynamic Generation**: Spirits appear only where tasks exist
- **Difficulty Mapping**: common=spirit1.png, rare=spirit2.png, epic=spirit3.png
- **Interactive**: 100px normal, 120px on hover
- **High-Quality**: Image smoothing enabled for crisp rendering

### Event Handling
- Mouse hover detection with 40px radius
- Click handling for spirit interactions
- Cursor changes (pointer on hover)
- Integration with React modal system

## Key Components

### GameView (components/gameview.js)
- Canvas container component
- Start/stop game controls
- Score and level display
- Clean interface (no instruction bars)

### Modals (components/modals.js)
- Task completion celebration
- Team member selection for passing tasks
- Styled with project color scheme (#002C54, #66B2FF)

### App (app.js)
- Main state management
- API integration with fallback to local data
- Timer system for task temperature updates
- Game instance lifecycle management

## Image Assets

Required files in `public/myimages/`:
- `background.png` - Solar neighborhood scene
- `spirit1.png` - Common difficulty sprite with red circle
- `spirit2.png` - Rare difficulty sprite with red circle
- `spirit3.png` - Epic difficulty sprite with red circle

## Styling

- **Framework**: Tailwind CSS
- **Colors**: Blue gradient theme (#66B2FF to #002C54)
- **Typography**: Montserrat font family
- **Responsive**: Mobile-first design approach

## State Management

### Game State
```javascript
{
  score: number,
  level: number,
  isPlaying: boolean
}
```

### Team Stats
```javascript
{
  [userId]: {
    name: string,
    avatar: string,
    title: string,
    status: 'active' | 'break',
    level: number,
    xp: number,
    potatoesCompleted: number,
    streak: number,
    speciality: string
  }
}
```

## API Integration

### Online Mode
- Full backend connectivity
- Real-time task updates
- Error handling with user feedback

### Offline Mode
- Fallback to local task data from data/tasks.js
- Limited functionality notification
- Graceful degradation

## Development Setup

```bash
npm install
npm start
```

### Environment
- React 18+
- Modern JavaScript (ES6+)
- HTML5 Canvas API
- Tailwind CSS

## Game Coordinates

Coordinate system uses percentages for responsive design:
- Origin: Top-left (0,0)
- X-axis: 0-100% (left to right)
- Y-axis: 0-100% (top to bottom)
- Spirit positioning: Calculated from location percentages

## Performance Optimizations

- Canvas rendering with requestAnimationFrame
- Image preloading and caching
- High-quality image smoothing
- Efficient event handling
- Component-based React architecture

## Integration Points

- **onTaskClick**: Triggers React modal for task passing
- **onTaskComplete**: Handles task completion and celebration
- **updateScore**: Game scoring integration
- **hotPotatoes**: Live task data from parent component

## Debugging

- Console logging for image load status
- Error boundaries for component failures
- API connection status indicators
- Fallback rendering for missing assets