import React, { useState, useEffect } from "react";
import {
  Save,
  Plus,
  Trash2,
  Upload,
  Eye,
  EyeOff,
  Package,
  Star,
  Users,
  TrendingUp,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { productApi } from "../../../../api/VendorAPI";
import categoryApi from "../../../../api/categoryApi";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

const ProductUpdateInterface = () => {
  const { productId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [showPreview, setShowPreview] = useState(false);

  const [availableCategories, setAvailableCategories] = useState([]);

  const [productData, setProductData] = useState({
    id: null,
    name: "",
    description: "",
    discount: "0",
    weight: "0",
    dimensions: "",
    category: "",
    variants: [],
    images: {
      main: "",
      additional: [],
    },
  });

  const [newVariant, setNewVariant] = useState({
    id: null,
    size: "",
    color: "",
    material: "",
    storage: "",
    ram: "",
    processor: "",
    price: "",
    stock: "",
    image: "",
    imageFile: null,
  });

  const [variantImages, setVariantImages] = useState({});

  // Thêm state cho Recent Activity
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: "update",
      action: "Updated product price",
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      icon: "blue",
    },
    {
      id: 2,
      type: "add",
      action: "Added new variant",
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      icon: "green",
    },
    {
      id: 3,
      type: "edit",
      action: "Updated product description",
      timestamp: new Date(Date.now() - 259200000), // 3 days ago
      icon: "yellow",
    },
  ]);

  const categories = [
    { id: 1, name: "Clothing" },
    { id: 2, name: "Mobile Phones" },
    { id: 3, name: "Accessories" },
    { id: 4, name: "Laptops" },
    { id: 5, name: "Audio" },
    { id: 6, name: "Electronics" },
  ];

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        console.log("Bắt đầu fetch dữ liệu với productId:", productId);
        setLoading(true);
        const response = await productApi.getProductById(productId);
        console.log("Response từ API:", response);

        if (response.data.success) {
          const product = response.data.data;
          console.log("Dữ liệu sản phẩm:", product);
          setProductData({
            id: product.product_id,
            name: product.product_name,
            description: product.description,
            discount: product.discount,
            weight: product.weight,
            dimensions: product.dimensions,
            category: product.Category?.category_name || "",
            variants: product.variants.map((variant) => ({
              id: variant.variant_id,
              size: variant.size,
              color: variant.color,
              material: variant.material,
              storage: variant.storage,
              ram: variant.ram,
              processor: variant.processor,
              price: variant.price,
              stock: variant.stock,
              image: variant.image_url,
            })),
            images: {
              main: product.variants[0]?.image_url || "",
              additional: [],
            },
          });
        } else {
          console.error("API trả về lỗi:", response.data.message);
          setError(response.data.message || "Không thể lấy thông tin sản phẩm");
        }
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        setError(err.message || "Có lỗi xảy ra khi lấy thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getAllCategories();
        if (response.data.success) {
          setAvailableCategories(response.data.data);
        } else {
          console.error("Lỗi khi lấy danh mục:", response.data.message);
        }
      } catch (err) {
        console.error("Lỗi API khi lấy danh mục:", err);
      }
    };

    if (productId) {
      console.log("productId tồn tại, bắt đầu fetch dữ liệu");
      fetchProductData();
      fetchCategories();
    } else {
      console.log("Không có productId");
    }
  }, [productId]);

  const updateProductField = (field, value) => {
    setProductData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateVariant = (index, field, value) => {
    const updatedVariants = [...productData.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value,
    };
    setProductData((prev) => ({
      ...prev,
      variants: updatedVariants,
    }));
  };

  const handleImageUpload = async (file, index = null) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      if (index !== null) {
        const response = await productApi.uploadProductImage(
          productData.id,
          formData
        );
        if (response.data.success) {
          updateVariant(index, "image", response.data.data.image_url);
        }
      } else {
        setNewVariant((prev) => ({
          ...prev,
          imageFile: file,
          image: URL.createObjectURL(file),
        }));
      }
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
    }
  };

  // Hàm để thêm hoạt động mới
  const addActivity = (type, action) => {
    const newActivity = {
      id: Date.now(),
      type,
      action,
      timestamp: new Date(),
      icon: type === "update" ? "blue" : type === "add" ? "green" : "yellow",
    };
    setActivities((prev) => [newActivity, ...prev].slice(0, 5)); // Giữ tối đa 5 hoạt động gần nhất
  };

  // Hàm để format thời gian
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;
    if (minutes > 0) return `${minutes} minutes ago`;
    return "Just now";
  };

  const addVariant = async () => {
    if (newVariant.price && newVariant.stock) {
      try {
        let imageUrl = newVariant.image;

        if (newVariant.imageFile) {
          const formData = new FormData();
          formData.append("image", newVariant.imageFile);
          const response = await productApi.uploadProductImage(
            productData.id,
            formData
          );
          if (response.data.success) {
            imageUrl = response.data.data.image_url;
          }
        }

        const variant = {
          ...newVariant,
          id: Date.now(),
          price: parseFloat(newVariant.price).toFixed(2),
          stock: parseInt(newVariant.stock),
          image: imageUrl,
        };

        setProductData((prev) => ({
          ...prev,
          variants: [...prev.variants, variant],
        }));

        // Thêm hoạt động mới
        addActivity("add", "Added a new variant");

        setNewVariant({
          id: null,
          size: "",
          color: "",
          material: "",
          storage: "",
          ram: "",
          processor: "",
          price: "",
          stock: "",
          image: "",
          imageFile: null,
        });
      } catch (error) {
        console.error("Error adding variant:", error);
      }
    }
  };

  const removeVariant = async (index) => {
    const variant = productData.variants[index];

    const result = await Swal.fire({
      title: "Delete Variant",
      text: "Are you sure you want to delete this variant?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await productApi.deleteVariant(productData.id, variant.id);

        const updatedVariants = productData.variants.filter(
          (_, i) => i !== index
        );
        setProductData((prev) => ({
          ...prev,
          variants: updatedVariants,
        }));

        // Add new activity
        addActivity("update", "Deleted a variant");

        Swal.fire({
          title: "Success!",
          text: "Variant has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error deleting variant:", error);
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to delete variant. Please try again.",
          icon: "error",
        });
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getTotalStock = () => {
    return productData.variants.reduce(
      (sum, variant) => sum + (parseInt(variant.stock) || 0),
      0
    );
  };

  const getMinMaxPrice = () => {
    const prices = productData.variants.map((v) => parseFloat(v.price) || 0);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  };

  const tabButtons = [
    { id: "basic", label: "Basic Information", icon: Package },
    { id: "variants", label: "Product Variants", icon: Star },
    { id: "images", label: "Images", icon: Upload },
    { id: "preview", label: "Preview", icon: Eye },
  ];

  const TabButton = ({ tab, active, onClick, icon: Icon, label }) => (
    <button
      onClick={() => onClick(tab)}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
        active
          ? "bg-blue-600 text-white shadow-lg transform scale-105"
          : "bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600 border border-gray-200"
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  const handleVariantImageChange = (file, variantId) => {
    setVariantImages((prev) => ({
      ...prev,
      [variantId]: file,
    }));
    updateVariant(
      productData.variants.findIndex((v) => v.id === variantId),
      "image",
      URL.createObjectURL(file)
    );
  };

  const handleSaveProduct = async () => {
    const result = await Swal.fire({
      title: "Update Product",
      text: "Are you sure you want to save changes for this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Save changes",
      cancelButtonText: "Cancel",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const productId = productData.id;
          const productPayload = {
            product_name: productData.name,
            description: productData.description,
            discount: productData.discount,
            dimensions: productData.dimensions,
            weight: productData.weight,
            category: productData.category,
            stock: getTotalStock(),
            variants: productData.variants.map((v) => ({
              variant_id: v.id,
              size: v.size,
              color: v.color,
              material: v.material,
              storage: v.storage,
              ram: v.ram,
              processor: v.processor,
              price: v.price,
              stock: v.stock,
            })),
            variantImages,
          };
          const response = await productApi.updateProductWithVariants(
            productId,
            productPayload
          );
          if (!response.data.success) {
            throw new Error(response.data.message || "Update failed");
          }
          return response.data;
        } catch (error) {
          Swal.showValidationMessage(`Error: ${error.message}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (result.isConfirmed && result.value && result.value.success) {
      // Add new activity
      addActivity("update", "Updated product information");

      Swal.fire({
        title: "Success!",
        text: "Product updated successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            Đang tải thông tin sản phẩm...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center bg-red-50 p-8 rounded-2xl border border-red-200 shadow-lg">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-700 text-lg font-medium">Lỗi: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b mb-8">
          <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Product Management
                </h1>
                <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-1 mx-auto md:mx-0"></div>
                <p className="text-gray-600 mt-1 text-center md:text-left">
                  Update product information and variants
                </p>
              </div>
            </div>
            <div className="flex justify-center md:justify-end gap-4">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
                {showPreview ? "Hide" : "See"}
              </button>
              <button
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg"
                onClick={handleSaveProduct}
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-6 justify-center lg:justify-start">
              {tabButtons.map(({ id, label, icon }) => (
                <TabButton
                  key={id}
                  tab={id}
                  active={activeTab === id}
                  onClick={setActiveTab}
                  icon={icon}
                  label={label}
                />
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Basic Information Tab */}
              {activeTab === "basic" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 border-b pb-2 text-center lg:text-left">
                    Basic Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={productData.name}
                        onChange={(e) =>
                          updateProductField("name", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter product name"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Description
                      </label>
                      <textarea
                        value={productData.description}
                        onChange={(e) =>
                          updateProductField("description", e.target.value)
                        }
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Nhập mô tả chi tiết về sản phẩm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        list="categories"
                        value={productData.category}
                        onChange={(e) =>
                          updateProductField("category", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter or select category"
                      />
                      <datalist id="categories">
                        {availableCategories.map((cat) => (
                          <option
                            key={cat.category_id}
                            value={cat.category_name}
                          />
                        ))}
                      </datalist>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount (%)
                      </label>
                      <input
                        type="number"
                        value={productData.discount}
                        onChange={(e) =>
                          updateProductField("discount", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="0"
                        min="0"
                        max="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        value={productData.weight}
                        onChange={(e) =>
                          updateProductField("weight", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="0.0"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dimensions
                      </label>
                      <input
                        type="text"
                        value={productData.dimensions}
                        onChange={(e) =>
                          updateProductField("dimensions", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="L x W x H mm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Variants Tab */}
              {activeTab === "variants" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Product Variants
                    </h2>
                    <span className="text-sm text-gray-500">
                      {productData.variants.length} variants
                    </span>
                  </div>
                  {/* Existing Variants */}
                  <div className="space-y-4">
                    {productData.variants.map((variant, index) => (
                      <div
                        key={variant.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium text-gray-900">
                            Variant #{index + 1}
                          </h3>
                          <button
                            onClick={() => removeVariant(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Size
                            </label>
                            <input
                              type="text"
                              value={variant.size || ""}
                              onChange={(e) =>
                                updateVariant(index, "size", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="S, M, L..."
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Color
                            </label>
                            <input
                              type="text"
                              value={variant.color || ""}
                              onChange={(e) =>
                                updateVariant(index, "color", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Red, Blue..."
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Material
                            </label>
                            <input
                              type="text"
                              value={variant.material || ""}
                              onChange={(e) =>
                                updateVariant(index, "material", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Cotton, OLED..."
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Price (VND)
                            </label>
                            <input
                              type="number"
                              value={variant.price}
                              onChange={(e) =>
                                updateVariant(index, "price", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Stock
                            </label>
                            <input
                              type="number"
                              value={variant.stock}
                              onChange={(e) =>
                                updateVariant(index, "stock", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Storage (GB)
                            </label>
                            <input
                              type="number"
                              value={variant.storage || ""}
                              onChange={(e) =>
                                updateVariant(index, "storage", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="64, 128..."
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              RAM (GB)
                            </label>
                            <input
                              type="number"
                              value={variant.ram || ""}
                              onChange={(e) =>
                                updateVariant(index, "ram", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="4, 8, 16..."
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Processor
                            </label>
                            <input
                              type="text"
                              value={variant.processor || ""}
                              onChange={(e) =>
                                updateVariant(
                                  index,
                                  "processor",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Snapdragon..."
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Image
                          </label>
                          <div className="flex items-center gap-4">
                            {variant.image && (
                              <img
                                src={variant.image}
                                alt={`Variant ${index + 1}`}
                                className="w-16 h-16 object-cover rounded border"
                              />
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  handleVariantImageChange(file, variant.id);
                                }
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Add New Variant */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <h3 className="font-medium text-gray-900 mb-4 text-center">
                      Add New Variant
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                      <input
                        type="text"
                        value={newVariant.size}
                        onChange={(e) =>
                          setNewVariant((prev) => ({
                            ...prev,
                            size: e.target.value,
                          }))
                        }
                        className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Size"
                      />
                      <input
                        type="text"
                        value={newVariant.color}
                        onChange={(e) =>
                          setNewVariant((prev) => ({
                            ...prev,
                            color: e.target.value,
                          }))
                        }
                        className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Color"
                      />
                      <input
                        type="text"
                        value={newVariant.material}
                        onChange={(e) =>
                          setNewVariant((prev) => ({
                            ...prev,
                            material: e.target.value,
                          }))
                        }
                        className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Material"
                      />
                      <input
                        type="number"
                        value={newVariant.price}
                        onChange={(e) =>
                          setNewVariant((prev) => ({
                            ...prev,
                            price: e.target.value,
                          }))
                        }
                        className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Price (VND)"
                        required
                      />
                      <input
                        type="number"
                        value={newVariant.stock}
                        onChange={(e) =>
                          setNewVariant((prev) => ({
                            ...prev,
                            stock: e.target.value,
                          }))
                        }
                        className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Stock"
                        required
                      />
                      <input
                        type="number"
                        value={newVariant.storage}
                        onChange={(e) =>
                          setNewVariant((prev) => ({
                            ...prev,
                            storage: e.target.value,
                          }))
                        }
                        className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Storage (GB)"
                      />
                      <input
                        type="number"
                        value={newVariant.ram}
                        onChange={(e) =>
                          setNewVariant((prev) => ({
                            ...prev,
                            ram: e.target.value,
                          }))
                        }
                        className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="RAM (GB)"
                      />
                      <input
                        type="text"
                        value={newVariant.processor}
                        onChange={(e) =>
                          setNewVariant((prev) => ({
                            ...prev,
                            processor: e.target.value,
                          }))
                        }
                        className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Processor"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Image
                      </label>
                      <div className="flex items-center gap-4 justify-center">
                        {newVariant.image && (
                          <img
                            src={newVariant.image}
                            alt="New variant"
                            className="w-16 h-16 object-cover rounded border"
                          />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              handleImageUpload(file);
                            }
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <button
                      onClick={addVariant}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors mt-4 mx-auto"
                    >
                      <Plus size={18} />
                      Add New Variant
                    </button>
                  </div>
                </div>
              )}

              {/* Images Tab */}
              {activeTab === "images" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 border-b pb-2 text-center lg:text-left">
                    Quản lý hình ảnh
                  </h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Image
                    </label>
                    <div className="flex items-center gap-4 justify-center lg:justify-start">
                      {productData.images.main && (
                        <img
                          src={productData.images.main}
                          alt="Main product"
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                      )}
                      <input
                        type="url"
                        value={productData.images.main}
                        onChange={(e) =>
                          updateProductField("images", {
                            ...productData.images,
                            main: e.target.value,
                          })
                        }
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Images
                    </label>
                    <div className="space-y-2">
                      {productData.images.additional.map((img, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <img
                            src={img.url}
                            alt={`Additional ${index + 1}`}
                            className="w-16 h-16 object-cover rounded border"
                          />
                          <input
                            type="url"
                            value={img.url}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            readOnly
                          />
                          <span className="text-sm text-gray-500">
                            {formatPrice(img.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Preview Tab */}
              {activeTab === "preview" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 border-b pb-2 text-center lg:text-left">
                    Preview Product
                  </h2>
                  <div className="border rounded-lg p-6 bg-gray-50">
                    <div className="flex flex-col lg:flex-row gap-6 items-center">
                      <div className="flex-shrink-0">
                        <img
                          src={productData.images.main}
                          alt={productData.name}
                          className="w-48 h-48 object-cover rounded-lg shadow-md"
                        />
                      </div>
                      <div className="flex-1 text-center lg:text-left">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {productData.name}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {productData.description}
                        </p>
                        <div className="flex items-center gap-4 mb-4 justify-center lg:justify-start">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {productData.category}
                          </span>
                          {parseFloat(productData.discount) > 0 && (
                            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                              -{productData.discount}%
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Weight:</span>{" "}
                            {productData.weight} kg
                          </div>
                          <div>
                            <span className="font-medium">Dimensions:</span>{" "}
                            {productData.dimensions}
                          </div>
                          <div>
                            <span className="font-medium">Total Stock:</span>{" "}
                            {getTotalStock()} products
                          </div>
                          <div>
                            <span className="font-medium">
                              Number of Variants:
                            </span>{" "}
                            {productData.variants.length}
                          </div>
                        </div>
                        <div className="mt-4">
                          <span className="text-2xl font-bold text-blue-600">
                            {formatPrice(getMinMaxPrice().min)}
                            {getMinMaxPrice().min !== getMinMaxPrice().max &&
                              ` - ${formatPrice(getMinMaxPrice().max)}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2">
                      <Eye size={18} />
                      Overview
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center lg:text-left">
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="text-blue-500" size={18} />
                    <span className="text-sm text-gray-600">Total Stock</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {getTotalStock()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-500" size={18} />
                    <span className="text-sm text-gray-600">Variants</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {productData.variants.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-green-500" size={18} />
                    <span className="text-sm text-gray-600">Discount</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {productData.discount}%
                  </span>
                </div>
              </div>
            </div>

            {/* Low Stock Alert */}
            {productData.variants.some((v) => parseInt(v.stock) <= 5) && (
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="text-red-500" size={20} />
                  <h3 className="text-lg font-semibold text-red-600 text-center lg:text-left">
                    Low Stock Warning
                  </h3>
                </div>
                <div className="space-y-2">
                  {productData.variants
                    .filter((v) => parseInt(v.stock) <= 5)
                    .map((variant, index) => (
                      <div
                        key={variant.id}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-600">
                          {variant.size && `${variant.size} - `}
                          {variant.color && `${variant.color}`}
                        </span>
                        <span className="font-semibold text-red-600">
                          {variant.stock} remaining
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Product Status */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center lg:text-left">
                Product Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <select className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Visible</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Featured</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center lg:text-left">
                Recent Activity
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-gray-800">Updated product price</p>
                    <p className="text-gray-500 text-xs">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-gray-800">Added new variant</p>
                    <p className="text-gray-500 text-xs">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-gray-800">Updated product description</p>
                    <p className="text-gray-500 text-xs">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 text-center lg:text-left">
                💡 Tips
              </h3>
              <div className="space-y-2 text-sm text-blue-800 text-left">
                <p>• Add at least 3-5 high-quality images for the product</p>
                <p>
                  • Write detailed and attractive descriptions to attract
                  customers
                </p>
                <p>• Update stock regularly to avoid overselling</p>
                <p>
                  • Use relevant keywords in the product name and description
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Preview Product on Mobile
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="p-4">
                <img
                  src={productData.images.main}
                  alt={productData.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {productData.name}
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  {productData.description}
                </p>
                <div className="flex items-center gap-2 mb-4 justify-center">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {productData.category}
                  </span>
                  {parseFloat(productData.discount) > 0 && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                      -{productData.discount}%
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-4">
                  {formatPrice(getMinMaxPrice().min)}
                  {getMinMaxPrice().min !== getMinMaxPrice().max &&
                    ` - ${formatPrice(getMinMaxPrice().max)}`}
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Stock:</span>
                    <span className="font-medium">
                      {getTotalStock()} products
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Variants:</span>
                    <span className="font-medium">
                      {productData.variants.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weight:</span>
                    <span className="font-medium">{productData.weight} kg</span>
                  </div>
                </div>
                <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2">
                  <Eye size={18} />
                  Overview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductUpdateInterface;
