import React from "react";
import { Check, Pencil, Trash2, CheckCircle } from "lucide-react";

const AddressCard = ({ address, onUpdate, onDelete, onSetDefault }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-100 hover:border-blue-200 transition-all duration-300 w-full">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="font-bold text-gray-800 flex items-center">
            {address.recipient_name}{" "}
            <span className="text-gray-300 mx-2">|</span>
            <span className="text-gray-500 text-sm">{address.phone}</span>
          </p>
          <p className="text-gray-600 mt-2 text-sm leading-relaxed">
            {address.address_line}, {address.ward}, {address.district},{" "}
            {address.city}
          </p>

          {address.is_default && (
            <span className="inline-flex items-center mt-2 px-2 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
              <CheckCircle className="w-3 h-3 mr-1" />
              Mặc định
            </span>
          )}
        </div>

        <div className="flex flex-col items-end space-y-2 ml-4">
          <button
            onClick={() => onUpdate(address.address_id)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center transition-colors duration-200"
          >
            <Pencil className="w-3 h-3 mr-1" />
            Cập nhật
          </button>

          <button
            onClick={() => onDelete(address.address_id)}
            className="text-gray-500 hover:text-red-600 text-sm font-medium flex items-center transition-colors duration-200"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Xóa
          </button>

          {!address.is_default && (
            <button
              onClick={() => onSetDefault(address.address_id)}
              className="text-gray-500 hover:text-green-600 text-sm font-medium flex items-center transition-colors duration-200"
            >
              <Check className="w-3 h-3 mr-1" />
              Thiết lập mặc định
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
