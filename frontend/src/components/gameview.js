import React, { useEffect, useRef, useState } from 'react';
import { gameAPI } from '../services/api';

const GameView = ({ gameState, startGame, endGame, hotPotatoes, currentUser, onTaskClick, onTaskComplete, updateScore }) => {
  const [apiTasks, setApiTasks] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [gameInstance, setGameInstance] = useState(null);
  const canvasRef = useRef(null);

  const teamStats = {
    ilan: { name: "Ilan", avatar: "👨‍💻", title: "Admin 1", status: "active", level: 12, xp: 2847, potatoesCompleted: 23, streak: 7, speciality: "Game Master", balance: 15420 },
    nas: { name: "Nas", avatar: "👩‍🎨", title: "Admin 3", status: "active", level: 15, xp: 3421, potatoesCompleted: 31, streak: 12, speciality: "Quality Queen", balance: 22340 },
    juan: { name: "Juan", avatar: "👨‍💼", title: "Admin 2", status: "break", level: 10, xp: 2156, potatoesCompleted: 18, streak: 4, speciality: "Strategic Mind", balance: 12890 },
    jessie: { name: "Jessie", avatar: "👩‍💻", title: "Admin 5", status: "active", level: 11, xp: 2654, potatoesCompleted: 20, streak: 9, speciality: "Bug Crusher", balance: 16750 },
    brandon: { name: "Brandon", avatar: "👨‍🔬", title: "Admin 4", status: "active", level: 13, xp: 2983, potatoesCompleted: 25, streak: 6, speciality: "Data Wizard", balance: 18920 }
  };

  // Use API tasks if available, fallback to hotPotatoes prop
  const activeTasks = apiTasks.length > 0 ? apiTasks : hotPotatoes;
  const currentUserTasks = activeTasks.filter(task => task.holder === currentUser).length;
  const totalTasks = activeTasks.length;

  // Initialize game and API polling
  useEffect(() => {
    initializeGame();
    startTaskSync();

    return () => {
      if (gameInstance) {
        gameInstance.stop();
      }
      gameAPI.stopPolling();
    };
  }, []);

  // Auto-start the game when component mounts
  useEffect(() => {
    if (!gameState.isPlaying) {
      const timer = setTimeout(() => {
        if (canvasRef.current) {
          startGame();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.isPlaying, startGame]);

  // Handle canvas resize for better spirit scaling
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && gameState.isPlaying) {
        canvasRef.current.dispatchEvent(new Event('resize'));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [gameState.isPlaying]);

  const initializeGame = () => {
    if (canvasRef.current && !gameInstance) {
      const game = new HotPotatoGame(canvasRef.current, {
        onTaskClick: handleTaskClick,
        onTaskComplete: handleTaskComplete,
        updateScore: updateScore || (() => {})
      });
      
      game.start();
      setGameInstance(game);
    }
  };

  const startTaskSync = () => {
    gameAPI.startPolling((fetchedTasks) => {
      setApiTasks(fetchedTasks);
      setIsOnline(true);
      
      if (gameInstance) {
        gameInstance.updateTasks(fetchedTasks);
      }
    });
  };

  const handleTaskClick = (task) => {
    if (onTaskClick) {
      onTaskClick(task);
    }
  };

  const handleTaskComplete = async (task) => {
    const result = await gameAPI.completeTask(task.id, currentUser);
    
    if (result.success && onTaskComplete) {
      onTaskComplete(task, result);
    }
  };

  // Check connection status periodically
  useEffect(() => {
    const checkConnectionStatus = async () => {
      const isConnected = await gameAPI.checkConnection();
      setIsOnline(isConnected);
      
      if (!isConnected && hotPotatoes.length > 0) {
        // Use fallback hotPotatoes data when offline
        setApiTasks([]);
        if (gameInstance) {
          gameInstance.updateTasks(hotPotatoes);
        }
      }
    };

    const interval = setInterval(checkConnectionStatus, 10000);
    return () => clearInterval(interval);
  }, [gameInstance, hotPotatoes]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 h-screen max-h-screen">
      <div className="flex gap-6 h-full">
        
        {/* Game Canvas Area */}
        <div className="flex-1 min-w-0">
          <div id="game-container" className="w-full h-full">
            <div className="rounded-lg min-h-[500px] flex items-center justify-center relative overflow-hidden bg-gray-900">
              
              {/* Connection Status Indicator */}
              {!isOnline && (
                <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm font-semibold z-10">
                  🔴 Offline Mode
                </div>
              )}
              
              {/* Game canvas - optimized for spirit scaling */}
              <canvas
                ref={canvasRef}
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
              <span className={`font-bold ${isOnline ? 'text-green-600' : 'text-yellow-600'}`}>
                {isOnline ? 'Real-time' : 'Offline'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Data Source:</span>
              <span className="text-xs text-gray-500">
                {apiTasks.length > 0 ? 'API' : 'Local'}
              </span>
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
              {totalTasks > 0 && (
                <div className="mt-3 text-xs text-gray-500">
                  {activeTasks.map(task => (
                    <div key={task.id} className="flex justify-between py-1">
                      <span className="truncate">{task.title || task.name}</span>
                      <span className="text-gray-400">{task.category}</span>
                    </div>
                  ))}
                </div>
              )}
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
                      {activeTasks.filter(task => task.holder === id).length} tasks
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

// HotPotatoGame class for canvas rendering
class HotPotatoGame {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.tasks = [];
    this.spirits = [];
    this.images = {};
    
    this.locations = [
      { name: "Sales Office", x: 20.8, y: 76.2, category: "Sales" },
      { name: "New Lead", x: 20.2, y: 39.1, category: "New Lead" },
      { name: "New Customer", x: 42.0, y: 26.0, category: "New Customer" },
      { name: "Pre-Construction", x: 69.0, y: 24.4, category: "Pre-Construction" },
      { name: "Construction", x: 71.6, y: 65.4, category: "Construction" },
      { name: "Post Construction", x: 86.6, y: 77.1, category: "Post Construction" }
    ];
    
    this.onTaskClick = options.onTaskClick || (() => {});
    this.onTaskComplete = options.onTaskComplete || (() => {});
    this.updateScore = options.updateScore || (() => {});
    
    this.setupCanvas();
    this.loadAssets();
  }

  setupCanvas() {
    this.canvas.width = 800;
    this.canvas.height = 500;
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }

  async loadAssets() {
    try {
      this.images.background = await this.loadImage('/myimages/background.png');
      this.images.spirit1 = await this.loadImage('/myimages/spirit1.png');
      this.images.spirit2 = await this.loadImage('/myimages/spirit2.png');
      this.images.spirit3 = await this.loadImage('/myimages/spirit3.png');
      console.log('Game assets loaded successfully');
    } catch (error) {
      console.warn('Some game assets failed to load:', error);
    }
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.warn(`Failed to load image: ${src}`);
        resolve(null);
      };
      img.src = src;
    });
  }

  updateTasks(tasks) {
    this.tasks = tasks || [];
    this.generateSpirits();
    this.render();
  }

  generateSpirits() {
    this.spirits = [];
    
    const tasksByCategory = this.tasks.reduce((acc, task) => {
      const category = task.category || 'Sales';
      if (!acc[category]) acc[category] = [];
      acc[category].push(task);
      return acc;
    }, {});

    this.locations.forEach(location => {
      const locationTasks = tasksByCategory[location.category] || [];
      
      locationTasks.forEach((task, index) => {
        const spiritX = location.x + (index * 3);
        const spiritY = location.y + (index * 2);
        
        this.spirits.push({
          id: task.id,
          x: spiritX,
          y: spiritY,
          task: task,
          size: 100,
          targetSize: 100,
          isHovered: false
        });
      });
    });
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (this.images.background) {
      this.ctx.drawImage(this.images.background, 0, 0, this.canvas.width, this.canvas.height);
    } else {
      this.ctx.fillStyle = '#1e3a8a';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.spirits.forEach(spirit => {
      this.drawSpirit(spirit);
    });

    if (this.tasks.length === 0) {
      this.ctx.fillStyle = 'white';
      this.ctx.font = '24px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('No active tasks', this.canvas.width / 2, this.canvas.height / 2);
    }
  }

  drawSpirit(spirit) {
    const difficulty = spirit.task.difficulty || 'common';
    const spiritImage = this.images[`spirit${difficulty === 'common' ? '1' : difficulty === 'rare' ? '2' : '3'}`];
    
    const pixelX = (spirit.x / 100) * this.canvas.width;
    const pixelY = (spirit.y / 100) * this.canvas.height;
    
    const sizeDiff = spirit.targetSize - spirit.size;
    spirit.size += sizeDiff * 0.1;
    
    const halfSize = spirit.size / 2;
    
    if (spiritImage) {
      this.ctx.drawImage(
        spiritImage,
        pixelX - halfSize,
        pixelY - halfSize,
        spirit.size,
        spirit.size
      );
    } else {
      this.ctx.fillStyle = difficulty === 'epic' ? '#ff6b6b' : difficulty === 'rare' ? '#ffa726' : '#66bb6a';
      this.ctx.beginPath();
      this.ctx.arc(pixelX, pixelY, halfSize, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.drawTemperatureIndicator(spirit, pixelX, pixelY);
  }

  drawTemperatureIndicator(spirit, x, y) {
    const temperature = spirit.task.temperature || 0;
    
    if (temperature > 50) {
      const intensity = Math.min(temperature / 100, 1);
      
      this.ctx.save();
      this.ctx.globalAlpha = intensity * 0.3;
      this.ctx.fillStyle = `hsl(${60 - (intensity * 60)}, 100%, 50%)`;
      this.ctx.beginPath();
      this.ctx.arc(x, y, spirit.size * 0.7, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  handleMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = ((event.clientX - rect.left) / rect.width) * 100;
    const mouseY = ((event.clientY - rect.top) / rect.height) * 100;

    let foundHover = false;

    this.spirits.forEach(spirit => {
      const distance = Math.sqrt(
        Math.pow(mouseX - spirit.x, 2) + Math.pow(mouseY - spirit.y, 2)
      );

      if (distance <= 6) {
        spirit.targetSize = 120;
        spirit.isHovered = true;
        foundHover = true;
      } else {
        spirit.targetSize = 100;
        spirit.isHovered = false;
      }
    });

    this.canvas.style.cursor = foundHover ? 'pointer' : 'default';
    this.render();
  }

  handleClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = ((event.clientX - rect.left) / rect.width) * 100;
    const mouseY = ((event.clientY - rect.top) / rect.height) * 100;

    this.spirits.forEach(spirit => {
      const distance = Math.sqrt(
        Math.pow(mouseX - spirit.x, 2) + Math.pow(mouseY - spirit.y, 2)
      );

      if (distance <= 6) {
        this.onTaskClick(spirit.task);
      }
    });
  }

  start() {
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('click', this.handleClick.bind(this));
    this.animationLoop();
  }

  animationLoop() {
    this.render();
    this.animationId = requestAnimationFrame(() => this.animationLoop());
  }

  stop() {
    this.canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.removeEventListener('click', this.handleClick.bind(this));
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

export default GameView;