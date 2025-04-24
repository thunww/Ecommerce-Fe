import React from "react";

const NotificationPanel = ({ onClose }) => {
  return (
    <div className="fixed top-16 right-16 w-80 h-screen bg-white shadow-lg border-l p-4">
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-lg font-semibold">Notification</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-black">
          ✖
        </button>
      </div>
      <div className="mt-4 text-center text-gray-500">
        <p>You have not received any notification</p>
      </div>
    </div>
  );
};

export default NotificationPanel;
