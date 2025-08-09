import React from 'react';

const Header = ({ hotPotatoes, currentUser, currentTime }) => {
  return (
    <div className="p-3 sm:p-6">
      <div style={{backgroundColor: '#002C54'}} className="rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
          <div className="flex-shrink-0">
            <img src="/myimages/firstlogo.png" alt="HOTPOTATO by SUNLAB" className="h-12 w-auto sm:h-20" />
          </div>

          <div className="flex items-center gap-3 sm:gap-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white" style={{fontFamily: 'Montserrat, sans-serif'}}>{hotPotatoes.length}</div>
              <div className="text-gray-300 text-xs sm:text-base font-semibold">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white" style={{fontFamily: 'Montserrat, sans-serif'}}>
                {hotPotatoes.filter(p => p.holder === currentUser).length}
              </div>
              <div className="text-gray-300 text-xs sm:text-base font-semibold">Mine</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-3xl font-bold text-white" style={{fontFamily: 'Montserrat, sans-serif'}}>{currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
              <div className="text-gray-300 text-xs sm:text-base font-semibold">Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;