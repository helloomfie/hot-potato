# 🥔 hot-potato - your usual task management tool with gaming elements

> common task management enhanced with gaming mechanics for better engagement and data visualization.

## 🎯 what is hot-potato?

hot-potato is **your usual task management tool** (like any todo list) but with gaming elements layered on top. the core is still about managing your everyday tasks, but we've added game mechanics to make it more engaging and provide better ways to visualize your data.

**the concept**: your common task list gets enhanced with:
- visual game representations of your actual work data
- gamification to make boring task management more engaging  
- real-time sync between traditional list view and interactive game view
- better data visualization through game mechanics

## 🔄 how list + game sync works

**your task data lives in one place** and gets displayed in multiple ways:

- **📋 list view**: traditional task management (assign, complete, track)
- **🎮 game view**: same data visualized as an interactive game
- **📊 board view**: same data in kanban format
- **🏆 leaderboard**: same data shown as team competition

when you complete a task in the list → it immediately updates in the game  
when you interact in the game → it affects your real task data

## ✨ gaming enhancements to regular tasks

### temperature system
- tasks naturally "heat up" over time to create urgency
- visual indicators show priority (🫖 → ♨️ → 🌶️ → 🔥)
- hotter tasks = higher rewards when completed

### task passing mechanics  
- pass tasks between team members like a real "hot potato"
- builds collaboration and prevents bottlenecks
- tracks who passed what and combo streaks

### points & rewards
- earn points and revenue for completing tasks
- temperature bonuses for urgent completions
- power-ups that affect real task behavior

### achievements & progression
- unlock rewards based on real work patterns
- daily streaks, speed completion, team collaboration
- gamified stats that reflect actual productivity

## 🛠️ tech stack

- **react 18** with hooks for ui
- **html5 canvas** for game visualization  
- **lucide react** for icons
- **tailwind css** for styling
- **restful api** for data persistence

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

## 📋 using the task management

### basic task workflow (like any common task manager)
1. **create**: click "new task" → set title, description, assignee, deadline
2. **assign**: pick team member and category  
3. **track**: monitor progress and updates
4. **complete**: mark done when finished

### enhanced with gaming
- **visual priority**: tasks get "hotter" over time 
- **team collaboration**: pass tasks strategically between members
- **immediate feedback**: points, streaks, and achievements for motivation
- **data visualization**: see your work data as an interactive game

## 📊 different views of same data

- **📋 list**: classic task list with gaming elements overlaid
- **🎮 game**: interactive canvas showing your tasks as game elements  
- **📊 board**: kanban view (in progress → review → completed)
- **🏆 leaderboard**: team stats and competition based on real work

## ⚙️ configuration

### team setup
edit team members in `executivedashboard.js`:
```javascript
const teamstats = {
  member1: {
    name: "team member name",
    avatar: "👤", 
    title: "role"
  }
};
```

### task categories
edit categories in `src/data/tasks.js`:
```javascript
export const taskcategories = [
  'sales', 'new customer', 'construction', 
  'post-construction', 'customer satisfaction'
];
```

## 🎮 game features enhance real work

- **🛡️ shield**: protects tasks from heating up (real deadline extension)
- **⚡ boost**: double points for next completion (motivation)
- **❄️ freeze**: stops task timer (pause deadline pressure)

## 🔧 scripts

- `npm start` - development server
- `npm test` - run tests  
- `npm run build` - production build

---

**sunlab internal tool** - make your usual task management actually engaging! 🔥