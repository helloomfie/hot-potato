import React from 'react';
import { Sparkles } from 'lucide-react';

const GameView = ({ gameState, startGame, endGame, hotPotatoes, currentUser }) => {
  return (
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
                className="px-8 py-2 text-black rounded-lg font-bold text-lg transition-all hover:opacity-80 hover:scale-105 shadow-lg"
              >
                Start Game 🎮
              </button>
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
                  style={{
                    maxWidth: '100%',
                    height: 'auto'
                  }}
                >
                  Your browser does not support the HTML5 canvas tag.
                </canvas>
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
  );
};

export default GameView;