import React, { useState } from "react";
import { FaInfoCircle, FaSort, FaEllipsisH, FaEye, FaEdit, FaTrashAlt, FaAngleDown, FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import productService from "../../../services/productService";

const ProductTable = ({ products, onProductChanged }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [actionDropdowns, setActionDropdowns] = useState({});
  const navigate = useNavigate();

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map(product => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const toggleActionDropdown = (productId) => {
    setActionDropdowns({
      ...actionDropdowns,
      [productId]: !actionDropdowns[productId]
    });
  };

  const closeAllDropdowns = () => {
    setActionDropdowns({});
  };

  // Đóng dropdown khi click ra ngoài
  const handleClickOutside = (e) => {
    if (!e.target.closest('.action-dropdown-container')) {
      closeAllDropdowns();
    }
  };

  // Thêm event listener khi component mount
  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleViewProduct = (productId) => {
    navigate(`/vendor/product/${productId}`);
    closeAllDropdowns();
  };

  const handleEditProduct = (productId) => {
    navigate(`/vendor/product/edit/${productId}`);
    closeAllDropdowns();
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}"?`)) {
      try {
        await productService.deleteProduct(productId);
        toast.success("Xóa sản phẩm thành công");
        
        // Gọi callback để cập nhật danh sách sản phẩm
        if (onProductChanged) {
          onProductChanged();
        }
      } catch (error) {
        toast.error("Lỗi khi xóa sản phẩm: " + (error.response?.data?.message || error.message));
      }
    }
    closeAllDropdowns();
  };

  const handleUpdateStatus = async (productId, status, productName) => {
    try {
      await productService.updateStatus(productId, status);
      toast.success(`Cập nhật trạng thái sản phẩm "${productName}" thành công`);
      
      // Gọi callback để cập nhật danh sách sản phẩm
      if (onProductChanged) {
        onProductChanged();
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật trạng thái: " + (error.response?.data?.message || error.message));
    }
    closeAllDropdowns();
  };

  const formatPrice = (price) => {
    return price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price) : 'N/A';
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'outOfStock':
        return 'bg-red-100 text-red-800';
      case 'violation':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Đang bán';
      case 'inactive':
        return 'Tạm ngưng';
      case 'outOfStock':
        return 'Hết hàng';
      case 'violation':
        return 'Vi phạm';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
        <div>
          <span className="font-medium">{products.length} Sản phẩm</span>
          <span className="ml-2 text-xs">Listing Limit: 1000</span>
          <FaInfoCircle className="inline-block ml-1 text-gray-400" />
        </div>
        <div className="flex space-x-2">
          <button className="px-2 py-1 border border-gray-300 rounded">
            <span className="sr-only">List view</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button className="px-2 py-1 border border-gray-300 rounded">
            <span className="sr-only">Grid view</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>
      </div>

      <table className="min-w-full border-collapse">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedProducts.length === products.length && products.length > 0}
              />
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sản phẩm
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center">
                Doanh số <FaInfoCircle className="ml-1" />
                <FaSort className="ml-1" />
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center">
                Giá bán <FaSort className="ml-1" />
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center">
                Tồn kho <FaInfoCircle className="ml-1" />
                <FaSort className="ml-1" />
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center">
                Trạng thái
              </div>
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <img 
                      src={product.image || 'https://via.placeholder.com/150'} 
                      alt={product.name} 
                      className="h-12 w-12 object-cover mr-4 rounded border border-gray-200"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        SKU: {product.sku || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.sales || 0}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatPrice(product.price)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.stock}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${getStatusBadgeClass(product.status)}`}>
                    {getStatusText(product.status)}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium relative">
                  <div className="flex justify-center action-dropdown-container">
                    <button 
                      onClick={() => toggleActionDropdown(product.id)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      <FaEllipsisH />
                    </button>
                    
                    {actionDropdowns[product.id] && (
                      <div className="absolute right-8 top-0 mt-8 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <ul className="py-1">
                          <li>
                            <button 
                              onClick={() => handleViewProduct(product.id)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <FaEye className="mr-2" /> Xem chi tiết
                            </button>
                          </li>
                          <li>
                            <button 
                              onClick={() => handleEditProduct(product.id)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <FaPen className="mr-2" /> Chỉnh sửa
                            </button>
                          </li>
                          <li>
                            <button 
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                              className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100 flex items-center"
                            >
                              <FaTrashAlt className="mr-2" /> Xóa
                            </button>
                          </li>
                          <li className="border-t border-gray-200 pt-1 mt-1">
                            <div className="relative px-4 py-2 text-sm">
                              <div className="w-full text-left text-gray-700 flex items-center">
                                <span>Trạng thái</span>
                                <FaAngleDown className="ml-auto" />
                              </div>
                              <div className="mt-2 w-full bg-white rounded-md">
                                <ul className="py-1">
                                  <li>
                                    <button 
                                      onClick={() => handleUpdateStatus(product.id, 'active', product.name)}
                                      className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-gray-100"
                                    >
                                      Đăng bán
                                    </button>
                                  </li>
                                  <li>
                                    <button 
                                      onClick={() => handleUpdateStatus(product.id, 'unpublished', product.name)}
                                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      Ngừng bán
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                Không có sản phẩm nào được tìm thấy
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable; 