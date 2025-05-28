import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Star,
  Package,
  Eye,
  TrendingUp,
  Edit,
  MoreHorizontal,
  AlertCircle,
  CheckCircle,
  ShoppingBag,
  ArrowLeft,
  Heart,
  Share2,
  Truck,
  Shield,
  Award,
  Tag,
  Users,
  BarChart3,
  Zap,
  Clock,
  Globe,
  Camera,
  Filter,
  Search,
  Download,
  RefreshCw,
} from "lucide-react";
import orderApi from "../../../api/VendorAPI/orderApi";

const DetailOrder = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [viewMode] = useState("grid"); // grid, list
  const [filterCategory] = useState("all");

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const productIds = searchParams.get("productIds")?.split(",") || [];
        const variantIds = searchParams.get("variantIds")?.split(",") || [];

        console.log("Product IDs from URL:", productIds);
        console.log("Variant IDs from URL:", variantIds);

        if (productIds.length === 0 || variantIds.length === 0) {
          throw new Error("No product information found in URL");
        }

        const response = await orderApi.getProductsDetailByIds(
          productIds.join(","),
          variantIds.join(",")
        );

        console.log("Full API Response:", response);

        // Check if response and expected data structure are present and data is an array
        if (
          response &&
          response.data &&
          response.data.success &&
          Array.isArray(response.data.data)
        ) {
          setProducts(response.data.data);

          // Initialize selectedVariants for each product
          const initialSelectedVariants = {};
          response.data.data.forEach((product) => {
            if (product.variants && product.variants.length > 0) {
              // Find variant matching variantId from URL
              const variantIndex = product.variants.findIndex((variant) =>
                variantIds.includes(variant.variant_id.toString())
              );
              initialSelectedVariants[product.product_id] =
                variantIndex >= 0 ? variantIndex : 0;
            }
          });
          setSelectedVariants(initialSelectedVariants);
        } else if (response && response.data && response.data.message) {
          // If there's a specific error message from the API
          throw new Error(response.data.message);
        } else {
          // Generic error if the expected structure is not found
          throw new Error("Invalid product data received from server");
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError(err.message || "Error loading product information");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [searchParams]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-amber-400/50 text-amber-400" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-slate-300" />
      );
    }

    return stars;
  };

  const getStockStatus = (stock) => {
    if (stock > 50)
      return {
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        text: "In Stock",
        icon: CheckCircle,
      };
    if (stock > 20)
      return {
        color: "text-amber-700 bg-amber-50 border-amber-200",
        text: "Low Stock",
        icon: Clock,
      };
    if (stock > 0)
      return {
        color: "text-red-700 bg-red-50 border-red-200",
        text: "Very Low Stock",
        icon: AlertCircle,
      };
    return {
      color: "text-slate-700 bg-slate-50 border-slate-200",
      text: "Out of Stock",
      icon: AlertCircle,
    };
  };

  const getDiscountBadge = (discount) => {
    if (discount > 0) {
      return (
        <div className="absolute top-4 left-4 z-20">
          <div className="relative bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full shadow-md">
            <div className="flex items-center space-x-1">
              <Zap className="w-3 h-3" />
              <span className="text-sm font-bold">-{discount}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-lg shadow-lg p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-800">Loading Data...</h3>
          <p className="text-gray-600 mt-2">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-red-50 to-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Oops! Error</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors duration-200"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="w-5 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Header */}
      <header className=" bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200"
                aria-label="Go back"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Product Details</h2>
                <p className="text-gray-600 mt-1">Manage and track your products professionally</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span className="text-sm font-medium">{products.length} Products</span>
              </div>
              <button
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                aria-label="Refresh product data"
              >
                <RefreshCw className="w-5 h-4" />
              </button>
              <button
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                aria-label="Download product data"
              >
                <Download className="w-5 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.map((product) => {
          const selectedVariantIndex = selectedVariants[product.product_id] || 0;
          const selectedVariant = product.variants?.[selectedVariantIndex];
          const stockStatus = getStockStatus(product.stock);

          return (
            <div
              key={product.product_id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-6">
                {/* Product Image Section */}
                <div className="lg:col-span-2">
                  <div className="relative">
                    {getDiscountBadge(product.discount)}
                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden group mb-4">
                      <img
                        src={selectedVariant?.image_url || product.image_url}
                        alt={product.product_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                          <button
                            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                            aria-label="View image"
                          >
                            <Camera className="w-5 h-4 text-gray-700" />
                          </button>
                          <button
                            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                            aria-label="Preview product"
                          >
                            <Eye className="w-5 h-4 text-gray-700" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {product.variants && product.variants.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {product.variants.slice(0, 4).map((variant, index) => (
                          <div
                            key={variant.variant_id}
                            onClick={() =>
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [product.product_id]: index,
                              }))
                            }
                            className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                              selectedVariantIndex === index
                                ? "border-blue-500 shadow-md"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <img
                              src={variant.image_url}
                              alt={`${variant.size} - ${variant.color}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Info Section */}
                <div className="lg:col-span-3 space-y-6">
                  {/* Category & Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                        {product.Category?.category_name || "Uncategorized"}
                      </span>
                      <div
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full border ${stockStatus.color}`}
                      >
                        <stockStatus.icon className="w-4 h-4" />
                        <span className="text-sm">{stockStatus.text}</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Title */}
                  <h3 className="text-2xl font-bold text-gray-900">{product.product_name}</h3>

                  {/* Description */}
                  <p className="text-gray-600">{product.description || "No description available."}</p>

                  {/* Rating */}
                  {product.average_rating && (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">{renderStars(parseFloat(product.average_rating))}</div>
                      <span className="text-gray-900 font-medium">{parseFloat(product.average_rating).toFixed(1)}</span>
                      <span className="text-gray-500">({product.review_count || 0} reviews)</span>
                    </div>
                  )}

                  {/* Price Section */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Price</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-blue-600">
                            {formatPrice(selectedVariant?.price || product.price)}
                          </span>
                          {product.discount > 0 && (
                            <span className="text-gray-500 line-through">
                              {formatPrice(
                                (selectedVariant?.price || product.price) * (1 + product.discount / 100)
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      {product.discount > 0 && (
                        <div className="text-right">
                          <p className="text-gray-600 text-sm">Savings</p>
                          <span className="text-lg font-bold text-red-600">
                            {formatPrice(
                              (selectedVariant?.price || product.price) * (product.discount / 100)
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-emerald-50 rounded-lg p-4 text-center">
                      <TrendingUp className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                      <p className="text-lg font-bold text-emerald-700">{product.sold.toLocaleString()}</p>
                      <p className="text-sm text-emerald-600">Sold</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <Package className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-lg font-bold text-blue-700">{product.stock.toLocaleString()}</p>
                      <p className="text-sm text-blue-600">Stock</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <p className="text-lg font-bold text-purple-700">{product.variants?.length || 1}</p>
                      <p className="text-sm text-purple-600">Variants</p>
                    </div>
                  </div>

                  {/* Variants Section */}
                  {product.variants && product.variants.length > 0 && (
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <Package className="w-5 h-4 mr-2" />
                        Product Variants
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {product.variants.map((variant, index) => (
                          <div
                            key={variant.variant_id}
                            onClick={() =>
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [product.product_id]: index,
                              }))
                            }
                            className={`cursor-pointer p-4 rounded-lg border transition-all duration-200 ${
                              selectedVariantIndex === index
                                ? "border-blue-500 bg-blue-50 shadow-md"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">{variant.size}</span>
                                <div
                                  className="w-5 h-4 rounded-full border border-gray-300"
                                  style={{ backgroundColor: variant.color?.toLowerCase() }}
                                  title={variant.color}
                                />
                              </div>
                              <span className="font-medium text-gray-900">{formatPrice(parseFloat(variant.price))}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span className="bg-gray-100 px-2 py-1 rounded-full">{variant.material}</span>
                              <span
                                className={`px-2 py-1 rounded-full ${
                                  variant.stock > 50
                                    ? "bg-emerald-100 text-emerald-700"
                                    : variant.stock > 20
                                    ? "bg-amber-100 text-amber-700"
                                    : variant.stock > 0
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                Stock: {variant.stock}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
                      aria-label="Edit product"
                    >
                      <Edit className="w-5 h-4 mr-2" />
                      Edit Product
                    </button>
                    <div className="flex gap-2">
                      <button
                        className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                        aria-label="View product"
                      >
                        <Eye className="w-5 h-4 text-gray-700" />
                      </button>
                      <button
                        className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                        aria-label="Add to favorites"
                      >
                        <Heart className="w-5 h-4 text-gray-700" />
                      </button>
                      <button
                        className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                        aria-label="Share product"
                      >
                        <Share2 className="w-5 h-4 text-gray-700" />
                      </button>
                      <button
                        className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                        aria-label="More options"
                      >
                        <MoreHorizontal className="w-5 h-4 text-gray-700" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default DetailOrder;