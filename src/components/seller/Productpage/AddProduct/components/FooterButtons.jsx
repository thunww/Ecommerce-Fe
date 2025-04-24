import React from "react";
import { FaSave, FaCloudUploadAlt, FaTimesCircle } from "react-icons/fa";

const FooterButtons = ({ onCancel, onSaveAndPublish, onSaveAndDelist }) => {
  return (
    <div className="p-4 border-t flex justify-end space-x-4">
      <button
        className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2 hover:bg-gray-100 rounded transition-all"
        onClick={onCancel}
      >
        <FaTimesCircle />
        Cancel
      </button>
      <button
        className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center gap-2"
        onClick={onSaveAndDelist}
      >
        <FaSave />
        Save as Draft
      </button>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors shadow-md flex items-center gap-2"
        onClick={onSaveAndPublish}
      >
        <FaCloudUploadAlt />
        Publish Product
      </button>
    </div>
  );
};

export default FooterButtons;
