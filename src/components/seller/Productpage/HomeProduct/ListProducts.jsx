import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Edit,
  Trash2,
  Eye,
  Plus,
  Filter,
  Search,
  Package,
  Wallet,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import productApi from "../../../../api/VendorAPI/productApi";

const VendorProductManagement = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all"); // category name
  const [sortBy, setSortBy] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // New state for debounced search term
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [bestSeller, setBestSeller] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]); // To store fetched categories
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0,
    currentCount: 0,
  });

  // Debounce searchTerm
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 600); // 500ms debounce time

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productApi.getCategories(); // Use the provided endpoint
        if (response?.data?.success) {
          setCategoriesList(response.data.data);
        } else {
          console.error("Failed to fetch categories:", response?.data?.message);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  const fetchProducts = async (
    page,
    currentSearchTerm,
    currentCategoryId,
    currentSortBy
  ) => {
    try {
      setLoading(true);
      const response = await productApi.getProductsByShopId(
        page,
        pagination.limit, // Keep limit from state
        currentSearchTerm,
        currentCategoryId,
        currentSortBy
      );
      console.log("API Response:", response);

      if (response?.data?.success) {
        setProducts(response.data.data);
        setBestSeller(response.data.bestSeller);
        setLowStockProducts(response.data.lowStockProducts);
        setAllReviews(response.data.ALLReview || []);
        setPagination({
          page: response.data.pagination.page,
          limit: response.data.pagination.limit,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages,
          currentCount: response.data.pagination.currentCount,
        });
      } else {
        throw new Error(response?.data?.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load products on component mount and when filters/sort change
  useEffect(() => {
    const categoryObj = categoriesList.find(
      (cat) => cat.category_name === selectedCategory
    );
    const categoryIdToSend =
      selectedCategory === "all" ? null : categoryObj?.category_id;

    fetchProducts(1, debouncedSearchTerm, categoryIdToSend, sortBy);
  }, [debouncedSearchTerm, selectedCategory, sortBy, categoriesList]);

  // Handle page change
  const handlePageChange = (newPage) => {
    const categoryObj = categoriesList.find(
      (cat) => cat.category_name === selectedCategory
    );
    const categoryIdToSend =
      selectedCategory === "all" ? null : categoryObj?.category_id;
    fetchProducts(newPage, debouncedSearchTerm, categoryIdToSend, sortBy); // Use debounced search term
  };

  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const calculateDiscountedPrice = (price, discount) => {
    const originalPrice = parseFloat(price);
    const discountPercent = parseFloat(discount);
    return originalPrice * (1 - discountPercent / 100);
  };

  const toggleProductSelection = (productId) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const selectAllProducts = () => {
    if (selectedProducts.size === products.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(products.map((p) => p.id)));
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        const response = await productApi.deleteProduct(productId);
        console.log("Response từ API:", response);

        // Cập nhật lại danh sách sản phẩm sau khi xóa (áp dụng lại các filter hiện tại)
        const categoryObj = categoriesList.find(
          (cat) => cat.category_name === selectedCategory
        );
        const categoryIdToSend =
          selectedCategory === "all" ? null : categoryObj?.category_id;
        await fetchProducts(
          pagination.page,
          debouncedSearchTerm,
          categoryIdToSend,
          sortBy
        );

        // Hiển thị toast thành công
        toast.success("Xóa sản phẩm thành công!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        toast.error("Có lỗi xảy ra khi xóa sản phẩm", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) return;

    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa ${selectedProducts.size} sản phẩm đã chọn?`
      )
    ) {
      try {
        const response = await productApi.deleteProduct(
          Array.from(selectedProducts)
        );
        if (response.data.success) {
          // Cập nhật lại danh sách sản phẩm sau khi xóa (áp dụng lại các filter hiện tại)
          const categoryObj = categoriesList.find(
            (cat) => cat.category_name === selectedCategory
          );
          const categoryIdToSend =
            selectedCategory === "all" ? null : categoryObj?.category_id;
          fetchProducts(
            pagination.page,
            debouncedSearchTerm,
            categoryIdToSend,
            sortBy
          );
          setSelectedProducts(new Set());
          toast.success(
            `Đã xóa ${selectedProducts.size} sản phẩm thành công!`,
            {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
        } else {
          toast.error(
            response.data.message || "Có lỗi xảy ra khi xóa sản phẩm",
            {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
        }
      } catch (error) {
        console.error("Error deleting products:", error);
        toast.error(
          error.response?.data?.message || "Có lỗi xảy ra khi xóa sản phẩm",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0)
      return { status: "Out of Stock", color: "text-red-600 bg-red-50" };
    if (stock < 10)
      return { status: "Low Stock", color: "text-yellow-600 bg-yellow-50" };
    return { status: "In Stock", color: "text-green-600 bg-green-50" };
  };

  // Thêm hàm xử lý chuyển trang
  const handleAddProduct = () => {
    navigate("/vendor/products/add"); // Điều hướng đến trang thêm sản phẩm
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Error occurred</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Products Management
                  </h1>
                  <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-1"></div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddProduct} // Thêm onClick handler
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Product
                </button>
                {selectedProducts.size > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete Selected ({selectedProducts.size})
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Package className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {pagination.total}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      156.235.200 đ
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Best Seller</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {bestSeller?.name?.slice(0, 15) || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Low Stock</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {lowStockProducts.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-20">
            {/* Sidebar Filters */}
            <div className="lg:w-64 space-y-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </h3>

                {/* Search */}
                <div className="space-y-2 mb-4">
                  <label className="text-sm font-medium text-gray-700">
                    Search Products
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by name..."
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm text-gray-900"
                  >
                    <option value="all">All Categories</option>
                    {categoriesList.map((category) => (
                      <option
                        key={category.category_id}
                        value={category.category_name}
                      >
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Filter */}
                <div className="space-y-2 mt-4">
                  <label className="text-sm font-medium text-gray-700">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm text-gray-900"
                  >
                    <option value="name">Product Name</option>
                    <option value="price_asc">Price (Low to High)</option>
                    <option value="price_desc">Price (High to Low)</option>
                    <option value="bestselling">Best Selling</option>
                    <option value="stock_level">Stock Level</option>
                    <option value="highest_discount">Highest Discount</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1">
              {/* Bulk Actions */}
              {products.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={
                            selectedProducts.size === products.length &&
                            products.length > 0
                          }
                          onChange={selectAllProducts}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Select All ({products.length})
                        </span>
                      </label>
                    </div>
                    <div className="text-sm text-gray-500">
                      {selectedProducts.size} selected
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  const mainVariant = product.variants[0];
                  const originalPrice = parseFloat(mainVariant.price);
                  const discountedPrice = calculateDiscountedPrice(
                    mainVariant.price,
                    product.discount
                  );
                  const hasDiscount = parseFloat(product.discount) > 0;
                  const stockStatus = getStockStatus(mainVariant.stock);

                  return (
                    <div
                      key={product.id}
                      className={`bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 border-2 ${
                        selectedProducts.has(product.id)
                          ? "border-blue-500"
                          : "border-transparent"
                      }`}
                    >
                      {/* Product Image */}
                      <div className="relative overflow-hidden rounded-t-lg">
                        {/* Selection Checkbox */}
                        <div className="absolute top-2 left-2 z-10">
                          <input
                            type="checkbox"
                            checked={selectedProducts.has(product.id)}
                            onChange={() => toggleProductSelection(product.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>

                        <img
                          src={
                            product.variants[0]?.image ||
                            "https://via.placeholder.com/300x200?text=No+Image"
                          }
                          alt={product.name}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/300x200?text=No+Image";
                          }}
                        />

                        {/* Status Badges */}
                        <div className="absolute top-2 right-2 flex flex-col gap-1">
                          {hasDiscount && (
                            <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                              -{product.discount}%
                            </div>
                          )}
                          <div
                            className={`px-2 py-1 rounded-md text-xs font-semibold ${stockStatus.color}`}
                          >
                            {stockStatus.status}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <button className="p-2 bg-white text-gray-600 hover:text-blue-500 rounded-full shadow-md transition-colors duration-200">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/vendor/orders/edit/${product.id}`)
                            }
                            className="p-2 bg-white text-gray-600 hover:text-blue-500 rounded-full shadow-md transition-colors duration-200"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 bg-white text-gray-600 hover:text-red-500 rounded-full shadow-md transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        {/* Category & Sales */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                            {product.category?.name}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">
                            Sold: {product.sold}
                          </span>
                        </div>

                        {/* Product Name */}
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-5">
                          {product.name}
                        </h3>

                        {/* Product Details */}
                        <div className="text-xs text-gray-600 mb-3 space-y-1">
                          <div className="grid grid-cols-2 gap-2">
                            {mainVariant.color && (
                              <div>
                                <span className="text-gray-500">Color:</span>
                                <span className="font-medium ml-1">
                                  {mainVariant.color}
                                </span>
                              </div>
                            )}
                            {mainVariant.size && (
                              <div>
                                <span className="text-gray-500">Size:</span>
                                <span className="font-medium ml-1">
                                  {mainVariant.size}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-gray-500">Stock:</span>
                              <span
                                className={`font-medium ml-1 ${
                                  mainVariant.stock < 10
                                    ? "text-red-600"
                                    : "text-green-600"
                                }`}
                              >
                                {mainVariant.stock}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">SKU:</span>
                              <span className="font-medium ml-1">
                                {mainVariant.sku || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Pricing */}
                        <div className="mb-4">
                          {hasDiscount ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-green-600">
                                  {formatPrice(discountedPrice)}
                                </span>
                                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                  Save{" "}
                                  {formatPrice(originalPrice - discountedPrice)}
                                </span>
                              </div>
                              <div className="text-sm text-gray-500 line-through">
                                {formatPrice(originalPrice)}
                              </div>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">
                              {formatPrice(originalPrice)}
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              navigate(`/vendor/products/edit/${product.id}`)
                            }
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => navigate(`/product/${product.id}`)}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Empty State */}
              {products.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Package className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 mx-auto">
                    <Plus className="w-5 h-5" />
                    Add Your First Product
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {[...Array(pagination.totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg ${
                      pagination.page === index + 1
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          )}

          {/* Pagination Info */}
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing {pagination.currentCount} of {pagination.total} products
          </div>
        </div>

        {/* Best Seller Section */}
        {bestSeller && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="text-green-500 mr-2" />
              BEST SELLER PRODUCTS
            </h3>
            <div className="flex items-center gap-4">
              <img
                src={
                  bestSeller.variants[0]?.image ||
                  "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={bestSeller.name}
                className="w-24 h-24 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x200?text=No+Image";
                }}
              />
              <div>
                <h4 className="font-medium">{bestSeller.name}</h4>
                <p className="text-sm text-gray-600">
                  Sold: {bestSeller.sold} product
                </p>
                <div className="mt-2">
                  <p className="text-sm font-medium">Variants:</p>
                  {bestSeller.variants.map((variant) => (
                    <div key={variant.id} className="text-sm text-gray-600">
                      - {variant.color}{" "}
                      {variant.size ? `- ${variant.size}` : ""} - Remain:{" "}
                      {variant.stock}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Low Stock Section */}
        {lowStockProducts.length > 0 && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <AlertTriangle className="text-yellow-500 mr-2" />
              LOW STOCK PRODUCTS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        product.lowStockVariants[0]?.image ||
                        "https://via.placeholder.com/300x200?text=No+Image"
                      }
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{product.name}</h4>
                      {product.lowStockVariants.map((variant) => (
                        <div
                          key={variant.variantId}
                          className="text-sm text-red-500"
                        >
                          - {variant.color}{" "}
                          {variant.size ? `- ${variant.size}` : ""}: Remain{" "}
                          {variant.stock} product
                        </div>
                      ))}
                      <button
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Detail
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {allReviews.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <svg
                className="w-6 h-6 text-amber-400 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Evaluate products
            </h3>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allReviews.map((review) => (
                <div
                  key={review.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={
                        review.user?.profile_picture ||
                        "https://via.placeholder.com/64"
                      }
                      alt={review.user?.username}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {review.productName}
                      </h4>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, index) => (
                            <svg
                              key={index}
                              className={`w-4 h-4 ${
                                index < review.rating
                                  ? "text-amber-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {review.rating.toFixed(1)}/5
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="border-t pt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            {review.user?.username}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/product/${review.productId}`)}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    Detail product
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VendorProductManagement;
