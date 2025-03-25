// components/seller/RightSidebar.jsx
import React, { useState } from "react";
import Bell from "../../assets/image/bell.png";
import Message from "../../assets/image/message.jpg";
import Phone from "../../assets/image/phone.png";
import NotificationPanel from "../../components/seller/NotificationPanel";
import ChatPanel from "../../components/seller/ChatPanel";
import SupportPanel from "../../components/seller/SupportPanel";

const RightSidebar = ({ setIsSidebarOpen }) => {
  const [activePanel, setActivePanel] = useState(null);

  const handleTogglePanel = (panel) => {
    if (activePanel === panel) {
      setActivePanel(null);
      setIsSidebarOpen(false);
    } else {
      setActivePanel(panel);
      setIsSidebarOpen(true);
    }
  };

  return (
    <>
      {/* Icon Bar */}
      <div className="fixed top-16 right-0 h-screen w-16 bg-white shadow-lg border-l flex flex-col items-center py-4 space-y-10 z-50">
        <div 
          className={`relative cursor-pointer transition-transform hover:scale-110 ${activePanel === 'notifications' ? 'text-red-500' : ''}`}
          onClick={() => handleTogglePanel('notifications')}
        >
          <img src={Bell} alt="Notifications" className="w-8 h-8" />
          {activePanel === 'notifications' && <div className="absolute -left-1 -top-1 w-3 h-3 bg-red-500 rounded-full" />}
        </div>
        
        <div 
          className={`relative cursor-pointer transition-transform hover:scale-110 ${activePanel === 'support' ? 'text-red-500' : ''}`}
          onClick={() => handleTogglePanel('support')}
        >
          <img src={Phone} alt="Support" className="w-8 h-8" />
          {activePanel === 'support' && <div className="absolute -left-1 -top-1 w-3 h-3 bg-red-500 rounded-full" />}
        </div>
        
        <div 
          className={`relative cursor-pointer transition-transform hover:scale-110 ${activePanel === 'chat' ? 'text-red-500' : ''}`}
          onClick={() => handleTogglePanel('chat')}
        >
          <img src={Message} alt="Chat" className="w-8 h-8" />
          {activePanel === 'chat' && <div className="absolute -left-1 -top-1 w-3 h-3 bg-red-500 rounded-full" />}
        </div>
      </div>

      {/* Sliding Panel - Đã thay đổi width từ w-64 thành w-96 */}
      {activePanel && (
        <div className="fixed top-16 right-16 h-screen w-65 bg-white shadow-lg transition-all duration-300 ease-in-out z-40 border-l">
          <div className="h-full overflow-y-auto">
            {activePanel === 'notifications' && (
              <NotificationPanel onClose={() => handleTogglePanel('notifications')} />
            )}
            {activePanel === 'support' && (
              <SupportPanel onClose={() => handleTogglePanel('support')} />
            )}
            {activePanel === 'chat' && (
              <ChatPanel onClose={() => handleTogglePanel('chat')} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default RightSidebar;