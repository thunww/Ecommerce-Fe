import React from 'react';
import { useEffect, useState } from 'react';
import productApi from '../../../../api/VendorAPI/productApi';


const EmptyState = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const response = await productApi.getAllProducts();
            setProducts(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        }
    };

    fetchProducts();
}, []);
  return (
    <div className="py-16 flex flex-col items-center justify-center border-b border-x rounded-b-lg bg-white">
      <div className="w-20 h-20 mb-4 text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p className="text-gray-500 mb-2">No orders found</p>
      <h2>Danh sách sản phẩm</h2>
            <ul>
                {products.map(product => (
                    <li key={product.id}>{product.name} - ${product.price}</li>
                ))}
            </ul>
      <button className="text-blue-500">Please try again</button>
    </div>
  );
};

export default EmptyState;
