import React, { useState, useEffect } from "react";
import {
  FaInfoCircle,
  FaSort,
  FaEllipsisH,
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaAngleDown,
  FaPen,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import productService from "../../../../services/productService";
import ConfirmDialog from "../../../ui/ConfirmDialog";
import ImageViewer from "../../../ui/ImageViewer";
import axios from "axios";
import { API_BASE_URL, IMAGE_PLACEHOLDER } from "../../../../config/config";
import useProductImages from "../../../../hooks/useProductImages";

const ProductTable = ({ products, onProductChanged }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [actionDropdowns, setActionDropdowns] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    productId: null,
    productName: "",
  });
  const [imageViewer, setImageViewer] = useState({
    isOpen: false,
    imageUrl: "",
    productName: "",
    images: [],
    productId: null,
  });

  // Sử dụng hook useProductImages thay vì quản lý state thủ công
  const productImagesHook = useProductImages();
  const navigate = useNavigate();

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map((product) => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const toggleActionDropdown = (productId) => {
    setActionDropdowns({
      ...actionDropdowns,
      [productId]: !actionDropdowns[productId],
    });
  };

  const closeAllDropdowns = () => {
    setActionDropdowns({});
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (!e.target.closest(".action-dropdown-container")) {
      closeAllDropdowns();
    }
  };

  // Add event listener when component mounts
  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleViewProduct = async (product) => {
    try {
      console.log("View product clicked:", product);

      // Đảm bảo product ID được xác định chính xác
      const productId = product.id || product.product_id;

      if (!productId) {
        console.error("Product ID is missing:", product);
        toast.error("Không thể mở ảnh: Thiếu thông tin sản phẩm");
        return;
      }

      // Mở ImageViewer với ảnh sản phẩm và truyền productId
      // Để ImageViewer tự lấy ảnh từ API
      setImageViewer({
        isOpen: true,
        imageUrl: product.image || IMAGE_PLACEHOLDER,
        productName: product.name || product.product_name || "Sản phẩm",
        images: [],
        productId: productId,
      });

      console.log("Image viewer opened with product ID:", productId);
    } catch (error) {
      console.error("Error in handleViewProduct:", error);
      toast.error("Đã xảy ra lỗi khi mở ảnh sản phẩm");
    }

    closeAllDropdowns();
  };

  const closeImageViewer = () => {
    setImageViewer({
      isOpen: false,
      imageUrl: "",
      productName: "",
      images: [],
      productId: null,
    });
  };

  const handleEditProduct = (productId) => {
    navigate(`/vendor/product/edit/${productId}`);
    closeAllDropdowns();
  };

  const showDeleteConfirm = (productId, productName) => {
    setDeleteConfirm({
      isOpen: true,
      productId,
      productName,
    });
    closeAllDropdowns();
  };

  const handleDeleteProduct = async () => {
    const { productId, productName } = deleteConfirm;

    try {
      await productService.deleteProduct(productId);
      toast.success(`Đã xóa sản phẩm "${productName}" thành công`);

      // Call callback to update product list
      if (onProductChanged) {
        onProductChanged();
      }
    } catch (error) {
      toast.error(
        "Lỗi khi xóa sản phẩm: " +
          (error.response?.data?.message || error.message)
      );
    }

    // Đóng dialog xác nhận
    setDeleteConfirm({
      isOpen: false,
      productId: null,
      productName: "",
    });
  };

  const cancelDelete = () => {
    setDeleteConfirm({
      isOpen: false,
      productId: null,
      productName: "",
    });
  };

  const handleUpdateStatus = async (productId, status, productName) => {
    try {
      await productService.updateStatus(productId, status);
      toast.success(`Product "${productName}" status updated successfully`);

      // Call callback to update product list
      if (onProductChanged) {
        onProductChanged();
      }
    } catch (error) {
      toast.error(
        "Error updating status: " +
          (error.response?.data?.message || error.message)
      );
    }
    closeAllDropdowns();
  };

  const formatPrice = (price) => {
    return price
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(price)
      : "N/A";
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <input
                  type="checkbox"
                  checked={selectedProducts.length === products.length}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Product
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                SKU
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Stock
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div
                      className="flex-shrink-0 h-14 w-14 cursor-pointer relative rounded-lg overflow-hidden border border-gray-200 group"
                      onClick={() => handleViewProduct(product)}
                    >
                      <img
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        src={product.image || IMAGE_PLACEHOLDER}
                        alt={product.name}
                        onError={(e) => {
                          console.error(
                            "Failed to load thumbnail:",
                            e.target.src
                          );
                          e.target.src = IMAGE_PLACEHOLDER;
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                        <FaEye className="text-white text-xl opacity-0 group-hover:opacity-100" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div
                        className="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer"
                        onClick={() => handleEditProduct(product.id)}
                      >
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.category}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.sku}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatPrice(product.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                      product.status
                    )}`}
                  >
                    {getStatusText(product.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative action-dropdown-container">
                    <button
                      onClick={() => toggleActionDropdown(product.id)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <FaEllipsisH />
                    </button>
                    {actionDropdowns[product.id] && (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div
                          className="py-1"
                          role="menu"
                          aria-orientation="vertical"
                        >
                          <button
                            onClick={() => handleViewProduct(product)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            <FaEye className="inline-block mr-2" /> View
                          </button>
                          <button
                            onClick={() => handleEditProduct(product.id)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            <FaEdit className="inline-block mr-2" /> Edit
                          </button>
                          <button
                            onClick={() =>
                              showDeleteConfirm(product.id, product.name)
                            }
                            className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            <FaTrashAlt className="inline-block mr-2" /> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Xác nhận xóa sản phẩm"
        message={`Bạn có chắc chắn muốn xóa sản phẩm "${deleteConfirm.productName}" không? Hành động này không thể hoàn tác.`}
        onConfirm={handleDeleteProduct}
        onCancel={cancelDelete}
      />

      {/* Image Viewer */}
      {imageViewer.isOpen && (
        <ImageViewer
          isOpen={imageViewer.isOpen}
          imageUrl={imageViewer.imageUrl}
          productName={imageViewer.productName}
          productId={imageViewer.productId}
          onClose={closeImageViewer}
        />
      )}
    </div>
  );
};

export default ProductTable;
