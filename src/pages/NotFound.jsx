import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Trang bạn đang tìm kiếm không tồn tại</p>
        <Link
          to="/"
          className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
};

export default NotFound; 