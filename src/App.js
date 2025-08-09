import React, { useState, useEffect } from 'react';
import { Flame, Trophy, Activity, Plus, Sparkles } from 'lucide-react';
import { sortTasksByPriority, initialTasks } from './data/tasks';
import { archiveTask } from './data/archive';
import { taskAPI, handleAPIError, checkConnection } from './services/api';
import HotPotatoGame from './Game';

const teamStats = {
  ilan: { name: "Ilan", avatar: "👨‍💻", title: "Admin 1", status: "active", level: 12, xp: 2847, potatoesCompleted: 23, streak: 7, speciality: "Game Master", powerUp: "⚡" },
  nas: { name: "Nas", avatar: "👩‍🎨", title: "Admin 3", status: "active", level: 15, xp: 3421, potatoesCompleted: 31, streak: 12, speciality: "Quality Queen", powerUp: "✨" },
  juan: { name: "Juan", avatar: "👨‍💼", title: "Admin 2", status: "break", level: 10, xp: 2156, potatoesCompleted: 18, streak: 4, speciality: "Strategic Mind", powerUp: "🎯" },
  jessie: { name: "Jessie", avatar: "👩‍💻", title: "Admin 5", status: "active", level: 11, xp: 2654, potatoesCompleted: 20, streak: 9, speciality: "Bug Crusher", powerUp: "🛡️" },
  brandon: { name: "Brandon", avatar: "👨‍🔬", title: "Admin 4", status: "active", level: 13, xp: 2983, potatoesCompleted: 25, streak: 6, speciality: "Data Wizard", powerUp: "🔮" }
};

const ExecutiveDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedView, setSelectedView] = useState('game');
  const [hotPotatoes, setHotPotatoes] = useState([]);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [currentUser] = useState('ilan');
  
  // Game state
  const [gameState, setGameState] = useState({ score: 0, level: 1, isPlaying: false });
  const [gameInstance, setGameInstance] = useState(null);

  // Load tasks on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const connectionStatus = await checkConnection();
        setIsOnline(connectionStatus);

        if (connectionStatus) {
          const apiTasks = await taskAPI.getAllTasks();
          const activeTasks = (apiTasks || []).map(task => ({
            ...task,
            category: task.category === "Customer Satisfaction" ? "Post Construction" : task.category
          }));
          setHotPotatoes(activeTasks);
          setError(null);
        } else {
          throw new Error('Server unavailable');
        }
      } catch (error) {
        console.error('Failed to load tasks:', error);
        const errorInfo = handleAPIError(error);
        setError(`${errorInfo.message} (${errorInfo.type})`);
        setIsOnline(false);
        
        const fallbackTasks = (initialTasks || []).map(task => ({
          ...task,
          category: task.category === "Customer Satisfaction" ? "Post Construction" : task.category
        }));
        setHotPotatoes(fallbackTasks);
      }
    };
    
    loadTasks();
  }, []);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setHotPotatoes(prev => prev.map(potato => ({
        ...potato,
        timeLeft: Math.max(0, potato.timeLeft - 1)
      })));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Game functions
  const updateScore = (points) => {
    setGameState(prev => ({ ...prev, score: prev.score + points }));
  };

  const startGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: true }));
    
    setTimeout(() => {
      const game = new HotPotatoGame(
        'gameCanvas', 
        gameState, 
        updateScore, 
        hotPotatoes, 
        teamStats, 
        currentUser,
        (task) => console.log('Task clicked:', task),
        handleCompletePotato
      );
      setGameInstance(game);
      game.start();
    }, 100);
  };

  const endGame = () => {
    if (gameInstance) {
      gameInstance.stop();
      setGameInstance(null);
    }
    setGameState(prev => ({ ...prev, isPlaying: false }));
  };

  const handleCompletePotato = async (potato) => {
    try {
      const earnedValue = Math.round(potato.value * 1.5);
      
      await archiveTask(potato, {
        completedBy: currentUser,
        completedAt: new Date().toISOString(),
        earnedValue: earnedValue
      });
      
      if (isOnline) {
        await taskAPI.deleteTask(potato.id);
      }
      
      setHotPotatoes(hotPotatoes.filter(p => p.id !== potato.id));
    } catch (error) {
      console.error('Failed to complete task:', error);
      setHotPotatoes(hotPotatoes.filter(p => p.id !== potato.id));
    }
  };

  useEffect(() => {
    return () => {
      if (gameInstance) {
        gameInstance.stop();
      }
    };
  }, [gameInstance]);

  useEffect(() => {
    if (gameInstance) {
      gameInstance.hotPotatoes = hotPotatoes;
    }
  }, [hotPotatoes, gameInstance]);

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Sales': return '#FFCC00';
      case 'New Lead': return '#66B2FF';
      case 'New Customer': return '#4A90E2';
      case 'Pre-Construction': return '#FF6B6B';
      case 'Construction': return '#9B59B6';
      case 'Post Construction': return '#2ECC71';
      default: return '#002C54';
    }
  };

  const getTemperatureEmoji = (temp) => {
    if (temp > 80) return '🔥';
    if (temp > 60) return '🌶️';
    if (temp > 40) return '♨️';
    return '🫖';
  };

  if (error && hotPotatoes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #66B2FF 0%, #002C54 100%)'}}>
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-white text-xl font-bold mb-4">{error}</p>
          <p className="text-gray-300 text-sm mb-6">Using offline mode with demo data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-yellow-400 text-black rounded-lg font-bold hover:opacity-80"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const HotPotatoCard = ({ potato }) => {
    const isMyPotato = potato.holder === currentUser;
    
    return (
      <div className="relative">
        <div style={{backgroundColor: getCategoryColor(potato.category)}} className={`p-1 rounded-lg ${isMyPotato ? 'ring-2 ring-yellow-400' : ''}`}>
          <div style={{backgroundColor: '#002C54'}} className="rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="absolute -top-2 -right-2 flex gap-2">
              {potato.temperature >= 90 && (
                <div className="text-lg font-bold px-2 py-1 rounded-full bg-red-600 text-white animate-pulse">
                  {getTemperatureEmoji(potato.temperature)}
                </div>
              )}
              <div className="text-xs font-bold px-2 sm:px-3 py-1 rounded-full text-black" style={{backgroundColor: getCategoryColor(potato.category)}}>
                {potato.category}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white text-lg sm:text-xl mb-1 sm:mb-2" style={{fontFamily: 'Montserrat, sans-serif'}}>{potato.title}</h3>
              <p className="text-gray-300 text-sm sm:text-base">{potato.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div style={{backgroundColor: '#66B2FF'}} className="rounded-lg p-2 sm:p-3">
                <div className="text-lg sm:text-xl font-bold text-white">${potato.value}</div>
                <div className="text-xs sm:text-sm text-white">Value</div>
              </div>
              <div style={{backgroundColor: '#66B2FF'}} className="rounded-lg p-2 sm:p-3">
                <div className="text-lg sm:text-xl font-bold text-white">{potato.passCount || 0}</div>
                <div className="text-xs sm:text-sm text-white">Passes</div>
              </div>
              <div style={{backgroundColor: '#66B2FF'}} className="rounded-lg p-2 sm:p-3">
                <div className="text-lg sm:text-xl font-bold text-white flex items-center justify-center gap-1">
                  {potato.timeLeft}s
                </div>
                <div className="text-xs sm:text-sm text-white">Time</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-300 font-semibold">Temperature</span>
                <span className="text-white font-bold flex items-center gap-1">
                  {potato.temperature || 0}° {getTemperatureEmoji(potato.temperature || 0)}
                </span>
              </div>
              <div className="w-full h-2 sm:h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${potato.temperature || 0}%`, 
                    background: (potato.temperature || 0) > 80 ? 
                      'linear-gradient(to right, #FFCC00, #FF6B6B)' : 
                      (potato.temperature || 0) > 60 ? '#FFCC00' : '#66B2FF' 
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 sm:pt-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl">{teamStats[potato.holder]?.avatar || '👤'}</span>
                <div>
                  <div className="text-sm sm:text-base font-bold text-white" style={{fontFamily: 'Montserrat, sans-serif'}}>{teamStats[potato.holder]?.name || 'Unknown'}</div>
                  <div className="text-xs sm:text-sm text-gray-300">
                    {potato.combo > 0 && `${potato.combo}x Combo! `}
                    {potato.lastPasser && `from ${teamStats[potato.lastPasser]?.name || 'Unknown'}`}
                  </div>
                </div>
              </div>
              
              {isMyPotato && (
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => console.log('Pass task:', potato)}
                    style={{backgroundColor: '#FFCC00'}}
                    className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 text-black rounded-lg text-sm sm:text-base font-bold transition-all hover:opacity-80"
                  >
                    Pass! 🏃
                  </button>
                  <button
                    onClick={() => handleCompletePotato(potato)}
                    style={{backgroundColor: '#66B2FF'}}
                    className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-bold transition-all hover:opacity-80 text-white"
                  >
                    Done! ✅
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #66B2FF 0%, #002C54 100%)', fontFamily: 'Montserrat, sans-serif'}}>
      {error && hotPotatoes.length > 0 && (
        <div className="fixed top-4 left-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center justify-between">
          <span className="text-sm">⚠️ {isOnline ? 'API Error' : 'Server offline'} - running in {isOnline ? 'degraded' : 'offline'} mode</span>
          <button onClick={() => setError(null)} className="text-white hover:text-gray-200 ml-4">✕</button>
        </div>
      )}

      <div className="p-3 sm:p-6">
        <div style={{backgroundColor: '#002C54'}} className="rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
            <div className="flex-shrink-0">
              <img src="/myimages/firstlogo.png" alt="HOTPOTATO by SUNLAB" className="h-12 w-auto sm:h-20" />
            </div>

            <div className="flex items-center gap-3 sm:gap-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white" style={{fontFamily: 'Montserrat, sans-serif'}}>{hotPotatoes.length}</div>
                <div className="text-gray-300 text-xs sm:text-base font-semibold">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white" style={{fontFamily: 'Montserrat, sans-serif'}}>
                  {hotPotatoes.filter(p => p.holder === currentUser).length}
                </div>
                <div className="text-gray-300 text-xs sm:text-base font-semibold">Mine</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-3xl font-bold text-white" style={{fontFamily: 'Montserrat, sans-serif'}}>{currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                <div className="text-gray-300 text-xs sm:text-base font-semibold">Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 sm:px-6 mb-4 sm:mb-6">
        <div style={{backgroundColor: '#002C54'}} className="flex flex-col sm:flex-row gap-2 rounded-lg p-2">
          {[
            { id: 'game', label: 'Game 🎮', icon: Sparkles },
            { id: 'list', label: 'List 🥔', icon: Flame },
            { id: 'board', label: 'Board 📊', icon: Activity },
            { id: 'leaderboard', label: 'Leaders 🏆', icon: Trophy }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedView(tab.id)}
              className={`flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-all ${
                selectedView === tab.id ? 'text-black' : 'text-white hover:opacity-80'
              }`}
              style={{
                backgroundColor: selectedView === tab.id ? '#FFCC00' : 'transparent',
                fontFamily: 'Montserrat, sans-serif'
              }}
            >
              <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-3 sm:px-6 pb-6">
        {selectedView === 'game' && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 min-h-[600px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold" style={{color: '#002C54', fontFamily: 'Montserrat, sans-serif'}}>Game Zone 🎮</h2>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">Score: <span className="font-bold text-lg">{gameState.score}</span></div>
                <div className="text-sm text-gray-500">Level: <span className="font-bold text-lg">{gameState.level}</span></div>
              </div>
            </div>
            
            <div id="game-container" className="w-full">
              <div className="rounded-lg min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden bg-gray-900">
                {!gameState.isPlaying ? (
                  <div className="text-center relative z-10">
                    <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4 drop-shadow-lg" />
                    <p className="text-white text-xl font-bold mb-2 drop-shadow-lg" style={{fontFamily: 'Montserrat, sans-serif'}}>Hot Potato Game! 🔥</p>
                    <p className="text-gray-200 text-lg font-semibold mb-6 drop-shadow-lg">Ready to Play?</p>
                    <button
                      onClick={startGame}
                      style={{backgroundColor: '#FFCC00'}}
                      className="px-8 py-4 text-black rounded-lg font-bold text-lg transition-all hover:opacity-80 hover:scale-105 shadow-lg"
                    >
                      Start Game 🎮
                    </button>
                    <p className="text-gray-300 text-sm mt-4 drop-shadow-lg">Click spirits on locations to interact with tasks!</p>
                  </div>
                ) : (
                  <div className="w-full h-full relative">
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
                      <div className="bg-black bg-opacity-80 rounded-lg px-4 py-2 border border-yellow-400">
                        <p className="text-yellow-400 font-bold text-lg">Score: {gameState.score}</p>
                      </div>
                      <div className="bg-black bg-opacity-80 rounded-lg px-4 py-2 border border-blue-400">
                        <p className="text-blue-400 font-bold text-lg">Level: {gameState.level}</p>
                      </div>
                      <button
                        onClick={endGame}
                        style={{backgroundColor: '#FF6B6B'}}
                        className="px-4 py-2 text-white rounded-lg font-bold text-sm transition-all hover:opacity-80 shadow-lg"
                      >
                        End Game
                      </button>
                    </div>
                    
                    <div className="flex justify-center items-center pt-16">
                      <canvas
                        id="gameCanvas"
                        width="800"
                        height="400"
                        className="border-2 border-yellow-400 rounded-lg shadow-2xl"
                        style={{
                          backgroundImage: 'url("/images/background.png")',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          maxWidth: '100%',
                          height: 'auto'
                        }}
                      >
                        Your browser does not support the HTML5 canvas tag.
                      </canvas>
                    </div>
                    
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                      <div className="bg-black bg-opacity-80 rounded-lg px-6 py-2 border border-gray-400">
                        <p className="text-white text-sm font-semibold">🎮 Click spirits to view tasks • ESC to close • Red circles show task count</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div id="game-controls" className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <div className="text-2xl mb-1">🏆</div>
                <div className="text-sm text-gray-600">High Score</div>
                <div className="text-xl font-bold">{Math.max(gameState.score, 0)}</div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <div className="text-2xl mb-1">🔥</div>
                <div className="text-sm text-gray-600">Active Tasks</div>
                <div className="text-xl font-bold">{hotPotatoes.length}</div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <div className="text-2xl mb-1">⚡</div>
                <div className="text-sm text-gray-600">My Tasks</div>
                <div className="text-xl font-bold">{hotPotatoes.filter(p => p.holder === currentUser).length}</div>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'list' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white" style={{fontFamily: 'Montserrat, sans-serif'}}>Task List 🔥</h2>
                <p className="text-xs sm:text-sm text-gray-300 mt-1">Your tasks first, then sorted by temperature (hottest first)</p>
              </div>
              <button 
                onClick={() => console.log('Create new task')}
                style={{backgroundColor: '#FFCC00'}} 
                className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 text-black rounded-lg font-bold text-sm sm:text-base transition-all hover:opacity-80"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">New Task</span>
                <span className="sm:hidden">New</span>
              </button>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {sortTasksByPriority(hotPotatoes, currentUser).map((potato) => (
                <HotPotatoCard key={potato.id} potato={potato} />
              ))}
            </div>

            <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mt-6 sm:mt-8">
              <div style={{backgroundColor: '#FFCC00'}} className="rounded-lg p-2 sm:p-3 text-center">
                <div className="text-base sm:text-lg font-bold text-black" style={{fontFamily: 'Montserrat, sans-serif'}}>
                  {hotPotatoes.filter(p => p.category === 'Sales').length}
                </div>
                <div className="text-xs font-semibold text-black">Sales</div>
              </div>
              <div style={{backgroundColor: '#66B2FF'}} className="rounded-lg p-2 sm:p-3 text-white text-center">
                <div className="text-base sm:text-lg font-bold" style={{fontFamily: 'Montserrat, sans-serif'}}>
                  {hotPotatoes.filter(p => p.category === 'New Lead').length}
                </div>
                <div className="text-xs font-semibold">New Lead</div>
              </div>
              <div style={{backgroundColor: '#4A90E2'}} className="rounded-lg p-2 sm:p-3 text-white text-center">
                <div className="text-base sm:text-lg font-bold" style={{fontFamily: 'Montserrat, sans-serif'}}>
                  {hotPotatoes.filter(p => p.category === 'New Customer').length}
                </div>
                <div className="text-xs font-semibold">New Customer</div>
              </div>
              <div style={{backgroundColor: '#FF6B6B'}} className="rounded-lg p-2 sm:p-3 text-white text-center">
                <div className="text-base sm:text-lg font-bold" style={{fontFamily: 'Montserrat, sans-serif'}}>
                  {hotPotatoes.filter(p => p.category === 'Pre-Construction').length}
                </div>
                <div className="text-xs font-semibold">Pre-Construction</div>
              </div>
              <div style={{backgroundColor: '#9B59B6'}} className="rounded-lg p-2 sm:p-3 text-white text-center">
                <div className="text-base sm:text-lg font-bold" style={{fontFamily: 'Montserrat, sans-serif'}}>
                  {hotPotatoes.filter(p => p.category === 'Construction').length}
                </div>
                <div className="text-xs font-semibold">Construction</div>
              </div>
              <div style={{backgroundColor: '#2ECC71'}} className="rounded-lg p-2 sm:p-3 text-white text-center">
                <div className="text-base sm:text-lg font-bold" style={{fontFamily: 'Montserrat, sans-serif'}}>
                  {hotPotatoes.filter(p => p.category === 'Post Construction').length}
                </div>
                <div className="text-xs font-semibold">Post Construction</div>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'board' && (
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Board View</h2>
            <p>Board functionality coming soon...</p>
          </div>
        )}

        {selectedView === 'leaderboard' && (
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
            <p>Leaderboard functionality coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutiveDashboard;