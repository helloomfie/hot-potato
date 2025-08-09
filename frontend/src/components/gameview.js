import React, { useEffect } from 'react';

const GameView = ({ gameState, startGame, endGame, hotPotatoes, currentUser }) => {
  const teamStats = {
    ilan: { name: "Ilan", avatar: "👨‍💻", title: "Admin 1", status: "active", level: 12, xp: 2847, potatoesCompleted: 23, streak: 7, speciality: "Game Master", balance: 15420 },
    nas: { name: "Nas", avatar: "👩‍🎨", title: "Admin 3", status: "active", level: 15, xp: 3421, potatoesCompleted: 31, streak: 12, speciality: "Quality Queen", balance: 22340 },
    juan: { name: "Juan", avatar: "👨‍💼", title: "Admin 2", status: "break", level: 10, xp: 2156, potatoesCompleted: 18, streak: 4, speciality: "Strategic Mind", balance: 12890 },
    jessie: { name: "Jessie", avatar: "👩‍💻", title: "Admin 5", status: "active", level: 11, xp: 2654, potatoesCompleted: 20, streak: 9, speciality: "Bug Crusher", balance: 16750 },
    brandon: { name: "Brandon", avatar: "👨‍🔬", title: "Admin 4", status: "active", level: 13, xp: 2983, potatoesCompleted: 25, streak: 6, speciality: "Data Wizard", balance: 18920 }
  };

  const currentUserTasks = hotPotatoes.filter(task => task.holder === currentUser).length;
  const totalTasks = hotPotatoes.length;

  // Auto-start the game when component mounts
  useEffect(() => {
    if (!gameState.isPlaying) {
      const timer = setTimeout(() => {
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
          startGame();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.isPlaying, startGame]);

  // Handle canvas resize for better spirit scaling
  useEffect(() => {
    const handleResize = () => {
      const canvas = document.getElementById('gameCanvas');
      if (canvas && gameState.isPlaying) {
        // Trigger a re-render of the game with new dimensions
        canvas.dispatchEvent(new Event('resize'));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [gameState.isPlaying]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 h-screen max-h-screen">
      <div className="flex gap-6 h-full">
        
        {/* Game Canvas Area */}
        <div className="flex-1 min-w-0">
          <div id="game-container" className="w-full h-full">
            <div className="rounded-lg min-h-[500px] flex items-center justify-center relative overflow-hidden bg-gray-900">
              {/* Game canvas - optimized for spirit scaling */}
              <canvas
                id="gameCanvas"
                width="800"
                height="500"
                className="w-full h-auto object-contain rounded-lg shadow-lg"
                style={{
                  maxWidth: '100%',
                  maxHeight: '500px',
                  minHeight: '400px',
                  imageRendering: 'crisp-edges'
                }}
              >
                Your browser does not support the HTML5 canvas tag.
              </canvas>
            </div>
          </div>
        </div>

        {/* Sidebar - Responsive Width */}
        <div className="w-80 xl:w-96 flex-shrink-0 bg-gray-50 rounded-lg p-4 space-y-6 overflow-y-auto" style={{ height: 'fit-content', maxHeight: '90vh' }}>
          
          {/* Game Status - Live Updates */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg text-gray-800">Live Status</h3>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Tasks:</span>
              <span className="font-bold text-blue-600">{totalTasks}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Your Tasks:</span>
              <span className="font-bold text-yellow-600">{currentUserTasks}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Status:</span>
              <span className="font-bold text-green-600">Real-time</span>
            </div>
          </div>

          {/* Current User Stats */}
          <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
            <h3 className="font-bold text-lg text-gray-800 mb-3">Your Stats</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{teamStats[currentUser]?.avatar}</span>
                <div>
                  <div className="font-bold text-gray-800">{teamStats[currentUser]?.name}</div>
                  <div className="text-sm text-gray-500">{teamStats[currentUser]?.speciality}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                <div>
                  <span className="text-gray-600">Level:</span>
                  <span className="font-bold ml-1">{teamStats[currentUser]?.level}</span>
                </div>
                <div>
                  <span className="text-gray-600">XP:</span>
                  <span className="font-bold ml-1">{teamStats[currentUser]?.xp?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Balance:</span>
                  <span className="font-bold ml-1 text-green-600">${teamStats[currentUser]?.balance?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Streak:</span>
                  <span className="font-bold ml-1 text-orange-600">{teamStats[currentUser]?.streak}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Task Overview */}
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-bold text-lg text-gray-800 mb-3">Task Overview</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">My Tasks:</span>
                <span className="font-bold text-blue-600">{currentUserTasks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Active:</span>
                <span className="font-bold text-gray-800">{totalTasks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed:</span>
                <span className="font-bold text-green-600">{teamStats[currentUser]?.potatoesCompleted}</span>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-bold text-lg text-gray-800 mb-3">Team Members</h3>
            <div className="space-y-3">
              {Object.entries(teamStats).map(([id, member]) => (
                <div 
                  key={id} 
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    id === currentUser ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{member.avatar}</span>
                    <div>
                      <div className="font-medium text-sm">{member.name}</div>
                      <div className="text-xs text-gray-500">Lvl {member.level}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-600">
                      {hotPotatoes.filter(task => task.holder === id).length} tasks
                    </div>
                    <div className={`text-xs ${member.status === 'active' ? 'text-green-500' : 'text-orange-500'}`}>
                      {member.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GameView;