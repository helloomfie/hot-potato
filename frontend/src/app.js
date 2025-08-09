import React, { useState, useEffect } from 'react';
import { initialTasks } from './data/tasks';
import { archiveTask } from './data/archive';
import { taskAPI, handleAPIError, checkConnection } from './services/api';
import HotPotatoGame from './game';
import Bank from './bank';
import Leaderboard from './leaderboard';
import BoardView from './boardview';
import GameView from './components/gameview';
import ListView from './components/listview';
import Header from './components/header';
import NavigationTabs from './components/navigationtabs';
import Modals from './components/modals';
import ErrorBoundary from './components/errorboundary';

const teamStats = {
  ilan: { name: "Ilan", avatar: "👨‍💻", title: "Admin 1", status: "active", level: 12, xp: 2847, potatoesCompleted: 23, streak: 7, speciality: "Game Master" },
  nas: { name: "Nas", avatar: "👩‍🎨", title: "Admin 3", status: "active", level: 15, xp: 3421, potatoesCompleted: 31, streak: 12, speciality: "Quality Queen" },
  juan: { name: "Juan", avatar: "👨‍💼", title: "Admin 2", status: "break", level: 10, xp: 2156, potatoesCompleted: 18, streak: 4, speciality: "Strategic Mind" },
  jessie: { name: "Jessie", avatar: "👩‍💻", title: "Admin 5", status: "active", level: 11, xp: 2654, potatoesCompleted: 20, streak: 9, speciality: "Bug Crusher" },
  brandon: { name: "Brandon", avatar: "👨‍🔬", title: "Admin 4", status: "active", level: 13, xp: 2983, potatoesCompleted: 25, streak: 6, speciality: "Data Wizard" }
};

