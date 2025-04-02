import React from 'react';
import { FaBox } from 'react-icons/fa';

const NoProductFound = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-gray-500">
      <FaBox className="w-16 h-16 mb-4" />
      <h3 className="text-xl font-semibold mb-2">Không tìm thấy sản phẩm nào</h3>
      <p className="text-sm text-center">
        Bạn chưa có sản phẩm nào. Hãy thêm sản phẩm mới để bắt đầu bán hàng!
      </p>
    </div>
  );
};

export default NoProductFound; 