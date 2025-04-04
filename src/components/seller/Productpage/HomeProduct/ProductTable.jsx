import React, { useState } from "react";
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

const ProductTable = ({ products, onProductChanged }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [actionDropdowns, setActionDropdowns] = useState({});
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

  const handleViewProduct = (productId) => {
    navigate(`/vendor/product/${productId}`);
    closeAllDropdowns();
  };

  const handleEditProduct = (productId) => {
    navigate(`/vendor/product/edit/${productId}`);
    closeAllDropdowns();
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (
      window.confirm(
        `Are you sure you want to delete the product "${productName}"?`
      )
    ) {
      try {
        await productService.deleteProduct(productId);
        toast.success("Product deleted successfully");

        // Call callback to update product list
        if (onProductChanged) {
          onProductChanged();
        }
      } catch (error) {
        toast.error(
          "Error deleting product: " +
            (error.response?.data?.message || error.message)
        );
      }
    }
    closeAllDropdowns();
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
      case "outOfStock":
        return "bg-red-100 text-red-800";
      case "violation":
        return "bg-purple-100 text-purple-800";
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
      case "outOfStock":
        return "Out of Stock";
      case "violation":
        return "Violation";
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
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={product.image}
                        alt={product.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
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
                            onClick={() => handleViewProduct(product.id)}
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
                              handleDeleteProduct(product.id, product.name)
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
    </div>
  );
};

export default ProductTable;