const ExecutiveDashboard = () => {
  // State management
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedView, setSelectedView] = useState('game');
  const [hotPotatoes, setHotPotatoes] = useState([]);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [currentUser] = useState('ilan');
  const [selectedPotato, setSelectedPotato] = useState(null);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationValue, setCelebrationValue] = useState(0);
  const [gameState, setGameState] = useState({ score: 0, level: 1, isPlaying: false });
  const [gameInstance, setGameInstance] = useState(null);

  // Load tasks on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        console.log('Checking connection to backend...');
        const connectionStatus = await checkConnection();
        console.log('Connection status:', connectionStatus);
        setIsOnline(connectionStatus);

        if (connectionStatus) {
          console.log('Loading tasks from API...');
          const apiResponse = await taskAPI.getAllTasks();
          console.log('API response:', apiResponse);
          
          let apiTasks;
          if (Array.isArray(apiResponse)) {
            apiTasks = apiResponse;
          } else if (apiResponse && Array.isArray(apiResponse.tasks)) {
            apiTasks = apiResponse.tasks;
          } else if (apiResponse && Array.isArray(apiResponse.data)) {
            apiTasks = apiResponse.data;
          } else {
            console.log('Unexpected API response format:', apiResponse);
            apiTasks = [];
          }
          
          console.log('Processed API tasks:', apiTasks);
          const activeTasks = apiTasks.map(task => ({
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
        
        console.log('Using fallback tasks...');
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
        timeLeft: Math.max(0, potato.timeLeft - 1),
        temperature: Math.min(100, (potato.temperature || 0) + 0.1)
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
        handleTaskClick,
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

  const handleTaskClick = (task) => {
    setSelectedPotato(task);
    setShowPassModal(true);
  };

  const handlePassPotato = async (potato, toUser) => {
    try {
      const updatedData = {
        holder: toUser,
        passCount: (potato.passCount || 0) + 1,
        lastPasser: currentUser,
        temperature: Math.min(100, (potato.temperature || 0) + 5),
        combo: potato.lastPasser === toUser ? (potato.combo || 0) + 1 : 0
      };

      if (isOnline) {
        const updatedTask = await taskAPI.updateTask(potato.id, updatedData);
        setHotPotatoes(hotPotatoes.map(p => 
          p.id === potato.id ? updatedTask : p
        ));
      } else {
        setHotPotatoes(hotPotatoes.map(p => 
          p.id === potato.id ? { ...p, ...updatedData } : p
        ));
      }
      
      setShowPassModal(false);
      setSelectedPotato(null);
    } catch (error) {
      const errorInfo = handleAPIError(error);
      setError(`Failed to pass task: ${errorInfo.message}`);
      
      const newPotatoes = hotPotatoes.map(p => {
        if (p.id === potato.id) {
          return {
            ...p,
            holder: toUser,
            passCount: (p.passCount || 0) + 1,
            lastPasser: currentUser,
            temperature: Math.min(100, (p.temperature || 0) + 5),
            combo: p.lastPasser === toUser ? (p.combo || 0) + 1 : 0
          };
        }
        return p;
      });
      setHotPotatoes(newPotatoes);
      setShowPassModal(false);
      setSelectedPotato(null);
    }
  };

  const handleCompletePotato = async (potato) => {
    try {
      const temperatureBonus = (potato.temperature || 0) > 80 ? 1.5 : 1;
      const earnedValue = Math.round(potato.value * temperatureBonus);

      await archiveTask(potato, {
        completedBy: currentUser,
        completedAt: new Date().toISOString(),
        earnedValue: earnedValue
      });
      
      if (isOnline) {
        await taskAPI.deleteTask(potato.id);
      }
      
      setHotPotatoes(hotPotatoes.filter(p => p.id !== potato.id));
      setCelebrationValue(earnedValue);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
      
      updateScore(earnedValue / 10);
      
    } catch (error) {
      console.error('Failed to complete task:', error);
      setHotPotatoes(hotPotatoes.filter(p => p.id !== potato.id));
      setCelebrationValue(potato.value);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  // Cleanup effects
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

  // Main render
  return (
    <ErrorBoundary>
      <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #66B2FF 0%, #002C54 100%)', fontFamily: 'Montserrat, sans-serif'}}>
        
        {/* Error Display */}
        {error && hotPotatoes.length > 0 && (
          <div className="fixed top-4 left-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center justify-between">
            <span className="text-sm">⚠️ {isOnline ? 'API Error' : 'Server offline'} - running in {isOnline ? 'degraded' : 'offline'} mode</span>
            <button onClick={() => setError(null)} className="text-white hover:text-gray-200 ml-4">✕</button>
          </div>
        )}

        {/* Modals */}
        <Modals 
          showCelebration={showCelebration}
          celebrationValue={celebrationValue}
          showPassModal={showPassModal}
          selectedPotato={selectedPotato}
          teamStats={teamStats}
          currentUser={currentUser}
          handlePassPotato={handlePassPotato}
          setShowPassModal={setShowPassModal}
        />

        {/* Header */}
        <Header 
          hotPotatoes={hotPotatoes}
          currentUser={currentUser}
          currentTime={currentTime}
        />

        {/* Navigation */}
        <NavigationTabs 
          selectedView={selectedView}
          setSelectedView={setSelectedView}
        />

        {/* Main Content */}
        <div className="px-3 sm:px-6 pb-6">
          {selectedView === 'game' && (
            <GameView 
              gameState={gameState}
              startGame={startGame}
              endGame={endGame}
              hotPotatoes={hotPotatoes}
              currentUser={currentUser}
            />
          )}

          {selectedView === 'list' && (
            <ListView 
              hotPotatoes={hotPotatoes}
              currentUser={currentUser}
              teamStats={teamStats}
              handleTaskClick={handleTaskClick}
              handleCompletePotato={handleCompletePotato}
            />
          )}

          {selectedView === 'board' && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6" style={{fontFamily: 'Montserrat, sans-serif'}}>
                Task Board 📊
              </h2>
              <BoardView hotPotatoes={hotPotatoes} teamStats={teamStats} />
            </div>
          )}

          {selectedView === 'leaderboard' && (
            <Leaderboard teamStats={teamStats} />
          )}

          {selectedView === 'bank' && (
            <Bank 
              teamStats={teamStats} 
              hotPotatoes={hotPotatoes} 
              currentUser={currentUser} 
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ExecutiveDashboard;