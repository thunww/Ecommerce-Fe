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
  TrendingUp,
  AlertTriangle,
  ImagePlus,
  CheckCircle,
  ShoppingCart,
} from "lucide-react";
import Swal from "sweetalert2";
import { productApi } from "../../../../api/VendorAPI";
import categoryApi from "../../../../api/categoryApi";

const ProductCreateInterface = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const [showPreview, setShowPreview] = useState(false);

  const [availableCategories, setAvailableCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    discount: "0",
    weight: "0",
    dimensions: "",
    category: "",
    variants: [],
    images: {
      main: null,
      additional: [],
    },
    status: "pending",
    featured: false,
    visible: true,
  });

  const [newVariant, setNewVariant] = useState({
    size: "",
    color: "",
    material: "",
    storage: "",
    ram: "",
    processor: "",
    price: "",
    stock: "",
    image: null,
    imageFile: null,
  });

  const [mainImageFile, setMainImageFile] = useState(null);
  const [variantImageFiles, setVariantImageFiles] = useState({});

  const [dragOver, setDragOver] = useState(false);

  // Lấy shop_id từ localStorage
  const shop_id = localStorage.getItem("shop_id");

  useEffect(() => {
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
    fetchCategories();
  }, []);

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

  const handleImageDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        if (!productData.images.main) {
          setProductData((prev) => ({
            ...prev,
            images: {
              ...prev.images,
              main: url,
            },
          }));
          setMainImageFile(file);
        } else {
          updateProductField("images", {
            ...productData.images,
            additional: [...productData.images.additional, { url, price: 0 }],
          });
        }
      }
    });
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductData((prev) => ({
        ...prev,
        images: {
          ...prev.images,
          main: URL.createObjectURL(file),
        },
      }));
      setMainImageFile(file);
    }
  };

  const addVariant = () => {
    if (newVariant.price && newVariant.stock) {
      const variant = {
        ...newVariant,
        id: Date.now(),
        price: parseFloat(newVariant.price).toFixed(2),
        stock: parseInt(newVariant.stock),
        image: newVariant.image,
      };

      setProductData((prev) => ({
        ...prev,
        variants: [...prev.variants, variant],
      }));

      setVariantImageFiles((prev) => ({
        ...prev,
        [variant.id]: newVariant.imageFile,
      }));

      setNewVariant({
        size: "",
        color: "",
        material: "",
        storage: "",
        ram: "",
        processor: "",
        price: "",
        stock: "",
        image: null,
        imageFile: null,
      });
    }
  };

  const removeVariant = (index) => {
    const variantToRemove = productData.variants[index];
    const updatedVariants = productData.variants.filter((_, i) => i !== index);
    setProductData((prev) => ({
      ...prev,
      variants: updatedVariants,
    }));

    setVariantImageFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[variantToRemove.id];
      return newFiles;
    });
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
    if (prices.length === 0) return { min: 0, max: 0 };
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  };

  const handleCreateProduct = async () => {
    if (!isFormValid()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Vui lòng điền đầy đủ thông tin bắt buộc (tên sản phẩm, mô tả, và ít nhất một biến thể).",
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      // Thêm thông tin cơ bản
      formData.append("product_name", productData.name);
      formData.append("description", productData.description);
      formData.append("discount", productData.discount);
      formData.append("weight", productData.weight);
      formData.append("dimensions", productData.dimensions);
      formData.append("category", productData.category);
      formData.append("stock", getTotalStock());

      // Thêm variants (không bao gồm image_url vì sẽ xử lý riêng)
      const variantsWithoutImages = productData.variants.map((variant) => ({
        size: variant.size,
        color: variant.color,
        material: variant.material,
        storage: variant.storage,
        ram: variant.ram,
        processor: variant.processor,
        price: variant.price,
        stock: variant.stock,
      }));
      formData.append("variants", JSON.stringify(variantsWithoutImages));

      // Thêm ảnh chính
      if (mainImageFile) {
        formData.append("mainImage", mainImageFile);
      }

      // Thêm ảnh variant
      productData.variants.forEach((variant, index) => {
        const variantImageFile = variantImageFiles[variant.id];
        if (variantImageFile) {
          formData.append(`variantImage_${index}`, variantImageFile);
        }
      });

      const response = await productApi.createProduct(formData);

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Sản phẩm đã được tạo thành công.",
          timer: 2000,
          showConfirmButton: false,
        });

        // Reset form
        setProductData({
          name: "",
          description: "",
          discount: "0",
          weight: "0",
          dimensions: "",
          category: "",
          variants: [],
          images: { main: null, additional: [] },
          status: "pending",
          featured: false,
          visible: true,
        });
        setNewVariant({
          size: "",
          color: "",
          material: "",
          storage: "",
          ram: "",
          processor: "",
          price: "",
          stock: "",
          image: null,
          imageFile: null,
        });
        setMainImageFile(null);
        setVariantImageFiles({});
        setActiveTab("basic");
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: response.data.message || "Đã xảy ra lỗi khi tạo sản phẩm.",
        });
      }
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi API!",
        text: error.message || "Không thể kết nối đến máy chủ.",
      });
    } finally {
      setLoading(false);
    }
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
      className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
        active
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
          : "bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600 border border-gray-200 hover:border-blue-300"
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  const isFormValid = () => {
    return (
      productData.name.trim() &&
      productData.description.trim() &&
      productData.variants.length > 0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tạo sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
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
                  Create New Product
                </h1>
                <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-1 mx-auto md:mx-0"></div>
                <p className="text-gray-600 mt-1 text-center md:text-left">
                  Build your product catalog with professional tools
                </p>
              </div>
            </div>
            <div className="flex justify-center md:justify-end gap-4">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
                {showPreview ? "Hide Preview" : "Show Preview"}
              </button>
              <button
                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-200 shadow-lg ${
                  isFormValid()
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                onClick={handleCreateProduct}
                disabled={!isFormValid()}
              >
                <Save size={18} />
                Create Product
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
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
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              {/* Basic Information Tab */}
              {activeTab === "basic" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    <Package className="text-blue-600" size={24} />
                    <h2 className="text-2xl font-bold text-gray-900">
                      Basic Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={productData.name}
                        onChange={(e) =>
                          updateProductField("name", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Enter an attractive product name"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Product Description *
                      </label>
                      <textarea
                        value={productData.description}
                        onChange={(e) =>
                          updateProductField("description", e.target.value)
                        }
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Describe your product in detail to attract customers..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Category
                      </label>
                      <input
                        type="text"
                        list="categories"
                        value={productData.category}
                        onChange={(e) =>
                          updateProductField("category", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
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
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Discount (%)
                      </label>
                      <input
                        type="number"
                        value={productData.discount}
                        onChange={(e) =>
                          updateProductField("discount", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="0"
                        min="0"
                        max="100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        value={productData.weight}
                        onChange={(e) =>
                          updateProductField("weight", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="0.0"
                        step="0.1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Dimensions
                      </label>
                      <input
                        type="text"
                        value={productData.dimensions}
                        onChange={(e) =>
                          updateProductField("dimensions", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="L x W x H (mm)"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Variants Tab */}
              {activeTab === "variants" && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <Star className="text-yellow-500" size={24} />
                      <h2 className="text-2xl font-bold text-gray-900">
                        Product Variants
                      </h2>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {productData.variants.length} variants
                    </span>
                  </div>

                  {/* Existing Variants */}
                  <div className="space-y-6">
                    {productData.variants.map((variant, index) => (
                      <div
                        key={variant.id}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-bold text-gray-900 text-lg">
                            Variant #{index + 1}
                          </h3>
                          <button
                            onClick={() => removeVariant(index)}
                            className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-2">
                              Size
                            </label>
                            <input
                              type="text"
                              value={variant.size || ""}
                              onChange={(e) =>
                                updateVariant(index, "size", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="S, M, L..."
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-2">
                              Color
                            </label>
                            <input
                              type="text"
                              value={variant.color || ""}
                              onChange={(e) =>
                                updateVariant(index, "color", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="Red, Blue..."
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-2">
                              Material
                            </label>
                            <input
                              type="text"
                              value={variant.material || ""}
                              onChange={(e) =>
                                updateVariant(index, "material", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="Cotton, OLED..."
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-2">
                              Price (VND) *
                            </label>
                            <input
                              type="number"
                              value={variant.price}
                              onChange={(e) =>
                                updateVariant(index, "price", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="0"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-2">
                              Stock *
                            </label>
                            <input
                              type="number"
                              value={variant.stock}
                              onChange={(e) =>
                                updateVariant(index, "stock", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="0"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-2">
                              Storage (GB)
                            </label>
                            <input
                              type="number"
                              value={variant.storage || ""}
                              onChange={(e) =>
                                updateVariant(index, "storage", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="64, 128..."
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-2">
                              RAM (GB)
                            </label>
                            <input
                              type="number"
                              value={variant.ram || ""}
                              onChange={(e) =>
                                updateVariant(index, "ram", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="4, 8, 16..."
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-2">
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="Snapdragon..."
                            />
                          </div>
                        </div>

                        <div className="mt-6">
                          <label className="block text-xs font-semibold text-gray-700 mb-2">
                            Variant Image
                          </label>
                          <div className="flex items-center gap-4">
                            {productData.variants[index].image && (
                              <img
                                src={productData.variants[index].image}
                                alt={`Variant ${index + 1}`}
                                className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
                              />
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  updateVariant(
                                    index,
                                    "image",
                                    URL.createObjectURL(file)
                                  );
                                  setVariantImageFiles((prev) => ({
                                    ...prev,
                                    [variant.id]: file,
                                  }));
                                }
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Variant */}
                  <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-200">
                    <div className="flex items-center gap-3 mb-6">
                      <Plus className="text-blue-600" size={24} />
                      <h3 className="font-bold text-gray-900 text-lg">
                        Add New Variant
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                      <input
                        type="text"
                        value={newVariant.size}
                        onChange={(e) =>
                          setNewVariant((prev) => ({
                            ...prev,
                            size: e.target.value,
                          }))
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Price (VND) *"
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
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Stock *"
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
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Processor"
                      />
                    </div>
                    <div className="mb-6">
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Variant Image
                      </label>
                      <div className="flex items-center gap-4">
                        {newVariant.image && (
                          <img
                            src={newVariant.image}
                            alt="New variant"
                            className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
                          />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setNewVariant((prev) => ({
                                ...prev,
                                image: URL.createObjectURL(file),
                                imageFile: file,
                              }));
                            }
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>
                    </div>
                    <button
                      onClick={addVariant}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Plus size={18} />
                      Add Variant
                    </button>
                  </div>
                </div>
              )}

              {/* Images Tab */}
              {activeTab === "images" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    <Upload className="text-purple-600" size={24} />
                    <h2 className="text-2xl font-bold text-gray-900">
                      Product Images
                    </h2>
                  </div>

                  {/* Main Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      Main Product Image
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                        dragOver
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                      onDrop={handleImageDrop}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                    >
                      {productData.images.main ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={productData.images.main}
                            alt="Main Product"
                            className="w-48 h-48 object-cover rounded-lg mb-4 shadow-md"
                          />
                          <button
                            onClick={() => {
                              setProductData((prev) => ({
                                ...prev,
                                images: { ...prev.images, main: null },
                              }));
                              setMainImageFile(null);
                            }}
                            className="text-red-500 hover:text-red-700 mt-2 flex items-center gap-1"
                          >
                            <Trash2 size={16} /> Remove Image
                          </button>
                        </div>
                      ) : (
                        <div className="text-gray-500">
                          <ImagePlus size={48} className="mx-auto mb-4" />
                          <p className="mb-2">
                            Drag & drop main image here, or
                          </p>
                          <label
                            htmlFor="main-image-upload"
                            className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
                          >
                            <Upload size={18} /> Browse File
                          </label>
                          <input
                            id="main-image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleMainImageChange}
                            className="hidden"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Images (can be enhanced if needed) */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Additional Product Images
                    </h3>
                    <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 flex flex-wrap gap-4">
                      {productData.images.additional.length > 0 ? (
                        productData.images.additional.map((img, index) => (
                          <div
                            key={index}
                            className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-300 shadow-sm"
                          >
                            <img
                              src={img.url}
                              alt={`Additional ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => {
                                const updatedAdditional =
                                  productData.images.additional.filter(
                                    (_, i) => i !== index
                                  );
                                updateProductField("images", {
                                  ...productData.images,
                                  additional: updatedAdditional,
                                });
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">
                          No additional images added yet.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Preview Tab */}
              {activeTab === "preview" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    <Eye className="text-gray-600" size={24} />
                    <h2 className="text-2xl font-bold text-gray-900">
                      Product Preview
                    </h2>
                  </div>
                  <div className="border rounded-2xl p-6 bg-gray-50 shadow-inner">
                    <div className="flex flex-col lg:flex-row gap-6 items-center">
                      <div className="flex-shrink-0">
                        {productData.images.main ? (
                          <img
                            src={productData.images.main}
                            alt={productData.name}
                            className="w-48 h-48 object-cover rounded-lg shadow-md border border-gray-200"
                          />
                        ) : (
                          <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-base mb-5">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-center lg:text-left">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {productData.name || "Untitled Product"}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {productData.description ||
                            "No description provided."}
                        </p>
                        <div className="flex items-center gap-2 mb-4">
                          {productData.category && (
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                              {productData.category}
                            </span>
                          )}
                          {parseFloat(productData.discount) > 0 && (
                            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                              -{productData.discount}%
                            </span>
                          )}
                        </div>
                        <div className="text-3xl font-bold text-blue-600 mb-4">
                          {formatPrice(getMinMaxPrice().min)}
                          {getMinMaxPrice().min !== getMinMaxPrice().max &&
                            ` - ${formatPrice(getMinMaxPrice().max)}`}
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Total Stock:</span>
                            <span className="font-medium">
                              {getTotalStock()} products
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Number of Variants:</span>
                            <span className="font-medium">
                              {productData.variants.length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Weight:</span>
                            <span className="font-medium">
                              {productData.weight || "N/A"} kg
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Dimensions:</span>
                            <span className="font-medium">
                              {productData.dimensions || "N/A"}
                            </span>
                          </div>
                        </div>
                        <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2">
                          <Eye size={18} />
                          Overview
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-5 text-center lg:text-left">
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

            {/* Product Status */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-5 text-center lg:text-left">
                Product Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Status
                  </span>
                  <select
                    value={productData.status}
                    onChange={(e) =>
                      updateProductField("status", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Visible on Store
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productData.visible}
                      onChange={(e) =>
                        updateProductField("visible", e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Featured Product
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productData.featured}
                      onChange={(e) =>
                        updateProductField("featured", e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Low Stock Alert */}
            {getTotalStock() <= 10 && productData.variants.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-red-500">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="text-red-500" size={24} />
                  <h3 className="text-xl font-semibold text-red-600">
                    Low Stock Warning!
                  </h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Một số biến thể của sản phẩm này có số lượng tồn kho thấp. Vui
                  lòng bổ sung để tránh hết hàng.
                </p>
                <div className="space-y-2">
                  {productData.variants
                    .filter((v) => parseInt(v.stock) <= 10) // Filter variants with stock <= 10
                    .map((variant, index) => (
                      <div
                        key={variant.id}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-600">
                          {variant.size && `${variant.size} - `}
                          {variant.color && `${variant.color} `}
                          {variant.material && `(${variant.material})`}
                        </span>
                        <span className="font-semibold text-red-600">
                          {variant.stock} remaining
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 shadow-md">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                💡 Pro Tips for Your Products
              </h3>
              <ul className="space-y-3 text-base text-blue-800">
                <li className="flex items-start gap-2">
                  <CheckCircle
                    size={18}
                    className="text-green-600 flex-shrink-0 mt-1"
                  />
                  <span>
                    **High-Quality Images**: Use clear, well-lit photos (at
                    least 3-5 images) to showcase your product from various
                    angles.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle
                    size={18}
                    className="text-green-600 flex-shrink-0 mt-1"
                  />
                  <span>
                    **Detailed Description**: Provide a comprehensive and
                    appealing description that highlights key features,
                    benefits, and specifications.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle
                    size={18}
                    className="text-green-600 flex-shrink-0 mt-1"
                  />
                  <span>
                    **Accurate Pricing & Stock**: Regularly update your prices
                    and stock quantities to avoid discrepancies and ensure a
                    smooth customer experience.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle
                    size={18}
                    className="text-green-600 flex-shrink-0 mt-1"
                  />
                  <span>
                    **Relevant Categories**: Choose the most relevant category
                    to improve product discoverability. If a category doesn't
                    exist, feel free to add a new one!
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Mobile Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-sm w-full max-h-[90vh] overflow-y-auto shadow-2xl transform scale-95 animate-zoom-in">
              <div className="p-5 border-b flex items-center justify-between bg-gray-50 rounded-t-3xl">
                <h3 className="text-xl font-bold text-gray-800">
                  Mobile Preview
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="p-5">
                {productData.images.main ? (
                  <img
                    src={productData.images.main}
                    alt={productData.name}
                    className="w-full h-64 object-cover rounded-xl mb-5 shadow-lg"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-base mb-5">
                    No Image
                  </div>
                )}
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {productData.name || "Untitled Product"}
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  {productData.description || "No description provided."}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  {productData.category && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                      {productData.category}
                    </span>
                  )}
                  {parseFloat(productData.discount) > 0 && (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                      -{productData.discount}%
                    </span>
                  )}
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-4">
                  {formatPrice(getMinMaxPrice().min)}
                  {getMinMaxPrice().min !== getMinMaxPrice().max &&
                    ` - ${formatPrice(getMinMaxPrice().max)}`}
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Total Stock:</span>
                    <span className="font-medium">
                      {getTotalStock()} products
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of Variants:</span>
                    <span className="font-medium">
                      {productData.variants.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weight:</span>
                    <span className="font-medium">
                      {productData.weight || "N/A"} kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimensions:</span>
                    <span className="font-medium">
                      {productData.dimensions || "N/A"}
                    </span>
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

export default ProductCreateInterface;
