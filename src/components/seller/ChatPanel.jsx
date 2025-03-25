// components/seller/ChatPanel.jsx
import React from 'react';
import AIChatBox from './AIChatBox';

const ChatPanel = ({ onClose }) => {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-white"> {/* Thay đổi chiều cao */}
      <div className="p-4 border-b flex justify-between items-center bg-white">
        <h2 className="text-lg font-semibold">Chat</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 min-h-0"> {/* Thêm min-h-0 */}
        <AIChatBox />
      </div>
    </div>
  );
};

export default ChatPanel;