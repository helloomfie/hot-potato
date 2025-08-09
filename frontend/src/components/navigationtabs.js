import React from 'react';
import { Flame, Trophy, Activity, Sparkles, PiggyBank } from 'lucide-react';

const NavigationTabs = ({ selectedView, setSelectedView }) => {
  const tabs = [
    { id: 'game', label: 'Game', icon: Sparkles },
    { id: 'list', label: 'List', icon: Flame },
    { id: 'board', label: 'Board', icon: Activity },
    { id: 'leaderboard', label: 'Leaders', icon: Trophy },
    { id: 'bank', label: 'Bank', icon: PiggyBank }
  ];

  return (
    <div className="px-3 sm:px-6 mb-4 sm:mb-6">
      <div style={{backgroundColor: '#002C54'}} className="flex flex-col sm:flex-row gap-2 rounded-lg p-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedView(tab.id)}
            className={`flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-all ${
              selectedView === tab.id ? 'text-black' : 'text-white hover:opacity-80'
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
  );
};

export default NavigationTabs;