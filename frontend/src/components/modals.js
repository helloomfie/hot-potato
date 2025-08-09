import React from 'react';

const Modals = ({ 
  showCelebration, 
  celebrationValue, 
  showPassModal, 
  selectedPotato, 
  teamStats, 
  currentUser, 
  handlePassPotato, 
  setShowPassModal 
}) => {
  return (
    <>
      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 sm:p-8 text-center">
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🎉</div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{color: '#002C54', fontFamily: 'Montserrat, sans-serif'}}>TASK COMPLETED!</h2>
            <p className="text-lg sm:text-xl" style={{color: '#66B2FF'}}>
              +${celebrationValue.toLocaleString()} earned! 🔥
            </p>
          </div>
        </div>
      )}

      {/* Pass Modal */}
      {showPassModal && selectedPotato && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div style={{backgroundColor: '#002C54'}} className="rounded-lg p-4 sm:p-6 max-w-md w-full">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4" style={{fontFamily: 'Montserrat, sans-serif'}}>Pass the Task! 🥔</h3>
            <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">Choose who gets this task next:</p>
            <div className="space-y-2 sm:space-y-3">
              {Object.entries(teamStats).filter(([key]) => key !== currentUser && teamStats[key].status === 'active').map(([key, member]) => (
                <button
                  key={key}
                  onClick={() => handlePassPotato(selectedPotato, key)}
                  style={{backgroundColor: '#66B2FF'}}
                  className="w-full flex items-center justify-between p-3 sm:p-4 rounded-lg transition-all hover:opacity-80"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="text-xl sm:text-2xl">{member.avatar}</span>
                    <div className="text-left">
                      <div className="text-white font-bold text-sm sm:text-base">{member.name}</div>
                      <div className="text-xs sm:text-sm text-gray-200">{member.speciality}</div>
                    </div>
                  </div>
                  <span className="text-white">→</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowPassModal(false)}
              style={{backgroundColor: '#66B2FF'}}
              className="mt-3 sm:mt-4 w-full py-2 sm:py-3 text-white rounded-lg transition-all hover:opacity-80 font-bold text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Modals;