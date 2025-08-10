import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { createNewTask, popularEmojis, taskCategories } from '../data/tasks';

const TaskCreator = ({ isOpen, onClose, onCreateTask, teamStats }) => {
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Sales',
    holder: 'ilan',
    value: 1000,
    timeLeft: 120
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.description) return;
    
    const newTask = createNewTask(formData, selectedEmoji);
    onCreateTask(newTask);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      category: 'Sales',
      holder: 'ilan',
      value: 1000,
      timeLeft: 120
    });
    setSelectedEmoji('');
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div style={{backgroundColor: '#002C54'}} className="rounded-lg p-4 sm:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-white" style={{fontFamily: 'Montserrat, sans-serif'}}>
            Create New Task 🥔
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          {/* Emoji Selector */}
          <div>
            <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
              Choose Emoji
            </label>
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

          {/* Title */}
          <div>
            <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
              Title
            </label>
            <div className="flex gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-lg flex items-center justify-center text-lg sm:text-xl">
                {selectedEmoji || '🥔'}
              </div>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Call New Lead"
                className="flex-1 p-2 sm:p-3 rounded-lg text-black font-medium text-sm sm:text-base"
                style={{fontFamily: 'Montserrat, sans-serif'}}
              />
            </div>
            <div className="text-xs sm:text-sm text-gray-400 mt-1">
              Preview: {selectedEmoji || '🥔'} {formData.title}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Follow up with Johnson family about their solar installation..."
              className="w-full p-2 sm:p-3 rounded-lg text-black h-16 sm:h-20 resize-none text-sm sm:text-base"
              style={{fontFamily: 'Montserrat, sans-serif'}}
            />
          </div>

          {/* Category and Assignee */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full p-2 sm:p-3 rounded-lg text-black font-medium text-sm sm:text-base"
                style={{fontFamily: 'Montserrat, sans-serif'}}
              >
                {taskCategories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
                Assign To
              </label>
              <select
                value={formData.holder}
                onChange={(e) => handleInputChange('holder', e.target.value)}
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

          {/* Value and Time */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
                Value ($)
              </label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => handleInputChange('value', parseInt(e.target.value))}
                min="100"
                max="5000"
                step="100"
                className="w-full p-2 sm:p-3 rounded-lg text-black font-medium text-sm sm:text-base"
                style={{fontFamily: 'Montserrat, sans-serif'}}
              />
              <div className="text-xs text-gray-400 mt-1">
                Difficulty: {formData.value > 2000 ? 'Epic' : formData.value > 1200 ? 'Rare' : 'Common'}
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
                Time (minutes)
              </label>
              <input
                type="number"
                value={formData.timeLeft}
                onChange={(e) => handleInputChange('timeLeft', parseInt(e.target.value))}
                min="30"
                max="480"
                step="30"
                className="w-full p-2 sm:p-3 rounded-lg text-black font-medium text-sm sm:text-base"
                style={{fontFamily: 'Montserrat, sans-serif'}}
              />
              <div className="text-xs text-gray-400 mt-1">
                {Math.floor(formData.timeLeft / 60)}h {formData.timeLeft % 60}m
              </div>
            </div>
          </div>

          {/* Task Preview */}
          <div className="bg-gray-800 rounded-lg p-3 border-l-4 border-yellow-400">
            <div className="text-xs text-gray-400 mb-1">Preview:</div>
            <div className="text-white font-bold text-sm">
              {selectedEmoji || '🥔'} {formData.title || 'Task Title'}
            </div>
            <div className="text-gray-300 text-xs mt-1">
              {formData.description || 'Task description...'}
            </div>
            <div className="flex justify-between mt-2 text-xs">
              <span className="text-gray-400">{formData.category}</span>
              <span className="text-yellow-400">${formData.value}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4 sm:mt-6">
          <button
            onClick={handleSubmit}
            disabled={!formData.title || !formData.description}
            style={{backgroundColor: '#FFCC00'}}
            className="flex-1 py-2 sm:py-3 text-black rounded-lg font-bold text-sm sm:text-base transition-all hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Task! 🔥
          </button>
          <button
            onClick={onClose}
            style={{backgroundColor: '#66B2FF'}}
            className="flex-1 py-2 sm:py-3 text-white rounded-lg font-bold text-sm sm:text-base transition-all hover:opacity-80"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCreator;