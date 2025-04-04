import React from "react";

const FooterButtons = ({ onCancel, onSaveAndPublish }) => {
  return (
    <div className="p-4 border-t flex justify-end space-x-4">
      <button
        className="px-4 py-2 text-gray-600 hover:text-gray-800"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
        Save and Delist
      </button>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={onSaveAndPublish}
      >
        Save and Publish
      </button>
    </div>
  );
};

export default FooterButtons;