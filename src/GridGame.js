import React, { useState } from 'react';

// Simple 5x5 grid game starter
const GRID_SIZE = 5;

const GridGame = ({
  tasks = [],
  gameState = {},
  onScoreUpdate = () => {},
  onGameEnd = () => {},
  powerUps = {},
  myTotalRevenue = 0
}) => {
  // Example: track player position in the grid
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });

  // Handle arrow key movement
  const handleKeyDown = (e) => {
    let { x, y } = playerPos;
    if (e.key === 'ArrowUp' && y > 0) y--;
    if (e.key === 'ArrowDown' && y < GRID_SIZE - 1) y++;
    if (e.key === 'ArrowLeft' && x > 0) x--;
    if (e.key === 'ArrowRight' && x < GRID_SIZE - 1) x++;
    setPlayerPos({ x, y });
    // Example: update score on move
    onScoreUpdate(1);
  };

  // Focus the grid for keyboard input
  return (
    <div
      tabIndex={0}
      style={{
        outline: 'none',
        display: 'inline-block',
        margin: 20,
        border: '2px solid #ccc',
        padding: 10,
        borderRadius: 8,
        background: '#f9f9f9'
      }}
      onKeyDown={handleKeyDown}
    >
      <h3>Grid Game</h3>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 40px)` }}>
        {[...Array(GRID_SIZE * GRID_SIZE)].map((_, idx) => {
          const x = idx % GRID_SIZE;
          const y = Math.floor(idx / GRID_SIZE);
          const isPlayer = playerPos.x === x && playerPos.y === y;
          return (
            <div
              key={idx}
              style={{
                width: 38,
                height: 38,
                margin: 1,
                background: isPlayer ? '#ffd700' : '#eee',
                border: '1px solid #bbb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: isPlayer ? 'bold' : 'normal'
              }}
            >
              {isPlayer ? '🧑‍💻' : ''}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 10 }}>
        <button onClick={onGameEnd}>End Game</button>
      </div>
      <div style={{ marginTop: 10, fontSize: 14 }}>
        <strong>Score:</strong> {gameState.score} <br />
        <strong>Level:</strong> {gameState.level}
      </div>
    </div>
  );
};

export default GridGame;