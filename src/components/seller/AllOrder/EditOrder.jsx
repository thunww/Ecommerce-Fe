import React, { useState, useEffect } from "react";
import {
  Save,
  Upload,
  X,
  Plus,
  Minus,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import orderApi from "../../../api/VendorAPI/orderApi";
import { toast } from "react-toastify";

export default function EditProducts() {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const variantId = searchParams.get("variantId");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState({
    product_id: null,
    product_name: "",
    description: "",
    discount: 0,
    stock: 0,
    sold: 0,
    weight: "",
    dimension: "",
    material: "",
    storage: "",
    ram: "",
    processor: "",
    price: 0,
    image: [],
    variants: [],
    selectedVariant: null,
    size: [],
    color: [],
  });

  const [activeTab, setActiveTab] = useState("basic");
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field, value) => {
    // Handle input change differently based on variantId
    if (variantId && product.selectedVariant) {
      setProduct((prev) => ({
        ...prev,
        selectedVariant: {
          ...prev.selectedVariant,
          [field]: value,
        },
        // Also update the corresponding field in the main product state for display consistency if needed
        // This might be necessary if the input fields are bound directly to product.field even when editing a variant
        [field]: value, // Update the main product state field as well
      }));
    } else {
      setProduct((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleArrayAdd = (field, value, setter) => {
    if (value.trim()) {
      setProduct((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
      setter("");
    }
  };

  const handleArrayRemove = (field, index) => {
    setProduct((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (variantId) {
      // Xử lý upload ảnh cho variant
      const file = files[0];
      if (file) {
        setProduct((prev) => ({
          ...prev,
          image: [
            {
              file: file,
              preview: URL.createObjectURL(file),
            },
          ],
          selectedVariant: {
            ...prev.selectedVariant,
            image_url: URL.createObjectURL(file),
          },
        }));
      }
    } else {
      // Xử lý upload nhiều ảnh cho sản phẩm
      const newFiles = files.map((file) => ({
        file: file,
        preview: URL.createObjectURL(file),
      }));
      setProduct((prev) => ({
        ...prev,
        image: [...prev.image, ...newFiles],
      }));
    }
  };

  const removeImage = (index) => {
    if (variantId) {
      setProduct((prev) => ({
        ...prev,
        image: [],
        selectedVariant: {
          ...prev.selectedVariant,
          image_url: null,
        },
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        image: prev.image.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const formData = new FormData();

      if (variantId) {
        // Cập nhật thông tin variant
        formData.append("size", product.selectedVariant?.size || "");
        formData.append("color", product.selectedVariant?.color || "");
        formData.append("material", product.selectedVariant?.material || "");
        formData.append("storage", product.selectedVariant?.storage || "");
        formData.append("ram", product.selectedVariant?.ram || "");
        formData.append("processor", product.selectedVariant?.processor || "");
        formData.append("price", product.selectedVariant?.price || 0);
        formData.append("stock", product.selectedVariant?.stock || 0);

        // Thêm ảnh nếu có
        if (product.image.length > 0) {
          formData.append("primaryImage", product.image[0].file);
        }
      } else {
        // Cập nhật thông tin sản phẩm
        formData.append("product_name", product.product_name);
        formData.append("description", product.description);
        formData.append("discount", product.discount);
        formData.append("weight", product.weight);
        formData.append("dimension", product.dimension);

        // Thêm ảnh nếu có
        if (product.image.length > 0) {
          product.image.forEach((image, index) => {
            if (index === 0) {
              formData.append("primaryImage", image.file);
            } else {
              formData.append("additionalImages", image.file);
            }
          });
        }
      }

      const response = await orderApi.updateProductOrVariant(
        productId,
        variantId,
        formData
      );

      if (response?.data?.success) {
        toast.success("Update successful!");
        navigate(-1);
      } else {
        throw new Error(
          response?.data?.message || "An error occurred while updating."
        );
      }
    } catch (err) {
      console.error("Lỗi khi lưu thay đổi:", err);
      toast.error(err.message || "Không thể lưu thay đổi.");
      setError(err.message || "Không thể lưu thay đổi.");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Information" },
    { id: "specs", label: "Technical Specifications" },
    { id: "variants", label: "Variants" },
    { id: "images", label: "Images" },
  ];

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!productId) {
          throw new Error("Missing product information for editing");
        }

        const response = await orderApi.getProductsDetailByIds(
          productId,
          variantId
        );

        if (response?.data?.success && response.data.data?.[0]) {
          const productData = response.data.data[0];
          const selectedVariant = variantId
            ? productData.variants?.find(
                (v) => v.variant_id?.toString() === variantId
              )
            : productData.variants?.[0];

          // Xử lý ảnh
          const images =
            variantId && selectedVariant?.image_url
              ? [{ preview: selectedVariant.image_url }]
              : productData.image_url
              ? [{ preview: productData.image_url }]
              : [];

          setProduct({
            ...productData,
            image: images,
            selectedVariant: selectedVariant || null,
            size:
              variantId && selectedVariant?.size
                ? [selectedVariant.size]
                : productData.variants
                    ?.map((v) => v.size)
                    .filter(
                      (value, index, self) => self.indexOf(value) === index
                    ) || [],
            color:
              variantId && selectedVariant?.color
                ? [selectedVariant.color]
                : productData.variants
                    ?.map((v) => v.color)
                    .filter(
                      (value, index, self) => self.indexOf(value) === index
                    ) || [],
          });
        } else {
          throw new Error("Product or variant information not found");
        }
      } catch (err) {
        console.error("Error loading product information:", err);
        setError(
          err.message || "An error occurred while loading product information"
        );
        setProduct({
          product_id: null,
          product_name: "",
          description: "",
          discount: 0,
          stock: 0,
          sold: 0,
          weight: "",
          dimension: "",
          material: "",
          storage: "",
          ram: "",
          processor: "",
          price: 0,
          image: [],
          variants: [],
          selectedVariant: null,
          size: [],
          color: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId, variantId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="mt-4 text-gray-700 font-semibold">
            Loading product information...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error</h3>
          <p className="text-red-600 text-sm mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {variantId ? "Edit Product Variant" : "Edit Product"}
              </h1>
              <p className="text-gray-600 mt-1">
                {variantId
                  ? "Update details for this product variant"
                  : "Update your product information"}
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className={`px-6 py-2 bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${
                  isSaving
                    ? "opacity-50 cursor-not-allowed bg-blue-400"
                    : "hover:bg-blue-700"
                }`}
              >
                <Save size={16} />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-800 border-l-4 border-blue-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-6">
              {/* Basic Information Tab */}
              {activeTab === "basic" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
                    Basic Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={product.product_name}
                        onChange={(e) =>
                          handleInputChange("product_name", e.target.value)
                        }
                        readOnly={!!variantId}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          variantId
                            ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                            : ""
                        }`}
                        placeholder="Enter product name"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Description *
                      </label>
                      <textarea
                        value={product.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        rows={4}
                        readOnly={!!variantId}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          variantId
                            ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                            : ""
                        }`}
                        placeholder="Detailed description of the product"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (VND) *
                      </label>
                      <input
                        type="number"
                        value={product.price}
                        onChange={(e) =>
                          handleInputChange("price", Number(e.target.value))
                        }
                        readOnly={!variantId}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          !variantId
                            ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                            : ""
                        }`}
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount (%)
                      </label>
                      <input
                        type="number"
                        value={product.discount}
                        onChange={(e) =>
                          handleInputChange("discount", Number(e.target.value))
                        }
                        readOnly={!!variantId}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          variantId
                            ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                            : ""
                        }`}
                        placeholder="0"
                        min="0"
                        max="100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock *
                      </label>
                      <input
                        type="number"
                        value={product.stock}
                        onChange={(e) =>
                          handleInputChange("stock", Number(e.target.value))
                        }
                        readOnly={!variantId}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          !variantId
                            ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                            : ""
                        }`}
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sold
                      </label>
                      <input
                        type="number"
                        value={product.sold}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Technical Specifications Tab */}
              {activeTab === "specs" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
                    Technical Specifications
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight
                      </label>
                      <input
                        type="text"
                        value={product.weight}
                        onChange={(e) =>
                          handleInputChange("weight", e.target.value)
                        }
                        readOnly={!variantId}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          !variantId
                            ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                            : ""
                        }`}
                        placeholder="e.g., 221g"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dimensions
                      </label>
                      <input
                        type="text"
                        value={product.dimension}
                        onChange={(e) =>
                          handleInputChange("dimension", e.target.value)
                        }
                        readOnly={!!variantId}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          variantId
                            ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                            : ""
                        }`}
                        placeholder="e.g., 159.9 x 76.7 x 8.25 mm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Material
                      </label>
                      <input
                        type="text"
                        value={product.material}
                        onChange={(e) =>
                          handleInputChange("material", e.target.value)
                        }
                        readOnly={!variantId}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          !variantId
                            ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                            : ""
                        }`}
                        placeholder="e.g., Titanium"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Internal Storage
                      </label>
                      <input
                        type="text"
                        value={product.storage}
                        onChange={(e) =>
                          handleInputChange("storage", e.target.value)
                        }
                        readOnly={!variantId}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          !variantId
                            ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                            : ""
                        }`}
                        placeholder="e.g., 256GB"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        RAM
                      </label>
                      <input
                        type="text"
                        value={product.ram}
                        onChange={(e) =>
                          handleInputChange("ram", e.target.value)
                        }
                        readOnly={!variantId}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          !variantId
                            ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                            : ""
                        }`}
                        placeholder="e.g., 8GB"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Processor
                      </label>
                      <input
                        type="text"
                        value={product.processor}
                        onChange={(e) =>
                          handleInputChange("processor", e.target.value)
                        }
                        readOnly={!variantId}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          !variantId
                            ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                            : ""
                        }`}
                        placeholder="e.g., A17 Pro"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Variants Tab */}
              {activeTab === "variants" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
                    Product Variants
                  </h2>

                  {/* Size variants */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Size / Capacity
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {/* Display selected variant's size as input if editing variant, else display all product sizes */}
                      {variantId
                        ? product.selectedVariant && (
                            <input
                              type="text"
                              value={product.selectedVariant.size || ""}
                              onChange={(e) =>
                                handleInputChange("size", e.target.value)
                              }
                              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter size"
                            />
                          )
                        : // Display all product sizes if editing product
                          product.size.map((size, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                            >
                              {size}
                              <button
                                onClick={() => handleArrayRemove("size", index)}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                                disabled={!!variantId} // Disable removal if editing variant
                              >
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                    </div>
                    {!variantId && ( // Only display when no variantId
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newSize}
                          onChange={(e) => setNewSize(e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Add new size"
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            handleArrayAdd("size", newSize, setNewSize)
                          }
                          disabled={!!variantId} // Disable adding if editing variant
                        />
                        <button
                          onClick={() =>
                            handleArrayAdd("size", newSize, setNewSize)
                          }
                          className={`px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors ${
                            variantId
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-blue-700"
                          }`}
                          disabled={!!variantId} // Disable button if editing variant
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Color variants */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Color
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {/* Display selected variant's color as input if editing variant, else display all product colors */}
                      {variantId
                        ? product.selectedVariant && (
                            <input
                              type="text"
                              value={product.selectedVariant.color || ""}
                              onChange={(e) =>
                                handleInputChange("color", e.target.value)
                              }
                              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter color"
                            />
                          )
                        : // Display all product colors if editing product
                          product.color.map((color, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                            >
                              {color}
                              <button
                                onClick={() =>
                                  handleArrayRemove("color", index)
                                }
                                className="ml-2 text-green-600 hover:text-green-800"
                                disabled={!!variantId} // Disable removal if editing variant
                              >
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                    </div>
                    {!variantId && ( // Only display when no variantId
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newColor}
                          onChange={(e) => setNewColor(e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Add new color"
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            handleArrayAdd("color", newColor, setNewColor)
                          }
                          disabled={!!variantId} // Disable adding if editing variant
                        />
                        <button
                          onClick={() =>
                            handleArrayAdd("color", newColor, setNewColor)
                          }
                          className={`px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors ${
                            variantId
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-blue-700"
                          }`}
                          disabled={!!variantId} // Disable button if editing variant
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Images Tab */}
              {activeTab === "images" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
                    Product Images
                  </h2>

                  {/* Upload area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id={variantId ? "variant-image-upload" : "image-upload"}
                      multiple={!variantId}
                    />
                    <label
                      htmlFor={
                        variantId ? "variant-image-upload" : "image-upload"
                      }
                      className="cursor-pointer"
                    >
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        {variantId
                          ? "Upload Variant Image"
                          : "Upload Product Images"}
                      </p>
                      <p className="text-gray-600">
                        {variantId
                          ? "Drag and drop or click to select image"
                          : "Drag and drop or click to select multiple images"}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </label>
                  </div>

                  {/* Image preview */}
                  {(product.image.length > 0 ||
                    (variantId && product.selectedVariant?.image_url)) && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Images ({product.image.length})
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {!variantId
                          ? // Display product images
                            product.image.map((img, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={img.preview || img}
                                  alt={`Product ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                />
                                <button
                                  onClick={() => removeImage(index)}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={14} />
                                </button>
                                {index === 0 && (
                                  <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                    Main Image
                                  </div>
                                )}
                              </div>
                            ))
                          : // Display variant image
                            product.image.length > 0 && (
                              <div className="relative group">
                                <img
                                  src={
                                    product.image[0].preview || product.image[0]
                                  }
                                  alt="Variant Image"
                                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                />
                                <button
                                  onClick={() => removeImage(0)}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
