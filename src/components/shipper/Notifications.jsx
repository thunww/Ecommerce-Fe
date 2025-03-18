import React from 'react';

const Notifications = ({ notifications = [] }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return '📦';
      case 'revenue':
        return '💰';
      case 'warning':
        return '⚠️';
      default:
        return '📢';
    }
  };

  return (
    <div className="fixed top-16 right-4 w-80 bg-white rounded-lg shadow-lg z-50">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-700">Thông báo</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-4 border-b hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-start">
                <span className="text-2xl mr-3">{getNotificationIcon(notification.type)}</span>
                <p className="text-sm text-gray-600">{notification.message}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">Không có thông báo mới</div>
        )}
      </div>
    </div>
  );
};

export default Notifications; 