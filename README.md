# HOT-POTATO - TASK MANAGEMENT WITH GAMING ELEMENTS

Common task management enhanced with gaming mechanics for better engagement and data visualization.

## ARCHITECTURE OVERVIEW

```mermaid
flowchart TD
    %% User Interface Layer
    A[User Interface<br/>React SPA] --> B[ExecutiveDashboard.js<br/>Main Component<br/>State Orchestrator]
    
    %% Main Views - All use same data
    B --> C[List View<br/>Traditional Task Manager<br/>HotPotatoCard Components]
    B --> D[Game View<br/>HTML5 Canvas<br/>Interactive Visualization]
    B --> E[Board View<br/>Kanban Style<br/>Drag & Drop Cards]
    B --> F[Leaderboard View<br/>Team Competition<br/>Performance Stats]
    
    %% Core State Management
    B --> G[React State Hooks<br/>useState/useEffect<br/>Real-time Updates]
    G --> H[hotPotatoes State<br/>Task Array<br/>Temperature System]
    G --> I[teamStats State<br/>User Profiles<br/>Avatars & Levels]
    G --> J[powerUps State<br/>Shield/Boost/Freeze<br/>Game Mechanics]
    G --> K[gameState<br/>Score/Level<br/>Playing Status]
    
    %% API Communication Layer
    B --> L[services/api.js<br/>REST API Client<br/>Error Handling]
    L --> M[getAllTasks<br/>Fetch All Tasks<br/>GET /tasks]
    L --> N[createTask<br/>Add New Task<br/>POST /tasks]
    L --> O[updateTask<br/>Modify Existing<br/>PUT /tasks/:id]
    L --> P[deleteTask<br/>Remove Task<br/>DELETE /tasks/:id]
    L --> Q[handleAPIError<br/>Error Classification<br/>Fallback Logic]
    L --> R[checkConnection<br/>Health Check<br/>Connection Status]
    
    %% Backend Server
    M --> S[Backend Server<br/>RESTful API<br/>Database Storage]
    N --> S
    O --> S
    P --> S
    R --> S
    
    %% Game Engine Core
    D --> T[Game.js<br/>HTML5 Canvas Engine<br/>Animation Loop]
    T --> U[Canvas Rendering<br/>Sprite Drawing<br/>Background Images]
    T --> V[Player Interactions<br/>Click Events<br/>Task Selection]
    T --> W[Task Visualization<br/>Red Circles<br/>Temperature Display]
    T --> X[Spirit Characters<br/>Team Avatars<br/>Location Markers]
    
    %% Data Processing Utilities
    B --> Y[data/tasks.js<br/>Task Utilities<br/>Business Logic]
    Y --> Z[createNewTask<br/>Task Factory<br/>ID Generation]
    Y --> AA[sortTasksByPriority<br/>User Tasks First<br/>Temperature Sort]
    Y --> BB[taskCategories<br/>Sales/Construction<br/>Category System]
    Y --> CC[initialTasks<br/>Demo Data<br/>Offline Fallback]
    
    %% Archive System
    B --> DD[data/archive.js<br/>Completed Tasks<br/>Historical Data]
    DD --> EE[archiveTask<br/>Store Completion<br/>Earned Value]
    
    %% Static Assets
    B --> FF[myimages/<br/>Static Assets<br/>Image Resources]
    FF --> GG[firstlogo.png<br/>App Branding<br/>SUNLAB Logo]
    FF --> HH[background.png<br/>Game Background<br/>Canvas Asset]
    
    %% Offline Support System
    L --> II[Offline Fallback<br/>Local Operation<br/>Connection Loss]
    II --> CC
    II --> JJ[Local State<br/>Memory Storage<br/>No Persistence]
    
    %% Real-time Timer System
    G --> KK[Timer System<br/>setInterval<br/>1 Second Updates]
    KK --> LL[Temperature Updates<br/>Task Heating<br/>Urgency System]
    KK --> MM[Power-up Expiration<br/>Timed Effects<br/>Auto Disable]
    KK --> NN[Game Clock<br/>Real-time Display<br/>Current Time]
    
    %% Modal System
    B --> OO[Pass Task Modal<br/>Team Selection<br/>Task Transfer]
    B --> PP[Create Task Modal<br/>Form Interface<br/>Emoji Selection]
    B --> QQ[Shop Modal<br/>Power-up Purchase<br/>Revenue System]
    
    %% Game-Task Integration
    T --> RR[handleCompletePotato<br/>Task Completion<br/>Points Calculation]
    T --> SS[Task Selection<br/>Spirit Click<br/>Modal Trigger]
    RR --> L
    SS --> OO
    
    %% Styling System
    B --> TT[Tailwind CSS<br/>Utility Classes<br/>Responsive Design]
    B --> UU[Dynamic Styles<br/>Inline Styles<br/>Category Colors]
    
    %% Error Handling & Status
    L --> VV[Connection Status<br/>Online/Offline<br/>Error Display]
    L --> WW[Error Notifications<br/>User Feedback<br/>Recovery Options]
    
    %% Achievement System
    G --> XX[Achievement Stats<br/>Streaks & Progress<br/>Unlockable Rewards]
    XX --> YY[Speed Runner<br/>Fast Completion<br/>Boost Rewards]
    XX --> ZZ[Pass Streak<br/>Team Collaboration<br/>Shield Rewards]
    XX --> AAA[Epic Hunter<br/>High Value Tasks<br/>Freeze Rewards]
    
    style A fill:#e1f5fe,stroke:#01579b,stroke-width:3px
    style S fill:#ffcdd2,stroke:#c62828,stroke-width:3px
    style T fill:#f3e5f5,stroke:#6a1b9a,stroke-width:3px
    style L fill:#fff3e0,stroke:#e65100,stroke-width:3px
    style G fill:#e8f5e8,stroke:#2e7d32,stroke-width:3px
    style FF fill:#fce4ec,stroke:#c2185b,stroke-width:3px