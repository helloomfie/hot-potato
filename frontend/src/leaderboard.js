import React from 'react';

const Leaderboard = ({ teamStats }) => {
  const leaderboard = [
    { rank: 1, player: teamStats.nas, potatoScore: 3421, weeklyPotatoes: 12 },
    { rank: 2, player: teamStats.brandon, potatoScore: 2983, weeklyPotatoes: 10 },
    { rank: 3, player: teamStats.ilan, potatoScore: 2847, weeklyPotatoes: 8 },
    { rank: 4, player: teamStats.jessie, potatoScore: 2654, weeklyPotatoes: 7 },
    { rank: 5, player: teamStats.juan, potatoScore: 2156, weeklyPotatoes: 5 }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div style={{backgroundColor: '#002C54'}} className="rounded-lg p-4 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center" style={{fontFamily: 'Montserrat, sans-serif'}}>
          🏆 Weekly Task Champions
        </h2>
        
        <div className="space-y-2 sm:space-y-3">
          {leaderboard.map((entry, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg border-2 border-gray-600" 
              style={{backgroundColor: '#002C54'}}
            >
              <div className="text-xl sm:text-3xl font-bold text-white w-10 sm:w-12 text-center">
                {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-1">
                <span className="text-2xl sm:text-3xl">{entry.player.avatar}</span>
                <div>
                  <div className="text-white font-bold text-sm sm:text-base" style={{fontFamily: 'Montserrat, sans-serif'}}>
                    {entry.player.name}
                  </div>
                  <div className="text-gray-300 text-xs sm:text-sm">{entry.player.speciality}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg sm:text-2xl font-bold text-white" style={{fontFamily: 'Montserrat, sans-serif'}}>
                  {entry.potatoScore}
                </div>
                <div className="text-xs sm:text-sm text-gray-300">{entry.weeklyPotatoes} tasks</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-yellow-400 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-sm text-black font-semibold">Top Performer</div>
            <div className="text-lg font-bold text-black">{teamStats.nas.name}</div>
          </div>
          <div className="bg-blue-500 rounded-lg p-3 sm:p-4 text-center text-white">
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-sm font-semibold">Hottest Streak</div>
            <div className="text-lg font-bold">{teamStats.nas.streak} days</div>
          </div>
          <div className="bg-green-500 rounded-lg p-3 sm:p-4 text-center text-white">
            <div className="text-2xl mb-1">⚡</div>
            <div className="text-sm font-semibold">Most Active</div>
            <div className="text-lg font-bold">{teamStats.nas.potatoesCompleted}</div>
          </div>
          <div className="bg-purple-500 rounded-lg p-3 sm:p-4 text-center text-white">
            <div className="text-2xl mb-1">📈</div>
            <div className="text-sm font-semibold">Total XP</div>
            <div className="text-lg font-bold">{Object.values(teamStats).reduce((sum, player) => sum + player.xp, 0)}</div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8">
          <h3 className="text-lg font-bold text-white mb-3" style={{fontFamily: 'Montserrat, sans-serif'}}>
            Team Performance This Week
          </h3>
          <div className="space-y-2">
            {Object.entries(teamStats).map(([key, player]) => (
              <div key={key} className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{player.avatar}</span>
                  <div>
                    <div className="text-white font-semibold text-sm">{player.name}</div>
                    <div className="text-gray-400 text-xs">{player.speciality}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">{player.potatoesCompleted}</div>
                  <div className="text-gray-400 text-xs">completed</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;