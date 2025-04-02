import React from "react";
import { FaPlus, FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProductHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Sản phẩm của tôi</h1>
        
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/vendor/product/add')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            Thêm sản phẩm
          </button>
          
          <button
            onClick={() => navigate('/vendor/products/settings')}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FaCog className="mr-2" />
            Cài đặt
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader; 