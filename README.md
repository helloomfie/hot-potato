# 🥔 hot-potato - gamified task management

> gamified task management system where tasks heat up over time, creating urgency and team competition.

## 🎮 what is hot-potato?

a task management system that gamifies your workflow. tasks become "hot potatoes" that increase in temperature over time. team members can pass tasks, earn points, use power-ups, and compete on leaderboards.

## ✨ key features

- **🔥 temperature system**: tasks heat up over time (🫖 → ♨️ → 🌶️ → 🔥)
- **🏃‍♂️ task passing**: pass tasks between team members with combo tracking
- **⚡ power-ups**: shield, boost, and freeze abilities
- **📊 multiple views**: game, list, board (kanban), and leaderboard
- **💰 revenue tracking**: tasks have monetary value with temperature bonuses
- **🎯 achievement system**: speed runner, hot streak, epic hunter, daily player
- **🎮 mini-game**: canvas-based interactive game mode

## 🛠️ tech stack

- **react 18** with hooks
- **lucide react** for icons  
- **tailwind css** + custom styling
- **html5 canvas** for game features
- **restful api** integration with fallback to local data

## 🚀 setup

```bash
# clone and install
git clone [repository-url]
cd hot-potato-app
npm install

# configure environment
cp .env.example .env.local
# edit .env.local with your api endpoints

# start development server
npm start
# open http://localhost:3000
```

## 🎯 how to use

### creating tasks
1. click "new task" → choose emoji, title, description
2. set category, assignee, value, and time limit
3. task appears in team queue and starts heating up

### managing tasks  
- **pass**: send to teammates strategically
- **complete**: finish for points and revenue
- **power-ups**: use shield (prevents heating), boost (2x points), freeze (stops timer)

### views
- **🎮 game**: interactive canvas game
- **📋 list**: traditional task list with your tasks first
- **📊 board**: kanban columns (in progress → review → completed)
- **🏆 leaderboard**: team rankings and weekly stats

## 📁 project structure

```
src/
├── components/
│   └── executivedashboard.js    # main dashboard component
├── data/
│   └── tasks.js                 # task utilities and categories
├── services/
│   └── api.js                   # backend api integration
└── app.js                       # main app component
```

## ⚙️ configuration

### team members
edit `teamstats` object in `executivedashboard.js`:
```javascript
const teamstats = {
  username: {
    name: "name",
    avatar: "👤",
    title: "role",
    // ... other properties
  }
};
```

### categories
edit `taskcategories` in `src/data/tasks.js`:
```javascript
export const taskcategories = [
  'sales', 'new customer', 'pre-construction', 
  'construction', 'post-construction', 'customer satisfaction'
];
```

## 🎮 power-up shop
- **🛡️ shield** ($2,000): prevents temperature increase for 30s
- **⚡ boost** ($1,500): 2x points on next completion  
- **❄️ freeze** ($2,500): stops timer on hottest task for 60s

## 🔧 scripts

- `npm start` - development server
- `npm test` - run tests
- `npm run build` - production build
- `npm run eject` - eject from cra (⚠️ one-way)

---