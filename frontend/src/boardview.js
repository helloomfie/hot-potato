import React, { useState, useEffect } from 'react';
import { MoreVertical, Calendar } from 'lucide-react';

const BoardView = ({ hotPotatoes, teamStats }) => {
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);
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
        color: "#4A90E2",
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
        color: "#002C54",
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
      default: return '#002C54';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#FFCC00';
      case 'medium': return '#66B2FF';
      case 'low': return '#4A90E2';
      default: return '#002C54';
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
      className="bg-white rounded-lg p-3 sm:p-4 cursor-move"
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <h4 className="font-bold text-black text-sm sm:text-base flex-1" style={{fontFamily: 'Montserrat, sans-serif'}}>
          {card.title}
        </h4>
        <button className="text-gray-500">
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
            <span className="text-xs sm:text-sm text-black font-semibold">{card.assignee.name}</span>
          </div>
          <div 
            style={{backgroundColor: getPriorityColor(card.priority)}} 
            className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
          ></div>
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
    <div>
      <p className="text-xs sm:text-sm text-gray-300 mb-3 text-center">
        Cards sorted by temperature within each column
      </p>
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
  );
};

export default BoardView;