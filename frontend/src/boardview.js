import React, { useState, useEffect } from 'react';
import { MoreVertical, Calendar } from 'lucide-react';

const BoardView = ({ hotPotatoes, teamStats }) => {
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);
  const [boardColumns, setBoardColumns] = useState({
    inProgress: {
      title: "In Progress 🚀", 
      color: "#1E3A8A", // Deep blue
      cards: []
    },
    review: {
      title: "Review 👀",
      color: "#1E40AF", // Slightly different blue
      cards: []
    },
    completed: {
      title: "Completed ✅",
      color: "#1D4ED8", // Bright blue
      cards: []
    }
  });

  useEffect(() => {
    const updatedColumns = {
      inProgress: {
        title: "In Progress 🚀",
        color: "#1E3A8A", // Deep blue
        cards: hotPotatoes
          .filter(p => p.temperature <= 80)
          .sort((a, b) => b.temperature - a.temperature)
          .map(p => ({
            id: p.id,
            title: p.title,
            assignee: { 
              name: teamStats[p.holder]?.name || 'Unknown', 
              avatar: teamStats[p.holder]?.avatar || '👤' 
            },
            priority: p.difficulty === "epic" ? "high" : p.difficulty === "rare" ? "medium" : "low",
            revenue: p.value,
            dueDate: `${Math.ceil(p.timeLeft / 60)}h`,
            progress: Math.max(0, 100 - p.temperature),
            description: p.description,
            category: p.category
          }))
      },
      review: {
        title: "Review 👀",
        color: "#1E40AF", // Slightly different blue
        cards: hotPotatoes
          .filter(p => p.temperature > 80 && p.temperature < 95)
          .sort((a, b) => b.temperature - a.temperature)
          .map(p => ({
            id: p.id,
            title: p.title,
            assignee: { 
              name: teamStats[p.holder]?.name || 'Unknown', 
              avatar: teamStats[p.holder]?.avatar || '👤' 
            },
            priority: p.difficulty === "epic" ? "high" : p.difficulty === "rare" ? "medium" : "low",
            revenue: p.value,
            dueDate: `${Math.ceil(p.timeLeft / 60)}h`,
            progress: Math.max(0, 100 - p.temperature),
            description: p.description,
            category: p.category
          }))
      },
      completed: {
        title: "Completed ✅",
        color: "#1D4ED8", // Bright blue
        cards: hotPotatoes
          .filter(p => p.temperature >= 95)
          .sort((a, b) => b.temperature - a.temperature)
          .map(p => ({
            id: p.id,
            title: p.title,
            assignee: { 
              name: teamStats[p.holder]?.name || 'Unknown', 
              avatar: teamStats[p.holder]?.avatar || '👤' 
            },
            priority: p.difficulty === "epic" ? "high" : p.difficulty === "rare" ? "medium" : "low",
            revenue: p.value,
            dueDate: `${Math.ceil(p.timeLeft / 60)}h`,
            progress: 100,
            description: p.description,
            category: p.category
          }))
      }
    };
    setBoardColumns(updatedColumns);
  }, [hotPotatoes, teamStats]);

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Sales': return '#FFCC00';
      case 'New Lead': return '#66B2FF';
      case 'New Customer': return '#4A90E2';
      case 'Pre-Construction': return '#FF6B6B';
      case 'Construction': return '#9B59B6';
      case 'Post Construction': return '#2ECC71';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
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

  const TaskCard = ({ card, columnId }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, card, columnId)}
      onDragEnd={() => setDraggedOver(null)}
      className="bg-gray-800 rounded-lg p-3 sm:p-4 cursor-move border border-gray-700 hover:border-gray-600 transition-colors"
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <h4 className="font-bold text-white text-sm sm:text-base flex-1" style={{fontFamily: 'Montserrat, sans-serif'}}>
          {card.title}
        </h4>
        <button className="text-gray-400 hover:text-gray-300">
          <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-wrap gap-1 sm:gap-2">
          <span 
            style={{backgroundColor: getCategoryColor(card.category)}} 
            className="text-xs sm:text-sm px-2 sm:px-3 py-1 text-white rounded-full font-semibold"
          >
            {card.category}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-lg sm:text-xl">{card.assignee.avatar}</span>
            <span className="text-xs sm:text-sm text-gray-200 font-semibold">{card.assignee.name}</span>
          </div>
          <div 
            style={{backgroundColor: getPriorityColor(card.priority)}} 
            className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
          ></div>
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-1 sm:gap-2 text-gray-400">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-semibold">{card.dueDate}</span>
          </div>
          <div className="font-bold text-white">
            ${(card.revenue / 1000).toFixed(0)}k
          </div>
        </div>

        <div className="w-full h-2 sm:h-3 rounded-full bg-gray-700">
          <div 
            className="h-2 sm:h-3 rounded-full transition-all duration-300"
            style={{ width: `${card.progress}%`, backgroundColor: '#FFCC00' }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900 min-h-screen p-4">
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
                <h3 className="font-bold text-base sm:text-lg" style={{fontFamily: 'Montserrat, sans-serif'}}>
                  {column.title}
                </h3>
                <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs sm:text-sm font-bold">
                  {column.cards.length}
                </span>
              </div>
            </div>
            
            <div className={`bg-gray-800 min-h-96 rounded-b-lg p-3 sm:p-4 space-y-3 transition-all border-2 border-gray-700 ${
              draggedOver === columnId ? 'ring-2 ring-yellow-400 bg-gray-700' : ''
            }`}>
              {column.cards.map((card) => (
                <TaskCard key={card.id} card={card} columnId={columnId} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardView;