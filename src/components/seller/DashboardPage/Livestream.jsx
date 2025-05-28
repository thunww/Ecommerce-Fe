import React, { useState } from "react";

const Livestream = () => {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleStartLivestream = () => {
    // Giả lập quá trình xử lý livestream
    setIsCompleted(true);
    
    // Sau 3 giây, reset lại trạng thái
    setTimeout(() => {
      setIsCompleted(false);
    }, 3000);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow border">
      <div className="flex justify-between">
        <h2 className="font-bold text-lg">Livestream</h2>
        
      </div>
      <div className="bg-orange-100 text-orange-700 p-2 rounded mt-2">
        <p className="font-bold">Start Livestream Now</p>
        <p>Increase your conversion rate by <span className="text-red-500">2x!</span></p>
      </div>
      
      {isCompleted ? (
        <div className="bg-green-100 text-green-700 p-2 rounded mt-2 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span className="font-bold">Complete</span>
        </div>
      ) : (
        <button 
          onClick={handleStartLivestream}
          className="bg-red-500 text-white px-4 py-2 rounded mt-2 hover:bg-red-600 transition-colors"
        >
          Start Livestream
        </button>
      )}
    </div>
  );
};

export default Livestream;