import React from "react";
import { FaPlus, FaCog, FaAngleDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProductHeader = ({ shopId }) => {
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate(`/vendor/product/add`);
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800">My Products</h1>
      
      <div className="flex space-x-2">
        <div className="relative">
          <button className="px-3 py-2 border border-gray-300 rounded-md bg-white flex items-center text-sm">
            <FaCog className="mr-2 text-gray-500" />
            <span>Product Settings</span>
            <FaAngleDown className="ml-2 text-gray-500" />
          </button>
          {/* Dropdown menu would go here */}
        </div>
        
        <div className="relative">
          <button className="px-3 py-2 border border-gray-300 rounded-md bg-white flex items-center text-sm">
            <span>Mass Function</span>
            <FaAngleDown className="ml-2 text-gray-500" />
          </button>
          {/* Dropdown menu would go here */}
        </div>
        
        <button 
          className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md flex items-center text-sm"
          onClick={handleAddProduct}
        >
          <FaPlus className="mr-2" />
          <span>Add a New Product</span>
        </button>
      </div>
    </div>
  );
};

export default ProductHeader; 