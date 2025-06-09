import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import orderApi from "../../../api/VendorAPI/orderApi";

const DetailOrder = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [viewMode] = useState("grid");
  const [filterCategory] = useState("all");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const productIds = searchParams.get("productIds")?.split(",") || [];
        const variantIds = searchParams.get("variantIds")?.split(",") || [];

        if (
          productIds.length === 0 ||
          variantIds.length === 0 ||
          productIds.length !== variantIds.length
        ) {
          throw new Error(
            "Thông tin sản phẩm hoặc biến thể trong URL không hợp lệ"
          );
        }

        // Tạo ánh xạ từ productId sang variantId mong muốn từ URL
        const desiredVariantMap = productIds.reduce((map, productId, index) => {
          map[productId] = variantIds[index];
          return map;
        }, {});

        console.log("Desired Variant Map from URL:", desiredVariantMap);

        // Gọi API để lấy chi tiết các sản phẩm và biến thể
        // API getProductsDetailByIds đã được điều chỉnh ở backend để có thể nhận danh sách productIds và variantIds
        const response = await orderApi.getProductsDetailByIds(
          productIds.join(","),
          variantIds.join(",")
        );

        if (response?.data?.success && Array.isArray(response.data.data)) {
          setProducts(response.data.data);
          const initialSelectedVariants = {};
          response.data.data.forEach((product) => {
            if (product.variants && product.variants.length > 0) {
              // Tìm variantId mong muốn cho sản phẩm này từ ánh xạ
              const desiredVariantId =
                desiredVariantMap[product.product_id.toString()];
              let initialVariantIndex = 0; // Mặc định chọn biến thể đầu tiên

              // Nếu có variantId mong muốn, tìm index của biến thể đó trong danh sách variants của sản phẩm
              if (desiredVariantId) {
                const index = product.variants.findIndex(
                  (variant) =>
                    variant.variant_id?.toString() === desiredVariantId
                );
                if (index !== -1) {
                  initialVariantIndex = index;
                }
                // Nếu không tìm thấy biến thể khớp với desiredVariantId, vẫn dùng index mặc định là 0
                // Điều này xảy ra nếu dữ liệu API trả về không chứa biến thể mà URL yêu cầu
              }

              initialSelectedVariants[product.product_id] = initialVariantIndex;
            } else {
              // Nếu sản phẩm không có biến thể, vẫn set selectedVariants (có thể với giá trị mặc định 0 hoặc null tùy logic)
              initialSelectedVariants[product.product_id] = 0; // Hoặc null tùy ý
            }
          });
          setSelectedVariants(initialSelectedVariants);
          console.log("Initial Selected Variants:", initialSelectedVariants);
        } else if (response?.data?.message) {
          throw new Error(response.data.message);
        } else {
          throw new Error("Dữ liệu sản phẩm nhận được từ server không hợp lệ");
        }
      } catch (err) {
        console.error("Lỗi khi tải thông tin sản phẩm:", err);
        setError(err.message || "Có lỗi xảy ra khi tải thông tin sản phẩm");
        setProducts([]); // Clear products on error
        setSelectedVariants({}); // Reset selected variants on error
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [searchParams]); // Depend on searchParams to refetch if URL changes

  const formatPrice = (price) => {
    if (price == null) return "0";
    return parseFloat(price).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
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
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  const getStockStatus = (stock) => {
    if (stock > 50)
      return {
        color: "text-emerald-600 bg-emerald-100 border-emerald-200",
        text: "In Stock",
        icon: CheckCircle,
      };
    if (stock > 20)
      return {
        color: "text-amber-600 bg-amber-100 border-amber-200",
        text: "Low Stock",
        icon: Clock,
      };
    if (stock > 0)
      return {
        color: "text-red-600 bg-red-100 border-red-200",
        text: "Very Low Stock",
        icon: AlertCircle,
      };
    return {
      color: "text-gray-600 bg-gray-100 border-gray-200",
      text: "Out of Stock",
      icon: AlertCircle,
    };
  };

  const getDiscountBadge = (discount) => {
    if (discount > 0) {
      return (
        <div className="absolute top-3 left-3 z-20">
          <div className="bg-red-500 text-white px-2.5 py-1 rounded-full shadow-sm text-xs font-semibold flex items-center">
            <Zap className="w-3 h-3 mr-1" />-{discount}%
          </div>
        </div>
      );
    }
    return null;
  };

  const handleExportData = async () => {
    try {
      const headers = [
        "Product ID",
        "Product Name",
        "Category",
        "Price",
        "Discount",
        "Stock",
        "Sold",
        "Rating",
        "Description",
        "Variants",
      ];

      const csvRows = [headers];

      products.forEach((product) => {
        const selectedVariantIndex = selectedVariants[product.product_id] || 0;
        const selectedVariant = product.variants?.[selectedVariantIndex];

        const row = [
          product.product_id,
          product.product_name,
          product.Category?.category_name || "Uncategorized",
          selectedVariant?.price || product.price,
          product.discount || 0,
          product.stock,
          product.sold,
          product.average_rating || 0,
          product.description || "",
          product.variants
            ?.map((v) => `${v.size} - ${v.color} (${v.price})`)
            .join("; ") || "",
        ];

        csvRows.push(row);
      });

      const csvContent = csvRows.map((row) => row.join(",")).join("\n");
      const BOM = "\ufeff";
      const csvWithBOM = BOM + csvContent;

      const blob = new Blob([csvWithBOM], {
        type: "text/csv;charset=utf-8;",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `product_details_${new Date().toISOString().split("T")[0]}.csv`
      );

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Failed to export data. Please try again later.");
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const productIds = searchParams.get("productIds")?.split(",") || [];
      const variantIds = searchParams.get("variantIds")?.split(",") || [];

      if (productIds.length === 0 || variantIds.length === 0) {
        throw new Error("No product information found in URL");
      }

      const response = await orderApi.getProductsDetailByIds(
        productIds.join(","),
        variantIds.join(",")
      );

      if (response?.data?.success && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
        const initialSelectedVariants = {};
        response.data.data.forEach((product) => {
          if (product.variants && product.variants.length > 0) {
            const variantIndex = product.variants.findIndex((variant) =>
              variantIds.includes(variant.variant_id.toString())
            );
            initialSelectedVariants[product.product_id] =
              variantIndex >= 0 ? variantIndex : 0;
          }
        });
        setSelectedVariants(initialSelectedVariants);
      } else {
        throw new Error(
          response?.data?.message || "Invalid product data received"
        );
      }
    } catch (err) {
      console.error("Error refreshing product details:", err);
      setError(err.message || "Error refreshing product information");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (productId, variantId) => {
    navigate(`/vendor/products/edit/${productId}`);
  };

  const handleViewProduct = (productId) => {
    window.open(`/product/${productId}`, "_blank");
  };

  const handleShareProduct = (product) => {
    const shareData = {
      title: product.product_name,
      text: product.description,
      url: `${window.location.origin}/product/${product.product_id}`,
    };

    if (navigator.share) {
      navigator
        .share(shareData)
        .catch((error) => console.log("Error sharing:", error));
    } else {
      setShowShareModal(true);
    }
  };

  const handleCopyLink = (productId) => {
    const productUrl = `${window.location.origin}/products/${productId}`;
    navigator.clipboard
      .writeText(productUrl)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
      });
  };

  const handleMoreOptions = (product) => {
    setShowMoreOptions(true);
  };

  const handleViewImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setZoomLevel(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    setShowImageModal(true);
  };

  const handleWheelZoom = (e) => {
    e.preventDefault();
    const zoomStep = 0.1;
    const minZoom = 0.5;
    const maxZoom = 5;

    setZoomLevel((prevZoom) => {
      const newZoom = prevZoom + (e.deltaY < 0 ? zoomStep : -zoomStep);
      return Math.min(Math.max(newZoom, minZoom), maxZoom);
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-sm w-full">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900">
            Loading Products...
          </h3>
          <p className="text-gray-500 mt-2 text-sm">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error</h3>
          <p className="text-red-600 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <Package className="w-8 h-8 text-white" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Product Details
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-1 mx-auto md:mx-0"></div>
            <p className="text-gray-500 text-sm mt-1">
              Explore and manage your products
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 text-sm font-medium">
            <Package className="w-4 h-4" />
            <span>{products.length} Products</span>
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
            aria-label="Refresh product data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportData}
            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
            aria-label="Download product data"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {products.map((product) => {
          const selectedVariantIndex =
            selectedVariants[product.product_id] || 0;
          const selectedVariant = product.variants?.[selectedVariantIndex];
          const currentStock =
            selectedVariant?.stock !== undefined
              ? selectedVariant.stock
              : product.stock;
          const stockStatus = getStockStatus(currentStock);

          return (
            <div
              key={product.product_id}
              className="bg-white rounded-xl shadow-sm mb-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-6">
                {/* Product Image Section */}
                <div className="lg:col-span-2">
                  <div className="relative">
                    {getDiscountBadge(product.discount)}
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden group mb-4">
                      <img
                        src={selectedVariant?.image_url || product.image_url}
                        alt={product.product_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                          <button
                            onClick={() => {
                              const canvas = document.createElement("canvas");
                              const img = new Image();
                              img.crossOrigin = "anonymous";
                              img.onload = () => {
                                canvas.width = img.width;
                                canvas.height = img.height;
                                const ctx = canvas.getContext("2d");
                                ctx.drawImage(img, 0, 0);
                                const link = document.createElement("a");
                                link.download = `product_${
                                  product.product_id
                                }_${new Date().getTime()}.png`;
                                link.href = canvas.toDataURL("image/png");
                                link.click();
                              };
                              img.src =
                                selectedVariant?.image_url || product.image_url;
                            }}
                            className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100"
                            aria-label="Capture product image"
                          >
                            <Camera className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() =>
                              handleViewImage(
                                selectedVariant?.image_url || product.image_url
                              )
                            }
                            className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100"
                            aria-label="View product image"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
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
                            className={`aspect-square rounded-lg overflow-hidden cursor-pointer border transition-all duration-200 ${
                              selectedVariantIndex === index
                                ? "border-blue-500 shadow-sm"
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
                <div className="lg:col-span-3 space-y-5">
                  {/* Category & Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                        {product.Category?.category_name || "Uncategorized"}
                      </span>
                      <div
                        className={`flex items-center space-x-1 px-2.5 py-1 rounded-full border ${stockStatus.color}`}
                      >
                        <stockStatus.icon className="w-4 h-4" />
                        <span className="text-xs font-medium">
                          {stockStatus.text}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Product Title */}
                  <h3 className="text-xl font-bold text-gray-900">
                    {product.product_name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {product.description || "No description available."}
                  </p>

                  {/* Rating */}
                  {product.average_rating && (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {renderStars(parseFloat(product.average_rating))}
                      </div>
                      <span className="text-gray-900 font-medium text-sm">
                        {parseFloat(product.average_rating).toFixed(1)}
                      </span>
                      <span className="text-gray-500 text-sm">
                        ({product.review_count || 0} reviews)
                      </span>
                    </div>
                  )}

                  {/* Price Section */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-xs font-medium">
                          Price
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-blue-600">
                            {formatPrice(
                              (selectedVariant?.price || product.price) *
                                (1 - product.discount / 100)
                            )}
                          </span>
                          {product.discount > 0 && (
                            <span className="text-gray-400 text-sm line-through">
                              {formatPrice(
                                selectedVariant?.price || product.price
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      {product.discount > 0 && (
                        <div className="text-right">
                          <p className="text-gray-500 text-xs font-medium">
                            Savings
                          </p>
                          <span className="text-base font-bold text-red-500">
                            {formatPrice(
                              (selectedVariant?.price || product.price) *
                                (product.discount / 100)
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-emerald-50 rounded-lg p-3 text-center">
                      <TrendingUp className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                      <p className="text-base font-semibold text-emerald-700">
                        {product.sold.toLocaleString()}
                      </p>
                      <p className="text-xs text-emerald-600">Sold</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <Package className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-base font-semibold text-blue-700">
                        {currentStock.toLocaleString()}
                      </p>
                      <p className="text-xs text-blue-600">Stock</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <Award className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-base font-semibold text-purple-700">
                        {selectedVariant?.variant_id || "N/A"}
                      </p>
                      <p className="text-xs text-purple-600">Variant ID</p>
                    </div>
                  </div>

                  {/* Variants Section */}
                  {product.variants && product.variants.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <Package className="w-4 h-4 mr-2" />
                        Product Variants
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {product.variants.map((variant, index) => (
                          <div
                            key={variant.variant_id}
                            onClick={() =>
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [product.product_id]: index,
                              }))
                            }
                            className={`cursor-pointer p-3 rounded-lg border transition-all duration-200 ${
                              selectedVariantIndex === index
                                ? "border-blue-500 bg-blue-50 shadow-sm"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900 text-sm">
                                  {variant.size}
                                </span>
                                <div
                                  className="w-4 h-4 rounded-full border border-gray-300"
                                  style={{
                                    backgroundColor:
                                      variant.color?.toLowerCase(),
                                  }}
                                  title={variant.color}
                                />
                              </div>
                              <span className="font-medium text-gray-900 text-sm">
                                {formatPrice(parseFloat(variant.price))}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <span className="bg-gray-100 px-2 py-1 rounded-full">
                                {variant.material}
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full ${
                                  variant.stock > 50
                                    ? "bg-emerald-100 text-emerald-600"
                                    : variant.stock > 20
                                    ? "bg-amber-100 text-amber-600"
                                    : variant.stock > 0
                                    ? "bg-red-100 text-red-600"
                                    : "bg-gray-100 text-gray-600"
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
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() =>
                        handleEditProduct(
                          product.product_id,
                          product.variants[selectedVariants[product.product_id]]
                            ?.variant_id
                        )
                      }
                      className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center text-sm font-medium shadow-sm hover:shadow-md"
                      aria-label="Edit product"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Product
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewProduct(product.product_id)}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                        aria-label="View product"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleShareProduct(product)}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                        aria-label="Share product"
                      >
                        <Share2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleMoreOptions(product)}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                        aria-label="More options"
                      >
                        <MoreHorizontal className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Share Product
            </h3>
            <div className="space-y-4">
              <button
                onClick={() => handleCopyLink(products[0].product_id)}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Copy Link
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* More Options Modal */}
      {showMoreOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              More Options
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowMoreOptions(false);
                }}
                className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <Clock className="w-4 h-4 mr-2" />
                View History
              </button>
              <button
                onClick={() => {
                  setShowMoreOptions(false);
                }}
                className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Statistics
              </button>
              <button
                onClick={() => setShowMoreOptions(false)}
                className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="relative bg-white rounded-xl p-4 max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Detail Image
              </h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg transition-colors duration-200"
                aria-label="Close image preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleResetZoom}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  aria-label="Reset zoom"
                >
                  <RotateCcw className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() =>
                    setZoomLevel((prev) => Math.min(prev + 0.1, 5))
                  }
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() =>
                    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5))
                  }
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={handleRotate}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  aria-label="Rotate image"
                >
                  <RotateCcw className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="text-sm text-gray-600">
                Zoom: {(zoomLevel * 100).toFixed(0)}%
              </div>
            </div>

            {/* Image Container */}
            <div className="relative h-[60vh] bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={selectedImage}
                alt="Product preview"
                className="absolute inset-0 w-full h-full object-contain cursor-move"
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  transition: isDragging ? "none" : "transform 0.2s ease",
                  transformOrigin: "center",
                  position: "relative",
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                }}
                onWheel={handleWheelZoom}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailOrder;
