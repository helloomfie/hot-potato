import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Award, Calendar, PiggyBank, Target } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const Bank = ({ teamStats, hotPotatoes, currentUser }) => {
  const [playerEarnings, setPlayerEarnings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [weeklyGoals] = useState({
    ilan: 15000,
    nas: 18000,
    juan: 12000,
    jessie: 14000,
    brandon: 16000
  });

  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        setLoading(true);
        
        // Fetch all users' earnings from backend
        const earningsResponse = await fetch(`${API_BASE_URL}/earnings/all`);
        if (!earningsResponse.ok) {
          throw new Error('Failed to fetch earnings data');
        }
        const earningsData = await earningsResponse.json();
        
        // Fetch potential earnings (for future use)
        const potentialResponse = await fetch(`${API_BASE_URL}/earnings/potential`);
        if (!potentialResponse.ok) {
          throw new Error('Failed to fetch potential earnings');
        }
        // const potentialData = await potentialResponse.json();
        
        setPlayerEarnings(earningsData.data || {});
        setError(null);
      } catch (error) {
        console.error('Error fetching earnings data:', error);
        setError(error.message);
        
        // Fallback to empty data if API fails
        setPlayerEarnings({});
      } finally {
        setLoading(false);
      }
    };

    fetchEarningsData();
    
    // Refresh earnings data every 30 seconds
    const interval = setInterval(fetchEarningsData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getDifficultyMultiplier = (difficulty) => {
    switch(difficulty) {
      case 'epic': return 3;
      case 'rare': return 2;
      case 'common': return 1;
      default: return 1;
    }
  };

  const calculatePotentialEarnings = () => {
    return hotPotatoes.reduce((total, task) => {
      const baseValue = task.value || 1000;
      const tempBonus = (task.temperature || 0) > 80 ? 1.5 : 1;
      const difficultyBonus = getDifficultyMultiplier(task.difficulty);
      return total + Math.round(baseValue * tempBonus * difficultyBonus);
    }, 0);
  };

  const getProgressToGoal = (playerId) => {
    const earnings = playerEarnings[playerId];
    const goal = weeklyGoals[playerId];
    if (!earnings || !goal) return 0;
    return Math.min(100, (earnings.thisWeek / goal) * 100);
  };

  const topEarners = Object.entries(playerEarnings)
    .map(([id, data]) => ({ id, ...data, player: teamStats[id] }))
    .sort((a, b) => b.thisWeek - a.thisWeek);

  const myEarnings = playerEarnings[currentUser] || {
    total: 0,
    thisWeek: 0,
    thisMonth: 0,
    completedTasks: 0,
    avgPerTask: 0,
    bestTask: 0
  };
  
  const myGoalProgress = getProgressToGoal(currentUser);

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div style={{backgroundColor: '#002C54'}} className="rounded-lg p-4 sm:p-6">
          <div className="text-white text-center">Loading earnings data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg">
          ⚠️ Error loading earnings: {error}. Showing limited data.
        </div>
      )}
      
      <div style={{backgroundColor: '#002C54'}} className="rounded-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-3" style={{fontFamily: 'Montserrat, sans-serif'}}>
          <PiggyBank className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
          My Earnings Dashboard
          <span className="text-sm font-normal text-gray-300">(Real-time from completed tasks)</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-green-500 rounded-lg p-3 sm:p-4 text-center text-white">
            <DollarSign className="w-6 h-6 mx-auto mb-2" />
            <div className="text-lg sm:text-2xl font-bold">${myEarnings.total?.toLocaleString() || 0}</div>
            <div className="text-xs sm:text-sm">Total Earned</div>
            <div className="text-xs opacity-75">{myEarnings.completedTasks || 0} tasks</div>
          </div>
          <div className="bg-blue-500 rounded-lg p-3 sm:p-4 text-center text-white">
            <Calendar className="w-6 h-6 mx-auto mb-2" />
            <div className="text-lg sm:text-2xl font-bold">${myEarnings.thisWeek?.toLocaleString() || 0}</div>
            <div className="text-xs sm:text-sm">This Week</div>
            <div className="text-xs opacity-75">{myEarnings.thisWeekTasks || 0} tasks</div>
          </div>
          <div className="bg-purple-500 rounded-lg p-3 sm:p-4 text-center text-white">
            <TrendingUp className="w-6 h-6 mx-auto mb-2" />
            <div className="text-lg sm:text-2xl font-bold">${myEarnings.avgPerTask?.toLocaleString() || 0}</div>
            <div className="text-xs sm:text-sm">Avg/Task</div>
            <div className="text-xs opacity-75">per completion</div>
          </div>
          <div className="bg-yellow-500 rounded-lg p-3 sm:p-4 text-center text-black">
            <Award className="w-6 h-6 mx-auto mb-2" />
            <div className="text-lg sm:text-2xl font-bold">${myEarnings.bestTask?.toLocaleString() || 0}</div>
            <div className="text-xs sm:text-sm">Best Task</div>
            <div className="text-xs opacity-75">highest earning</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-yellow-400" />
              Weekly Goal Progress
            </h3>
            <span className="text-yellow-400 font-bold">{myGoalProgress.toFixed(0)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${myGoalProgress}%`, 
                background: myGoalProgress >= 100 ? '#10B981' : myGoalProgress >= 75 ? '#F59E0B' : '#3B82F6'
              }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-300">
            <span>${myEarnings.thisWeek?.toLocaleString() || 0}</span>
            <span>${weeklyGoals[currentUser]?.toLocaleString() || 0}</span>
          </div>
          {myGoalProgress >= 100 && (
            <div className="text-center mt-2 text-green-400 font-bold">
              🎉 Goal Achieved! 🎉
            </div>
          )}
        </div>
      </div>

      <div style={{backgroundColor: '#002C54'}} className="rounded-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4" style={{fontFamily: 'Montserrat, sans-serif'}}>
          💰 Weekly Earnings Leaderboard
          <span className="text-sm font-normal text-gray-300 ml-2">(From archived tasks only)</span>
        </h3>
        
        <div className="space-y-3">
          {topEarners.length > 0 ? topEarners.map((earner, index) => (
            <div 
              key={earner.id} 
              className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg ${
                earner.id === currentUser ? 'ring-2 ring-yellow-400 bg-yellow-400 bg-opacity-10' : 'bg-gray-800'
              }`}
            >
              <div className="text-2xl font-bold text-white w-8 text-center">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
              </div>
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl">{earner.player?.avatar}</span>
                <div>
                  <div className="text-white font-bold">{earner.player?.name}</div>
                  <div className="text-gray-300 text-sm">{earner.completedTasks} tasks completed</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-bold text-lg">${earner.thisWeek.toLocaleString()}</div>
                <div className="text-gray-400 text-sm">this week</div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">${earner.total.toLocaleString()}</div>
                <div className="text-gray-400 text-sm">total</div>
              </div>
            </div>
          )) : (
            <div className="text-center text-gray-400 py-8">
              No earnings yet. Complete some tasks to start earning! 🚀
            </div>
          )}
        </div>
      </div>

      <div style={{backgroundColor: '#002C54'}} className="rounded-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2" style={{fontFamily: 'Montserrat, sans-serif'}}>
          🎯 Potential Earnings
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white text-center">
            <div className="text-2xl font-bold">${calculatePotentialEarnings().toLocaleString()}</div>
            <div className="text-sm opacity-90">Active Tasks Value</div>
            <div className="text-xs opacity-75 mt-1">{hotPotatoes.length} tasks available</div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white text-center">
            <div className="text-2xl font-bold">${hotPotatoes.filter(t => t.holder === currentUser).reduce((sum, t) => sum + (t.value || 1000), 0).toLocaleString()}</div>
            <div className="text-sm opacity-90">My Tasks Value</div>
            <div className="text-xs opacity-75 mt-1">{hotPotatoes.filter(t => t.holder === currentUser).length} assigned to me</div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white text-center">
            <div className="text-2xl font-bold">${hotPotatoes.filter(t => t.difficulty === 'epic').reduce((sum, t) => sum + (t.value || 1000) * 3, 0).toLocaleString()}</div>
            <div className="text-sm opacity-90">Epic Tasks Bonus</div>
            <div className="text-xs opacity-75 mt-1">{hotPotatoes.filter(t => t.difficulty === 'epic').length} epic tasks</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bank;