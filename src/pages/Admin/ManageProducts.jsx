import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProducts,
  updateProductStatus,
  deleteProductById,
} from "../../redux/productSilce";
import { fetchAllShops } from "../../redux/shopSlice";
import Swal from "sweetalert2";
import {
  FaSearch,
  FaTrash,
  FaEye,
  FaBoxes,
  FaTag,
  FaCheck,
  FaShoppingCart,
  FaChevronDown,
  FaFilter,
} from "react-icons/fa";

import Table from "../../components/common/Table";

const ManageProducts = () => {
  const dispatch = useDispatch();
  const {
    products = [],
    loading,
    error,
  } = useSelector((state) => state.products);
  const [search, setSearch] = useState("");
  const { shops = [] } = useSelector((state) => state.shops);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchAllShops());
  }, [dispatch]);

  console.log(products);

  const filteredProducts =
    products?.filter((product) => {
      const matchesSearch = product.product_name
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || product.status === statusFilter;
      return matchesSearch && matchesStatus;
    }) ?? [];

  // Status options for dropdown
  const statusOptions = [
    {
      value: "all",
      label: "All Products",
      color: "gray",
      count: products.length,
    },
    {
      value: "active",
      label: "Active",
      color: "green",
      count: products.filter((p) => p.status === "active").length,
    },
    {
      value: "inactive",
      label: "Inactive",
      color: "red",
      count: products.filter((p) => p.status === "inactive").length,
    },
    {
      value: "pending",
      label: "Pending",
      color: "yellow",
      count: products.filter((p) => p.status === "pending").length,
    },
  ];

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCurrentStatusLabel = () => {
    const current = statusOptions.find(
      (option) => option.value === statusFilter
    );
    return current ? current.label : "All Products";
  };

  if (loading) {
    return <p className="text-blue-500 text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  const handleUpdateProductStatus = (product_id) => {
    Swal.fire({
      title: "Product Status",
      html: `
        <div class="mb-3">
          <p class="text-gray-700 mb-2">Select the status for this product:</p>
          <div class="flex flex-col gap-2">
            <label class="inline-flex items-center">
              <input type="radio" name="status" value="active" class="form-radio h-5 w-5 text-green-600" checked>
              <span class="ml-2 text-gray-700">Active</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" name="status" value="inactive" class="form-radio h-5 w-5 text-red-600">
              <span class="ml-2 text-gray-700">Inactive</span>
            </label>
          </div>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm Status",
      cancelButtonText: "Cancel",
      background: "#fff",
      borderRadius: "10px",
      focusConfirm: false,
      preConfirm: () => {
        return {
          status: document.querySelector('input[name="status"]:checked').value,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedStatus = result.value.status;

        dispatch(
          updateProductStatus({ productId: product_id, status: selectedStatus })
        )
          .unwrap()
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Status Updated!",
              text: `Product status has been set to ${selectedStatus.toUpperCase()}.`,
              confirmButtonColor: "#3085d6",
              timer: 2000,
              timerProgressBar: true,
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Update Failed!",
              text: error || "Failed to update product status.",
              confirmButtonColor: "#d33",
            });
          });
      }
    });
  };

  const handleDeleteProduct = (product_id) => {
    Swal.fire({
      title: "Delete Product",
      text: "Are you sure you want to delete this product? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#fff",
      borderRadius: "10px",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteProductById(product_id))
          .unwrap()
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "The product has been deleted successfully.",
              confirmButtonColor: "#3085d6",
              timer: 2000,
              timerProgressBar: true,
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Delete Failed!",
              text: error || "Failed to delete the product.",
              confirmButtonColor: "#d33",
            });
          });
      }
    });
  };

  const columns = [
    { header: "ID", field: "product_id" },
    {
      header: "Product Image",
      field: "variants",
      render: (_, product) => (
        <div className="flex justify-center">
          <img
            src={
              product.variants?.[0]?.image_url ||
              "https://th.bing.com/th/id/OIP.G_W3gQt1J0wtOMWzPkhH4QHaHa?rs=1&pid=ImgDetMain"
            }
            alt="Product"
            className="w-12 h-12 rounded object-cover border border-gray-300 shadow-sm"
          />
        </div>
      ),
    },
    { header: "Product Name", field: "product_name" },
    {
      header: "Shop",
      field: "shop_id",
      render: (shop_id) => {
        const shop = shops.find((s) => s.shop_id === shop_id);
        return shop ? shop.shop_name : "Unknown";
      },
    },
    {
      header: "Category",
      field: "Category",
      render: (product) => {
        return product?.category_name || "Unknown";
      },
    },
    { header: "Stock", field: "stock" },
    {
      header: "Status",
      field: "status",
      render: (_, product) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(
            product.status
          )}`}
        >
          {product.status || "Unknown"}
        </span>
      ),
    },
    {
      header: "Actions",
      field: "actions",
      render: (_, product) => (
        <div className="flex items-center justify-center space-x-2">
          <button
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg shadow-md transition duration-200 hover:scale-105"
            title="Update Product Status"
            onClick={() => handleUpdateProductStatus(product?.product_id)}
          >
            <FaCheck />
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-md transition duration-200 hover:scale-105"
            title="Delete Product"
            onClick={() => handleDeleteProduct(product?.product_id)}
          >
            <FaTrash />
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg shadow-md transition duration-200 hover:scale-105"
            title="View Details"
            onClick={() =>
              Swal.fire(
                "Product Details",
                `Details of ${product.product_name}`,
                "info"
              )
            }
          >
            <FaEye />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-full mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 p-4">
          <h2 className="text-2xl font-bold text-white">Products Management</h2>
          <p className="text-green-100 mt-1">Manage all listed products</p>
        </div>

        <div className="p-6">
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search bar */}
            <div className="flex-1 flex items-center bg-gray-100 p-4 rounded-xl shadow-sm border border-gray-200">
              <FaSearch className="text-gray-500 mr-3" />
              <input
                type="text"
                placeholder="Search by product name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-800 font-medium"
              />
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between bg-white border-2 border-gray-200 hover:border-blue-300 px-4 py-4 rounded-xl shadow-sm min-w-[200px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <div className="flex items-center">
                  <FaFilter className="text-gray-500 mr-2" />
                  <span className="text-gray-800 font-medium">
                    {getCurrentStatusLabel()}
                  </span>
                </div>
                <FaChevronDown
                  className={`text-gray-500 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setStatusFilter(option.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center justify-between ${
                        statusFilter === option.value
                          ? "bg-blue-50 border-r-2 border-blue-500"
                          : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <span
                          className={`w-3 h-3 rounded-full mr-3 ${
                            option.color === "green"
                              ? "bg-green-500"
                              : option.color === "red"
                              ? "bg-red-500"
                              : option.color === "yellow"
                              ? "bg-yellow-500"
                              : "bg-gray-500"
                          }`}
                        ></span>
                        <span className="font-medium text-gray-800">
                          {option.label}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          option.color === "green"
                            ? "bg-green-100 text-green-800"
                            : option.color === "red"
                            ? "bg-red-100 text-red-800"
                            : option.color === "yellow"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {option.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-100">
              <div className="flex items-center mb-2">
                <FaBoxes className="text-blue-500 text-xl mr-2" />
                <p className="text-blue-500 font-medium">Total Products</p>
              </div>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl shadow-sm border border-green-100">
              <div className="flex items-center mb-2">
                <FaTag className="text-green-500 text-xl mr-2" />
                <p className="text-green-500 font-medium">Available Products</p>
              </div>
              <p className="text-2xl font-bold">
                {products.filter((p) => p.stock > 0).length}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-xl shadow-sm border border-red-100">
              <div className="flex items-center mb-2">
                <FaShoppingCart className="text-red-500 text-xl mr-2" />
                <p className="text-red-500 font-medium">Pending Product</p>
              </div>
              <p className="text-2xl font-bold">
                {products.filter((p) => p.status === "pending").length}
              </p>
            </div>
          </div>

          {/* Active Filter Display */}
          {statusFilter !== "all" && (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">Filtered by:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeColor(
                  statusFilter
                )}`}
              >
                {getCurrentStatusLabel()}
              </span>
              <button
                onClick={() => setStatusFilter("all")}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Clear filter
              </button>
            </div>
          )}

          {/* Results count */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          {/* Table Component */}
          <Table columns={columns} data={filteredProducts} pageSize={10} />
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
