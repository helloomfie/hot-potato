import React, { useState, useEffect } from 'react';
import { Flame, Zap, Trophy, Activity, Plus, MoreVertical, Calendar, CheckCircle, Timer, ArrowRight, Shield, Sparkles } from 'lucide-react';
import { initialTasks } from './data/tasks';

const teamStats = {
  ilan: { 
    name: "Ilan", 
    avatar: "👨‍💻", 
    title: "Admin 1", 
    status: "active",
    level: 12,
    xp: 2847,
    potatoesCompleted: 23,
    streak: 7,
    speciality: "Game Master",
    powerUp: "⚡"
  },
  nas: { 
    name: "Nas", 
    avatar: "👩‍🎨", 
    title: "Admin 3", 
    status: "active",
    level: 15,
    xp: 3421,
    potatoesCompleted: 31,
    streak: 12,
    speciality: "Quality Queen",
    powerUp: "✨"
  },
  juan: { 
    name: "Juan", 
    avatar: "👨‍💼", 
    title: "Admin 2", 
    status: "break",
    level: 10,
    xp: 2156,
    potatoesCompleted: 18,
    streak: 4,
    speciality: "Strategic Mind",
    powerUp: "🎯"
  },
  jessie: { 
    name: "Jessie", 
    avatar: "👩‍💻", 
    title: "Admin 5", 
    status: "active",
    level: 11,
    xp: 2654,
    potatoesCompleted: 20,
    streak: 9,
    speciality: "Bug Crusher",
    powerUp: "🛡️"
  },
  brandon: { 
    name: "Brandon", 
    avatar: "👨‍🔬", 
    title: "Admin 4", 
    status: "active",
    level: 13,
    xp: 2983,
    potatoesCompleted: 25,
    streak: 6,
    speciality: "Data Wizard",
    powerUp: "🔮"
  }
};

const ExecutiveDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedView, setSelectedView] = useState('game');
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationValue, setCelebrationValue] = useState(0);
  const [celebrationBoost, setCelebrationBoost] = useState(false);
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);
  const [currentUser] = useState('ilan');
  const [potatoTimer, setPotatoTimer] = useState(45);
  const [selectedPotato, setSelectedPotato] = useState(null);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [newPotatoForm, setNewPotatoForm] = useState({
    title: '',
    description: '',
    category: 'Sales',
    holder: 'ilan',
    value: 1000,
    timeLeft: 120
  });

  const popularEmojis = [
    '📞', '📝', '📅', '📊', '💰', '📋', '📄', '📁', '🏠', '✅',
    '⚡', '🔧', '⭐', '🎁', '📈', '🏗️', '🔥', '💡', '📱', '🎯'
  ];
  const [powerUps, setPowerUps] = useState({
    freeze: 2,
    shield: 1,
    boost: 3
  });
  const [activePowerUps, setActivePowerUps] = useState({
    shield: false,
    boost: false,
    freeze: null // stores potato ID if frozen
  });
  const [powerUpNotification, setPowerUpNotification] = useState(null);
  const [achievementStats, setAchievementStats] = useState({
    speedRunner: 0, // potatoes completed under 30s
    passStreak: 0,  // current pass streak
    epicCompleted: 0, // epic potatoes completed
    dailyLogin: new Date().toDateString()
  });
  const [myTotalRevenue, setMyTotalRevenue] = useState(45000);
  
  // Game state
  const [gameState, setGameState] = useState({
    isPlaying: false,
    score: 0,
    level: 1,
    gameData: null
  });

  // Game functions
  const startGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: true }));
  };

  const endGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: false }));
  };

  // Function for future game integration
  // eslint-disable-next-line no-unused-vars
  const updateGameScore = (points) => {
    setGameState(prev => ({ ...prev, score: prev.score + points }));
  };

  const [hotPotatoes, setHotPotatoes] = useState(initialTasks);

  const [boardColumns, setBoardColumns] = useState({
    inProgress: {
      title: "In Progress 🚀", 
      color: "#FFCC00",
      cards: []
    },
    review: {
      title: "Review 👀",
      color: "#4A90E2", 
      cards: []
    },
    completed: {
      title: "Completed ✅",
      color: "#002C54",
      cards: []
    }
  });

  // Auto-sync potatoes to board columns based on temperature
  useEffect(() => {
    const updatedColumns = {
      inProgress: {
        title: "In Progress 🚀",
        color: "#FFCC00", 
        cards: hotPotatoes
          .filter(p => p.temperature <= 80)
          .sort((a, b) => b.temperature - a.temperature)
          .map(p => ({
            id: p.id,
            title: p.title,
            assignee: { name: teamStats[p.holder].name, avatar: teamStats[p.holder].avatar },
            priority: p.difficulty === "epic" ? "high" : p.difficulty === "rare" ? "medium" : "low",
            revenue: p.value,
            dueDate: `${Math.ceil(p.timeLeft / 60)}h`,
            tags: p.tags,
            progress: Math.max(0, 100 - p.temperature),
            description: p.description,
            category: p.category
          }))
      },
      review: {
        title: "Review 👀",
        color: "#4A90E2",
        cards: hotPotatoes
          .filter(p => p.temperature > 80 && p.temperature < 95)
          .sort((a, b) => b.temperature - a.temperature)
          .map(p => ({
            id: p.id,
            title: p.title,
            assignee: { name: teamStats[p.holder].name, avatar: teamStats[p.holder].avatar },
            priority: p.difficulty === "epic" ? "high" : p.difficulty === "rare" ? "medium" : "low",
            revenue: p.value,
            dueDate: `${Math.ceil(p.timeLeft / 60)}h`,
            tags: p.tags,
            progress: Math.max(0, 100 - p.temperature),
            description: p.description,
            category: p.category
          }))
      },
      completed: {
        title: "Completed ✅",
        color: "#002C54",
        cards: hotPotatoes
          .filter(p => p.temperature >= 95)
          .sort((a, b) => b.temperature - a.temperature)
          .map(p => ({
            id: p.id,
            title: p.title,
            assignee: { name: teamStats[p.holder].name, avatar: teamStats[p.holder].avatar },
            priority: p.difficulty === "epic" ? "high" : p.difficulty === "rare" ? "medium" : "low",
            revenue: p.value,
            dueDate: `${Math.ceil(p.timeLeft / 60)}h`,
            tags: p.tags,
            progress: 100,
            description: p.description,
            category: p.category
          }))
      }
    };
    setBoardColumns(updatedColumns);
  }, [hotPotatoes]);

  const getAchievementsDisplay = () => [
    { 
      icon: "🔥", 
      name: "Hot Streak", 
      description: `Pass ${5 - achievementStats.passStreak} more for Shield!`, 
      progress: (achievementStats.passStreak / 5) * 100 
    },
    { 
      icon: "⚡", 
      name: "Speed Runner", 
      description: `${3 - (achievementStats.speedRunner % 3)} more for Boost!`, 
      progress: ((achievementStats.speedRunner % 3) / 3) * 100 
    },
    { 
      icon: "🎯", 
      name: "Epic Hunter", 
      description: `Complete epic tasks for Freeze!`, 
      progress: Math.min(100, achievementStats.epicCompleted * 20) 
    },
    { 
      icon: "💎", 
      name: "Daily Player", 
      description: "Login daily for random power-up!", 
      progress: 100 
    }
  ];

  const leaderboard = [
    { rank: 1, player: teamStats.nas, potatoScore: 3421, weeklyPotatoes: 12 },
    { rank: 2, player: teamStats.brandon, potatoScore: 2983, weeklyPotatoes: 10 },
    { rank: 3, player: teamStats.ilan, potatoScore: 2847, weeklyPotatoes: 8 },
    { rank: 4, player: teamStats.jessie, potatoScore: 2654, weeklyPotatoes: 7 },
    { rank: 5, player: teamStats.juan, potatoScore: 2156, weeklyPotatoes: 5 }
  ];

  useEffect(() => {
    // Check for daily login bonus
    const today = new Date().toDateString();
    if (achievementStats.dailyLogin !== today && awardPowerUp) {
      const powerUpTypes = ['shield', 'boost', 'freeze'];
      const randomPowerUp = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
      setTimeout(() => {
        awardPowerUp(randomPowerUp, 'Daily login bonus!');
        setAchievementStats(prev => ({ ...prev, dailyLogin: today }));
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Update potato timers
      setHotPotatoes(prev => prev.map(potato => {
        // Don't decrease time if potato is frozen
        if (activePowerUps.freeze === potato.id) {
          return potato;
        }
        return {
          ...potato,
          timeLeft: Math.max(0, potato.timeLeft - 1)
        };
      }));
      
      if (selectedPotato && potatoTimer > 0) {
        setPotatoTimer(prev => prev - 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [selectedPotato, potatoTimer, activePowerUps.freeze]);

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Sales': return '#FFCC00';
      case 'New Customer': return '#66B2FF';
      case 'Pre-Construction': return '#4A90E2';
      case 'Construction': return '#FF6B6B';
      case 'Post-Construction': return '#9B59B6';
      case 'Customer Satisfaction': return '#2ECC71';
      default: return '#002C54';
    }
  };

  const getTemperatureEmoji = (temp) => {
    if (temp > 80) return '🔥';
    if (temp > 60) return '🌶️';
    if (temp > 40) return '♨️';
    return '🫖';
  };

  const showPowerUpNotification = (message) => {
    setPowerUpNotification(message);
    setTimeout(() => setPowerUpNotification(null), 3000);
  };

  const awardPowerUp = (type, reason) => {
    setPowerUps(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
    showPowerUpNotification(`+1 ${type.charAt(0).toUpperCase() + type.slice(1)}! ${reason}`);
  };

  const handlePowerUp = (type) => {
    if (powerUps[type] > 0) {
      setPowerUps(prev => ({
        ...prev,
        [type]: prev[type] - 1
      }));
      
      // Apply power-up effects
      switch(type) {
        case 'shield':
          setActivePowerUps(prev => ({ ...prev, shield: true }));
          setTimeout(() => {
            setActivePowerUps(prev => ({ ...prev, shield: false }));
          }, 30000); // Shield lasts 30 seconds
          break;
        case 'boost':
          setActivePowerUps(prev => ({ ...prev, boost: true }));
          break;
        case 'freeze':
          // Freeze applies to the hottest task you own
          const myHottestPotato = hotPotatoes
            .filter(p => p.holder === currentUser)
            .sort((a, b) => b.temperature - a.temperature)[0];
          if (myHottestPotato) {
            setActivePowerUps(prev => ({ ...prev, freeze: myHottestPotato.id }));
            setTimeout(() => {
              setActivePowerUps(prev => ({ ...prev, freeze: null }));
            }, 60000); // Freeze lasts 60 seconds
          }
          break;
        default:
          break;
      }
      
      showPowerUpNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} activated!`);
    }
  };

  const handlePassPotato = (potato, toUser) => {
    const newPotatoes = hotPotatoes.map(p => {
      if (p.id === potato.id) {
        // Check for pass streak achievement
        if (p.lastPasser === currentUser) {
          setAchievementStats(prev => ({ ...prev, passStreak: prev.passStreak + 1 }));
          
          // Award shield for 5 passes in a row
          if (achievementStats.passStreak + 1 === 5) {
            awardPowerUp('shield', '5 passes in a row!');
            setAchievementStats(prev => ({ ...prev, passStreak: 0 }));
          }
        } else {
          setAchievementStats(prev => ({ ...prev, passStreak: 1 }));
        }
        
        return {
          ...p,
          holder: toUser,
          passCount: p.passCount + 1,
          lastPasser: currentUser,
          // Shield prevents temperature increase
          temperature: activePowerUps.shield ? p.temperature : Math.min(100, p.temperature + 5),
          combo: p.lastPasser === toUser ? p.combo + 1 : 0
        };
      }
      return p;
    });
    setHotPotatoes(newPotatoes);
    setShowPassModal(false);
    setSelectedPotato(null);
  };

  const handleCompletePotato = (potato) => {
    const temperatureBonus = potato.temperature > 80 ? 1.5 : 1;
    const boostBonus = activePowerUps.boost ? 2 : 1;
    const earnedValue = Math.round(potato.value * temperatureBonus * boostBonus);
    
    setHotPotatoes(hotPotatoes.filter(p => p.id !== potato.id));
    setCelebrationValue(earnedValue);
    setCelebrationBoost(activePowerUps.boost);
    setMyTotalRevenue(prev => prev + earnedValue);
    
    // Check achievements
    // Speed runner achievement - if potato has high time left when completed, it was done quickly
    if (potato.timeLeft > 90) { // Completed with more than 90 seconds remaining
      setAchievementStats(prev => ({ ...prev, speedRunner: prev.speedRunner + 1 }));
      if ((achievementStats.speedRunner + 1) % 3 === 0) {
        awardPowerUp('boost', '3 speed runs completed!');
      }
    }
    
    if (potato.difficulty === 'epic') {
      setAchievementStats(prev => ({ ...prev, epicCompleted: prev.epicCompleted + 1 }));
      awardPowerUp('freeze', 'Epic task completed!');
    }
    
    // Reset boost after use
    if (activePowerUps.boost) {
      setActivePowerUps(prev => ({ ...prev, boost: false }));
    }
    
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const handleCreatePotato = () => {
    setShowCreateModal(true);
  };

  const handleSubmitNewPotato = () => {
    const finalTitle = selectedEmoji ? `${selectedEmoji} ${newPotatoForm.title}` : `🥔 ${newPotatoForm.title}`;
    
    const newPotato = {
      id: `potato-${Date.now()}`,
      title: finalTitle,
      description: newPotatoForm.description,
      holder: newPotatoForm.holder,
      temperature: Math.floor(Math.random() * 40) + 30,
      passCount: 0,
      value: newPotatoForm.value,
      timeLeft: newPotatoForm.timeLeft,
      difficulty: newPotatoForm.value > 2000 ? "epic" : newPotatoForm.value > 1200 ? "rare" : "common",
      combo: 0,
      lastPasser: null,
      tags: [newPotatoForm.category.toLowerCase().replace(' ', '-'), "new"],
      category: newPotatoForm.category
    };
    
    setHotPotatoes([...hotPotatoes, newPotato]);
    setShowCreateModal(false);
    
    // Reset form
    setNewPotatoForm({
      title: '',
      description: '',
      category: 'Sales',
      holder: 'ilan',
      value: 1000,
      timeLeft: 120
    });
    setSelectedEmoji('');
  };

  const handleDragStart = (e, card, columnId) => {
    setDraggedCard({ card, fromColumn: columnId });
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    setDraggedOver(columnId);
  };

  const handleDragLeave = () => {
    setDraggedOver(null);
  };

  const handleDrop = (e, toColumnId) => {
    e.preventDefault();
    if (draggedCard && draggedCard.fromColumn !== toColumnId) {
      const newColumns = { ...boardColumns };
      newColumns[draggedCard.fromColumn].cards = newColumns[draggedCard.fromColumn].cards.filter(
        card => card.id !== draggedCard.card.id
      );
      newColumns[toColumnId].cards.push(draggedCard.card);
      setBoardColumns(newColumns);
    }
    setDraggedCard(null);
    setDraggedOver(null);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#FFCC00';
      case 'medium': return '#66B2FF';
      case 'low': return '#4A90E2';
      default: return '#002C54';
    }
  };

  const HotPotatoCard = ({ potato }) => {
    const isMyPotato = potato.holder === currentUser;
    const isFrozen = activePowerUps.freeze === potato.id;
    
    return (
      <div className="relative">
        <div style={{backgroundColor: getCategoryColor(potato.category)}} className={`p-1 rounded-lg ${isMyPotato ? 'ring-2 ring-yellow-400' : ''} ${isFrozen ? 'animate-pulse' : ''}`}>
          <div style={{backgroundColor: '#002C54'}} className="rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="absolute -top-2 -right-2 flex gap-2">
              {isFrozen && (
                <div className="text-lg font-bold px-2 py-1 rounded-full bg-blue-600 text-white">
                  ❄️
                </div>
              )}
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

            <div className="flex flex-wrap gap-1 sm:gap-2">
              {potato.tags.map((tag, idx) => (
                <span key={idx} className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full font-semibold">
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div style={{backgroundColor: '#66B2FF'}} className="rounded-lg p-2 sm:p-3">
                <div className="text-lg sm:text-xl font-bold text-white">${potato.value}</div>
                <div className="text-xs sm:text-sm text-white">Value</div>
              </div>
              <div style={{backgroundColor: '#66B2FF'}} className="rounded-lg p-2 sm:p-3">
                <div className="text-lg sm:text-xl font-bold text-white">{potato.passCount}</div>
                <div className="text-xs sm:text-sm text-white">Passes</div>
              </div>
              <div style={{backgroundColor: '#66B2FF'}} className="rounded-lg p-2 sm:p-3">
                <div className="text-lg sm:text-xl font-bold text-white flex items-center justify-center gap-1">
                  {isFrozen ? '❄️' : `${potato.timeLeft}s`}
                </div>
                <div className="text-xs sm:text-sm text-white">Time</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-300 font-semibold">Temperature</span>
                <span className="text-white font-bold flex items-center gap-1">
                  {potato.temperature}° {getTemperatureEmoji(potato.temperature)}
                  {isMyPotato && activePowerUps.shield && (
                    <span className="text-blue-400" title="Shield Active">🛡️</span>
                  )}
                </span>
              </div>
              <div className="w-full h-2 sm:h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${potato.temperature}%`, 
                    background: potato.temperature > 80 ? 
                      'linear-gradient(to right, #FFCC00, #FF6B6B)' : 
                      potato.temperature > 60 ? '#FFCC00' : '#66B2FF' 
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 sm:pt-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl">{teamStats[potato.holder].avatar}</span>
                <div>
                  <div className="text-sm sm:text-base font-bold text-white" style={{fontFamily: 'Montserrat, sans-serif'}}>{teamStats[potato.holder].name}</div>
                  <div className="text-xs sm:text-sm text-gray-300">
                    {potato.combo > 0 && `${potato.combo}x Combo! `}
                    {potato.lastPasser && `from ${teamStats[potato.lastPasser].name}`}
                  </div>
                </div>
              </div>
              
              {isMyPotato && (
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setSelectedPotato(potato);
                      setShowPassModal(true);
                    }}
                    style={{backgroundColor: '#FFCC00'}}
                    className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 text-black rounded-lg text-sm sm:text-base font-bold transition-all hover:opacity-80"
                  >
                    Pass! 🏃
                  </button>
                  <button
                    onClick={() => handleCompletePotato(potato)}
                    style={{backgroundColor: activePowerUps.boost ? '#FFCC00' : '#66B2FF'}}
                    className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-bold transition-all hover:opacity-80 ${
                      activePowerUps.boost ? 'text-black animate-pulse' : 'text-white'
                    }`}
                  >
                    Done! {activePowerUps.boost ? '⚡' : '✅'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MyStatsPanel = () => {
    const myStats = teamStats[currentUser];
    
    return (
      <div style={{backgroundColor: '#66B2FF'}} className="rounded-lg p-4 sm:p-6 text-white border-2 sm:border-4 border-blue-900 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-3">
          <div className="flex items-center gap-3 sm:gap-4 text-center sm:text-left">
            <span className="text-3xl sm:text-4xl">{myStats.avatar}</span>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold" style={{fontFamily: 'Montserrat, sans-serif'}}>{myStats.name}</h3>
              <p className="text-sm sm:text-base font-semibold">{myStats.title} • {myStats.speciality}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-bold" style={{fontFamily: 'Montserrat, sans-serif'}}>Lv.{myStats.level}</div>
            <div className="text-sm sm:text-base">{myStats.xp} XP</div>
            <button 
              onClick={() => setShowShopModal(true)}
              className="mt-1 text-xs sm:text-sm text-yellow-300 hover:text-yellow-400 underline flex items-center gap-1 ml-auto"
            >
              Power-up Shop 
              <span className="bg-yellow-400 text-black px-2 py-0.5 rounded-full font-bold">
                {powerUps.shield + powerUps.boost + powerUps.freeze}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <div style={{backgroundColor: '#002C54'}} className="rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2">🥔</div>
            <div className="text-lg sm:text-xl font-bold">{myStats.potatoesCompleted}</div>
            <div className="text-xs sm:text-sm">Completed</div>
          </div>
          <div style={{backgroundColor: '#002C54'}} className="rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2">🔥</div>
            <div className="text-lg sm:text-xl font-bold">{myStats.streak}</div>
            <div className="text-xs sm:text-sm">Day Streak</div>
          </div>
          <div style={{backgroundColor: '#002C54'}} className="rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2">💰</div>
            <div className="text-lg sm:text-xl font-bold">${(myTotalRevenue / 1000).toFixed(0)}k</div>
            <div className="text-xs sm:text-sm">Earned</div>
          </div>
          <div style={{backgroundColor: '#002C54'}} className="rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{myStats.powerUp}</div>
            <div className="text-lg sm:text-xl font-bold">x3</div>
            <div className="text-xs sm:text-sm">Power</div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4">
          <div className="text-sm sm:text-base mb-2 sm:mb-3 font-bold">Power-ups Available:</div>
          {/* Active Power-ups Display */}
          {(activePowerUps.shield || activePowerUps.boost || activePowerUps.freeze) && (
            <div className="mb-3 p-2 bg-yellow-400 bg-opacity-20 rounded-lg">
              <div className="text-xs sm:text-sm text-yellow-300 font-semibold mb-1">Active:</div>
              <div className="flex gap-2">
                {activePowerUps.shield && (
                  <span className="text-xs px-2 py-1 bg-blue-500 text-white rounded-full">🛡️ Shield Active</span>
                )}
                {activePowerUps.boost && (
                  <span className="text-xs px-2 py-1 bg-yellow-500 text-black rounded-full">⚡ 2x Boost Ready</span>
                )}
                {activePowerUps.freeze && (
                  <span className="text-xs px-2 py-1 bg-cyan-500 text-white rounded-full">❄️ Task Frozen</span>
                )}
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button 
              onClick={() => handlePowerUp('shield')}
              disabled={powerUps.shield === 0}
              style={{backgroundColor: '#002C54'}} 
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg hover:opacity-80 transition-all disabled:opacity-50"
            >
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-semibold">Shield ({powerUps.shield})</span>
            </button>
            <button 
              onClick={() => handlePowerUp('boost')}
              disabled={powerUps.boost === 0}
              style={{backgroundColor: '#002C54'}} 
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg hover:opacity-80 transition-all disabled:opacity-50"
            >
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-semibold">Boost ({powerUps.boost})</span>
            </button>
            <button 
              onClick={() => handlePowerUp('freeze')}
              disabled={powerUps.freeze === 0}
              style={{backgroundColor: '#002C54'}} 
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg hover:opacity-80 transition-all disabled:opacity-50"
            >
              <Timer className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-semibold">Freeze ({powerUps.freeze})</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const TaskCard = ({ card, columnId }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, card, columnId)}
      onDragEnd={() => setDraggedOver(null)}
      className="bg-white rounded-lg p-3 sm:p-4 cursor-move"
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <h4 className="font-bold text-black text-sm sm:text-base flex-1" style={{fontFamily: 'Montserrat, sans-serif'}}>{card.title}</h4>
        <button className="text-gray-500">
          <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {card.tags.map((tag, idx) => (
            <span key={idx} style={{backgroundColor: '#66B2FF'}} className="text-xs sm:text-sm px-2 sm:px-3 py-1 text-white rounded-full font-semibold">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-lg sm:text-xl">{card.assignee.avatar}</span>
            <span className="text-xs sm:text-sm text-black font-semibold">{card.assignee.name}</span>
          </div>
          <div style={{backgroundColor: getPriorityColor(card.priority)}} className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"></div>
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-1 sm:gap-2 text-gray-600">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-semibold">{card.dueDate}</span>
          </div>
          <div className="font-bold text-black">
            ${(card.revenue / 1000).toFixed(0)}k
          </div>
        </div>

        <div style={{backgroundColor: '#E5E5E5'}} className="w-full h-2 sm:h-3 rounded-full">
          <div 
            className="h-2 sm:h-3 rounded-full transition-all duration-300"
            style={{ width: `${card.progress}%`, backgroundColor: '#FFCC00' }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #66B2FF 0%, #002C54 100%)', fontFamily: 'Montserrat, sans-serif'}}>
      {powerUpNotification && (
        <div className="fixed top-4 right-4 bg-yellow-400 text-black px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-bold">{powerUpNotification}</span>
          </div>
        </div>
      )}

      {showCelebration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 sm:p-8 text-center">
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🎉</div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{color: '#002C54', fontFamily: 'Montserrat, sans-serif'}}>TASK COMPLETED!</h2>
            <p className="text-lg sm:text-xl" style={{color: '#66B2FF'}}>
              +${celebrationValue.toLocaleString()} earned! 🔥
            </p>
            {celebrationBoost && (
              <p className="text-sm sm:text-base mt-2" style={{color: '#FFCC00'}}>
                ⚡ 2x Boost Applied!
              </p>
            )}
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div style={{backgroundColor: '#002C54'}} className="rounded-lg p-4 sm:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6" style={{fontFamily: 'Montserrat, sans-serif'}}>Create New Task 🥔</h3>
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Choose Emoji</label>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 sm:gap-2 mb-3 p-2 sm:p-3 bg-gray-800 rounded-lg">
                  {popularEmojis.map((emoji, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`text-xl sm:text-2xl p-1 sm:p-2 rounded-lg transition-all hover:bg-gray-700 ${
                        selectedEmoji === emoji ? 'bg-yellow-500 bg-opacity-30 ring-2 ring-yellow-400' : ''
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">
                  Selected: <span className="text-lg sm:text-xl">{selectedEmoji}</span> 
                  {selectedEmoji && (
                    <button 
                      type="button"
                      onClick={() => setSelectedEmoji('')}
                      className="ml-2 text-red-400 hover:text-red-300"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Title</label>
                <div className="flex gap-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-lg flex items-center justify-center text-lg sm:text-xl">
                    {selectedEmoji || '🥔'}
                  </div>
                  <input
                    type="text"
                    value={newPotatoForm.title}
                    onChange={(e) => setNewPotatoForm({...newPotatoForm, title: e.target.value})}
                    placeholder="Call New Lead"
                    className="flex-1 p-2 sm:p-3 rounded-lg text-black font-medium text-sm sm:text-base"
                    style={{fontFamily: 'Montserrat, sans-serif'}}
                  />
                </div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">
                  Preview: {selectedEmoji || '🥔'} {newPotatoForm.title}
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Description</label>
                <textarea
                  value={newPotatoForm.description}
                  onChange={(e) => setNewPotatoForm({...newPotatoForm, description: e.target.value})}
                  placeholder="Follow up with Johnson family about their solar installation..."
                  className="w-full p-2 sm:p-3 rounded-lg text-black h-16 sm:h-20 resize-none text-sm sm:text-base"
                  style={{fontFamily: 'Montserrat, sans-serif'}}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Category</label>
                  <select
                    value={newPotatoForm.category}
                    onChange={(e) => setNewPotatoForm({...newPotatoForm, category: e.target.value})}
                    className="w-full p-2 sm:p-3 rounded-lg text-black font-medium text-sm sm:text-base"
                    style={{fontFamily: 'Montserrat, sans-serif'}}
                  >
                    <option value="Sales">Sales</option>
                    <option value="New Customer">New Customer</option>
                    <option value="Pre-Construction">Pre-Construction</option>
                    <option value="Construction">Construction</option>
                    <option value="Post-Construction">Post-Construction</option>
                    <option value="Customer Satisfaction">Customer Satisfaction</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Assign To</label>
                  <select
                    value={newPotatoForm.holder}
                    onChange={(e) => setNewPotatoForm({...newPotatoForm, holder: e.target.value})}
                    className="w-full p-2 sm:p-3 rounded-lg text-black font-medium text-sm sm:text-base"
                    style={{fontFamily: 'Montserrat, sans-serif'}}
                  >
                    {Object.entries(teamStats).map(([key, member]) => (
                      <option key={key} value={key}>
                        {member.avatar} {member.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Value ($)</label>
                  <input
                    type="number"
                    value={newPotatoForm.value}
                    onChange={(e) => setNewPotatoForm({...newPotatoForm, value: parseInt(e.target.value)})}
                    min="100"
                    max="5000"
                    className="w-full p-2 sm:p-3 rounded-lg text-black font-medium text-sm sm:text-base"
                    style={{fontFamily: 'Montserrat, sans-serif'}}
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Time (minutes)</label>
                  <input
                    type="number"
                    value={newPotatoForm.timeLeft}
                    onChange={(e) => setNewPotatoForm({...newPotatoForm, timeLeft: parseInt(e.target.value)})}
                    min="30"
                    max="480"
                    className="w-full p-2 sm:p-3 rounded-lg text-black font-medium text-sm sm:text-base"
                    style={{fontFamily: 'Montserrat, sans-serif'}}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4 sm:mt-6">
              <button
                onClick={handleSubmitNewPotato}
                disabled={!newPotatoForm.title || !newPotatoForm.description}
                style={{backgroundColor: '#FFCC00'}}
                className="flex-1 py-2 sm:py-3 text-black rounded-lg font-bold text-sm sm:text-base transition-all hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Task! 🔥
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{backgroundColor: '#66B2FF'}}
                className="flex-1 py-2 sm:py-3 text-white rounded-lg font-bold text-sm sm:text-base transition-all hover:opacity-80"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showPassModal && selectedPotato && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div style={{backgroundColor: '#002C54'}} className="rounded-lg p-4 sm:p-6 max-w-md w-full">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4" style={{fontFamily: 'Montserrat, sans-serif'}}>Pass the Task! 🥔</h3>
            <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">Choose who gets this task next:</p>
            <div className="space-y-2 sm:space-y-3">
              {Object.entries(teamStats).filter(([key]) => key !== currentUser && teamStats[key].status === 'active').map(([key, member]) => (
                <button
                  key={key}
                  onClick={() => handlePassPotato(selectedPotato, key)}
                  style={{backgroundColor: '#66B2FF'}}
                  className="w-full flex items-center justify-between p-3 sm:p-4 rounded-lg transition-all hover:opacity-80"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="text-xl sm:text-2xl">{member.avatar}</span>
                    <div className="text-left">
                      <div className="text-white font-bold text-sm sm:text-base">{member.name}</div>
                      <div className="text-xs sm:text-sm text-gray-200">{member.speciality}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowPassModal(false)}
              style={{backgroundColor: '#66B2FF'}}
              className="mt-3 sm:mt-4 w-full py-2 sm:py-3 text-white rounded-lg transition-all hover:opacity-80 font-bold text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showShopModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div style={{backgroundColor: '#002C54'}} className="rounded-lg p-4 sm:p-6 max-w-md w-full">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4" style={{fontFamily: 'Montserrat, sans-serif'}}>
              Power-up Shop 🛍️
            </h3>
            <div className="text-sm sm:text-base text-gray-300 mb-4">
              Your Balance: <span className="text-yellow-400 font-bold">${myTotalRevenue.toLocaleString()}</span>
            </div>
            
            <div className="space-y-3">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-blue-400" />
                    <div>
                      <div className="text-white font-bold">Shield</div>
                      <div className="text-xs text-gray-400">Prevents temperature increase</div>
                    </div>
                  </div>
                  <div className="text-yellow-400 font-bold">$2,000</div>
                </div>
                <button
                  onClick={() => {
                    if (myTotalRevenue >= 2000) {
                      setMyTotalRevenue(prev => prev - 2000);
                      awardPowerUp('shield', 'Purchased from shop!');
                    }
                  }}
                  disabled={myTotalRevenue < 2000}
                  style={{backgroundColor: '#FFCC00'}}
                  className="w-full py-2 text-black rounded-lg font-bold text-sm transition-all hover:opacity-80 disabled:opacity-50"
                >
                  Buy Shield
                </button>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-yellow-400" />
                    <div>
                      <div className="text-white font-bold">Boost</div>
                      <div className="text-xs text-gray-400">2x points on next completion</div>
                    </div>
                  </div>
                  <div className="text-yellow-400 font-bold">$1,500</div>
                </div>
                <button
                  onClick={() => {
                    if (myTotalRevenue >= 1500) {
                      setMyTotalRevenue(prev => prev - 1500);
                      awardPowerUp('boost', 'Purchased from shop!');
                    }
                  }}
                  disabled={myTotalRevenue < 1500}
                  style={{backgroundColor: '#FFCC00'}}
                  className="w-full py-2 text-black rounded-lg font-bold text-sm transition-all hover:opacity-80 disabled:opacity-50"
                >
                  Buy Boost
                </button>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Timer className="w-6 h-6 text-cyan-400" />
                    <div>
                      <div className="text-white font-bold">Freeze</div>
                      <div className="text-xs text-gray-400">Stops timer for 60 seconds</div>
                    </div>
                  </div>
                  <div className="text-yellow-400 font-bold">$2,500</div>
                </div>
                <button
                  onClick={() => {
                    if (myTotalRevenue >= 2500) {
                      setMyTotalRevenue(prev => prev - 2500);
                      awardPowerUp('freeze', 'Purchased from shop!');
                    }
                  }}
                  disabled={myTotalRevenue < 2500}
                  style={{backgroundColor: '#FFCC00'}}
                  className="w-full py-2 text-black rounded-lg font-bold text-sm transition-all hover:opacity-80 disabled:opacity-50"
                >
                  Buy Freeze
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowShopModal(false)}
              style={{backgroundColor: '#66B2FF'}}
              className="mt-4 w-full py-2 sm:py-3 text-white rounded-lg transition-all hover:opacity-80 font-bold text-sm sm:text-base"
            >
              Close Shop
            </button>
          </div>
        </div>
      )}

      <div className="p-3 sm:p-6">
        <div style={{backgroundColor: '#002C54'}} className="rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
            <div className="flex-shrink-0">
              <img 
                src="/images/firstlogo.png"
                alt="HOTPOTATO by SUNLAB" 
                className="h-12 w-auto sm:h-20"
              />
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
                selectedView === tab.id
                  ? 'text-black'
                  : 'text-white hover:opacity-80'
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
              <h2 className="text-2xl sm:text-3xl font-bold" style={{color: '#002C54', fontFamily: 'Montserrat, sans-serif'}}>
                Game Zone 🎮
              </h2>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">
                  Score: <span className="font-bold text-lg">{gameState.score}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Level: <span className="font-bold text-lg">{gameState.level}</span>
                </div>
              </div>
            </div>
            
            {/* Game Container - Ready for your game implementation */}
            <div id="game-container" className="w-full">
              <div className="border-2 border-dashed border-gray-300 rounded-lg min-h-[500px] flex items-center justify-center bg-gray-50">
                {!gameState.isPlaying ? (
                  <div className="text-center">
                    <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-semibold mb-4">Ready to Play?</p>
                    <button
                      onClick={startGame}
                      style={{backgroundColor: '#FFCC00'}}
                      className="px-6 py-3 text-black rounded-lg font-bold text-base transition-all hover:opacity-80"
                    >
                      Start Game 🎮
                    </button>
                    <p className="text-gray-400 text-sm mt-4">Your interactive game will appear here</p>
                  </div>
                ) : (
                  <div className="w-full h-full">
                    {/* 
                      GAME INTEGRATION POINT
                      =====================
                      Replace this div with your game component.
                      
                      Available props/functions:
                      - hotPotatoes: array of all tasks
                      - gameState: { isPlaying, score, level, gameData }
                      - updateGameScore(points): function to update score
                      - endGame(): function to end the game
                      - powerUps: current power-up counts
                      - myTotalRevenue: player's total earnings
                      
                      Example:
                      <YourGameComponent 
                        tasks={hotPotatoes}
                        onScoreUpdate={updateGameScore}
                        onGameEnd={endGame}
                        powerUps={powerUps}
                      />
                    */}
                    <div className="text-center p-8">
                      <p className="text-gray-500 text-lg mb-4">Game is running...</p>
                      <p className="text-gray-400 text-sm mb-4">Insert your game component here</p>
                      <button
                        onClick={endGame}
                        style={{backgroundColor: '#66B2FF'}}
                        className="mt-4 px-4 py-2 text-white rounded-lg font-bold text-sm transition-all hover:opacity-80"
                      >
                        End Game
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Game Stats/Controls Section */}
            <div id="game-controls" className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <div className="text-2xl mb-1">🏆</div>
                <div className="text-sm text-gray-600">High Score</div>
                <div className="text-xl font-bold">{Math.max(gameState.score, 0)}</div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <div className="text-2xl mb-1">🔥</div>
                <div className="text-sm text-gray-600">Tasks Used</div>
                <div className="text-xl font-bold">{hotPotatoes.length}</div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <div className="text-2xl mb-1">⚡</div>
                <div className="text-sm text-gray-600">Power-ups</div>
                <div className="text-xl font-bold">{powerUps.shield + powerUps.boost + powerUps.freeze}</div>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'list' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
              <MyStatsPanel />
              
              <div style={{backgroundColor: '#002C54'}} className="rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4" style={{fontFamily: 'Montserrat, sans-serif'}}>Today's Achievements</h3>
                <div className="space-y-3 sm:space-y-4">
                  {getAchievementsDisplay().map((achievement, idx) => (
                    <div key={idx} className="flex items-center gap-3 sm:gap-4">
                      <span className="text-2xl sm:text-3xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm sm:text-base text-white font-bold">{achievement.name}</div>
                        <div className="text-xs sm:text-sm text-gray-300">{achievement.description}</div>
                        <div className="mt-1 sm:mt-2 w-full h-2 bg-gray-700 rounded-full">
                          <div 
                            className="h-full rounded-full"
                            style={{ width: `${achievement.progress}%`, backgroundColor: '#FFCC00' }}
                          />
                        </div>
                      </div>
                      {achievement.progress === 100 && (
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" style={{color: '#FFCC00'}} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-1 lg:order-2">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white" style={{fontFamily: 'Montserrat, sans-serif'}}>Task List 🔥</h2>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1">Your tasks first, then sorted by temperature (hottest first)</p>
                </div>
                <button 
                  onClick={handleCreatePotato}
                  style={{backgroundColor: '#FFCC00'}} 
                  className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 text-black rounded-lg font-bold text-sm sm:text-base transition-all hover:opacity-80"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">New Task</span>
                  <span className="sm:hidden">New</span>
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {hotPotatoes
                  .sort((a, b) => {
                    // First, prioritize current user's potatoes
                    if (a.holder === currentUser && b.holder !== currentUser) return -1;
                    if (b.holder === currentUser && a.holder !== currentUser) return 1;
                    
                    // If both belong to current user or both don't, sort by temperature (hottest first)
                    return b.temperature - a.temperature;
                  })
                  .map((potato) => (
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
                    {hotPotatoes.filter(p => p.category === 'New Customer').length}
                  </div>
                  <div className="text-xs font-semibold">New</div>
                </div>
                <div style={{backgroundColor: '#4A90E2'}} className="rounded-lg p-2 sm:p-3 text-white text-center">
                  <div className="text-base sm:text-lg font-bold" style={{fontFamily: 'Montserrat, sans-serif'}}>
                    {hotPotatoes.filter(p => p.category === 'Pre-Construction').length}
                  </div>
                  <div className="text-xs font-semibold">Pre-Con</div>
                </div>
                <div style={{backgroundColor: '#FF6B6B'}} className="rounded-lg p-2 sm:p-3 text-white text-center">
                  <div className="text-base sm:text-lg font-bold" style={{fontFamily: 'Montserrat, sans-serif'}}>
                    {hotPotatoes.filter(p => p.category === 'Construction').length}
                  </div>
                  <div className="text-xs font-semibold">Build</div>
                </div>
                <div style={{backgroundColor: '#9B59B6'}} className="rounded-lg p-2 sm:p-3 text-white text-center">
                  <div className="text-base sm:text-lg font-bold" style={{fontFamily: 'Montserrat, sans-serif'}}>
                    {hotPotatoes.filter(p => p.category === 'Post-Construction').length}
                  </div>
                  <div className="text-xs font-semibold">Post</div>
                </div>
                <div style={{backgroundColor: '#2ECC71'}} className="rounded-lg p-2 sm:p-3 text-white text-center">
                  <div className="text-base sm:text-lg font-bold" style={{fontFamily: 'Montserrat, sans-serif'}}>
                    {hotPotatoes.filter(p => p.category === 'Customer Satisfaction').length}
                  </div>
                  <div className="text-xs font-semibold">Happy</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'leaderboard' && (
          <div className="space-y-4 sm:space-y-6">
            <div style={{backgroundColor: '#002C54'}} className="rounded-lg p-4 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center" style={{fontFamily: 'Montserrat, sans-serif'}}>🏆 Weekly Task Champions</h2>
              
              <div className="space-y-2 sm:space-y-3">
                {leaderboard.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg" style={{
                    backgroundColor: entry.rank === 1 ? '#FFCC00' : 
                                   entry.rank === 2 ? '#66B2FF' : 
                                   entry.rank === 3 ? '#4A90E2' : '#002C54'
                  }}>
                    <div className="text-xl sm:text-3xl font-bold text-white w-10 sm:w-12 text-center">
                      {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-1">
                      <span className="text-2xl sm:text-3xl">{entry.player.avatar}</span>
                      <div>
                        <div className="text-white font-bold text-sm sm:text-base" style={{fontFamily: 'Montserrat, sans-serif'}}>{entry.player.name}</div>
                        <div className="text-gray-300 text-xs sm:text-sm">{entry.player.speciality}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg sm:text-2xl font-bold text-white" style={{fontFamily: 'Montserrat, sans-serif'}}>{entry.potatoScore}</div>
                      <div className="text-xs sm:text-sm text-gray-300">{entry.weeklyPotatoes} tasks</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedView === 'board' && (
          <div>
            <p className="text-xs sm:text-sm text-gray-300 mb-3 text-center">Cards sorted by temperature within each column</p>
            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4">
              {Object.entries(boardColumns).map(([columnId, column]) => (
                <div
                  key={columnId}
                  className="flex-shrink-0 w-72 sm:w-80"
                  onDragOver={(e) => handleDragOver(e, columnId)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, columnId)}
                >
                  <div style={{backgroundColor: column.color}} className="rounded-t-lg p-3 sm:p-4">
                    <div className="flex items-center justify-between text-white">
                      <h3 className="font-bold text-base sm:text-lg" style={{fontFamily: 'Montserrat, sans-serif'}}>{column.title}</h3>
                      <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs sm:text-sm font-bold">
                        {column.cards.length}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`bg-gray-100 min-h-96 rounded-b-lg p-3 sm:p-4 space-y-3 transition-all ${
                    draggedOver === columnId ? 'ring-2 ring-yellow-400 bg-gray-200' : ''
                  }`}>
                    {column.cards.map((card) => (
                      <TaskCard key={card.id} card={card} columnId={columnId} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutiveDashboard;