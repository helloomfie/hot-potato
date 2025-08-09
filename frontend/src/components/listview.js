import React from 'react';
import { Plus } from 'lucide-react';
import { sortTasksByPriority } from '../data/tasks';
import HotPotatoCard from './hotpotatocard';

const ListView = ({ hotPotatoes, currentUser, teamStats, handleTaskClick, handleCompletePotato }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white" style={{fontFamily: 'Montserrat, sans-serif'}}>Task List 🔥</h2>
          <p className="text-xs sm:text-sm text-gray-300 mt-1">Your tasks first, then sorted by temperature (hottest first)</p>
        </div>
        <button 
          onClick={() => console.log('Create new task')}
          style={{backgroundColor: '#FFCC00'}} 
          className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 text-black rounded-lg font-bold text-sm sm:text-base transition-all hover:opacity-80"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">New Task</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {sortTasksByPriority(hotPotatoes, currentUser).map((potato) => (
          <HotPotatoCard 
            key={potato.id} 
            potato={potato} 
            currentUser={currentUser}
            teamStats={teamStats}
            handleTaskClick={handleTaskClick}
            handleCompletePotato={handleCompletePotato}
          />
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
            {hotPotatoes.filter(p => p.category === 'New Lead').length}
          </div>
          <div className="text-xs font-semibold">New Lead</div>
        </div>
        <div style={{backgroundColor: '#4A90E2'}} className="rounded-lg p-2 sm:p-3 text-white text-center">
          <div className="text-base sm:text-lg font-bold" style={{fontFamily: 'Montserrat, sans-serif'}}>
            {hotPotatoes.filter(p => p.category === 'New Customer').length}
          </div>
          <div className="text-xs font-semibold">New Customer</div>
        </div>
        <div style={{backgroundColor: '#FF6B6B'}} className="rounded-lg p-2 sm:p-3 text-white text-center">
          <div className="text-base sm:text-lg font-bold" style={{fontFamily: 'Montserrat, sans-serif'}}>
            {hotPotatoes.filter(p => p.category === 'Pre-Construction').length}
          </div>
          <div className="text-xs font-semibold">Pre-Construction</div>
        </div>
        <div style={{backgroundColor: '#9B59B6'}} className="rounded-lg p-2 sm:p-3 text-white text-center">
          <div className="text-base sm:text-lg font-bold" style={{fontFamily: 'Montserrat, sans-serif'}}>
            {hotPotatoes.filter(p => p.category === 'Construction').length}
          </div>
          <div className="text-xs font-semibold">Construction</div>
        </div>
        <div style={{backgroundColor: '#2ECC71'}} className="rounded-lg p-2 sm:p-3 text-white text-center">
          <div className="text-base sm:text-lg font-bold" style={{fontFamily: 'Montserrat, sans-serif'}}>
            {hotPotatoes.filter(p => p.category === 'Post Construction').length}
          </div>
          <div className="text-xs font-semibold">Post Construction</div>
        </div>
      </div>
    </div>
  );
};

export default ListView;