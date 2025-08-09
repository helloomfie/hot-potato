import React from 'react';

const HotPotatoCard = ({ potato, currentUser, teamStats, handleTaskClick, handleCompletePotato }) => {
  const isMyPotato = potato.holder === currentUser;
  
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

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'epic': return '#FF0080';
      case 'rare': return '#9B59B6';
      case 'common': return '#66B2FF';
      default: return '#66B2FF';
    }
  };

  const getDifficultyEmoji = (difficulty) => {
    switch(difficulty) {
      case 'epic': return '🔥';
      case 'rare': return '⭐';
      case 'common': return '💧';
      default: return '💧';
    }
  };

  const getTemperatureEmoji = (temp) => {
    if (temp > 80) return '🔥';
    if (temp > 60) return '🌶️';
    if (temp > 40) return '♨️';
    return '🫖';
  };

  return (
    <div className="relative">
      <div style={{backgroundColor: getCategoryColor(potato.category)}} className={`p-1 rounded-lg ${isMyPotato ? 'ring-2 ring-yellow-400' : ''}`}>
        <div style={{backgroundColor: '#002C54'}} className="rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="absolute -top-2 -right-2 flex gap-2">
            {(potato.temperature || 0) >= 90 && (
              <div className="text-lg font-bold px-2 py-1 rounded-full bg-red-600 text-white animate-pulse">
                {getTemperatureEmoji(potato.temperature || 0)}
              </div>
            )}
            {potato.difficulty && (
              <div className="text-lg font-bold px-2 py-1 rounded-full text-white" style={{backgroundColor: getDifficultyColor(potato.difficulty)}}>
                {getDifficultyEmoji(potato.difficulty)}
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
                {Math.round(potato.temperature || 0)}° {getTemperatureEmoji(potato.temperature || 0)}
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
                  {(potato.combo || 0) > 0 && `${potato.combo}x Combo! `}
                  {potato.lastPasser && `from ${teamStats[potato.lastPasser]?.name || 'Unknown'}`}
                </div>
              </div>
            </div>
            
            {isMyPotato && (
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleTaskClick(potato)}
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

export default HotPotatoCard;