import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaSave,
  FaTimes,
  FaUpload,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import productService from "../../services/productService";

const AddProduct = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    stock: "",
    sku: "",
    categoryId: "",
    status: "unpublished",
    type: "physical",
    weight: "",
    dimensions: "",
    specifications: [],
  });

  // Nạp danh sách danh mục khi component được mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productService.getCategories();
        if (data && Array.isArray(data)) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách danh mục:", error);
        toast.error("Không thể tải danh sách danh mục sản phẩm");
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Xử lý đặc biệt cho trường giá
    if (
      name === "price" ||
      name === "originalPrice" ||
      name === "stock" ||
      name === "weight"
    ) {
      // Chỉ cho phép nhập số
      if (value === "" || /^\d+$/.test(value)) {
        setProduct({ ...product, [name]: value });
      }
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleDescriptionChange = (e) => {
    setProduct({ ...product, description: e.target.value });
  };

  const handleCategoryChange = (e) => {
    setProduct({ ...product, categoryId: e.target.value });
  };

  const handleStatusChange = (e) => {
    setProduct({ ...product, status: e.target.value });
  };

  const handleTypeChange = (e) => {
    setProduct({ ...product, type: e.target.value });
  };

  const handleSpecificationChange = (index, field, value) => {
    const updatedSpecs = [...product.specifications];
    updatedSpecs[index] = {
      ...updatedSpecs[index],
      [field]: value,
    };
    setProduct({ ...product, specifications: updatedSpecs });
  };

  const addSpecification = () => {
    setProduct({
      ...product,
      specifications: [...product.specifications, { name: "", value: "" }],
    });
  };

  const removeSpecification = (index) => {
    const updatedSpecs = [...product.specifications];
    updatedSpecs.splice(index, 1);
    setProduct({ ...product, specifications: updatedSpecs });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Giới hạn số lượng file
    if (files.length + selectedFiles.length > 5) {
      toast.warning("Chỉ được phép tải lên tối đa 5 ảnh");
      return;
    }

    // Kiểm tra kích thước và định dạng file
    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.warning(`File ${file.name} vượt quá kích thước tối đa (5MB)`);
        return false;
      }
      if (!file.type.match("image.*")) {
        toast.warning(`File ${file.name} không phải là ảnh`);
        return false;
      }
      return true;
    });

    // Thêm file mới vào danh sách
    setSelectedFiles([...selectedFiles, ...validFiles]);

    // Tạo URL để xem trước ảnh
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviews]);
  };

  const removeImage = (index) => {
    const updatedFiles = [...selectedFiles];
    const updatedPreviews = [...previewImages];

    // Giải phóng URL để tránh rò rỉ bộ nhớ
    URL.revokeObjectURL(updatedPreviews[index]);

    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setSelectedFiles(updatedFiles);
    setPreviewImages(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    if (
      !product.name ||
      !product.price ||
      !product.stock ||
      !product.categoryId
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      setLoading(true);

      // Chuẩn bị dữ liệu sản phẩm
      const productData = {
        product_name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        original_price: product.originalPrice
          ? parseFloat(product.originalPrice)
          : null,
        stock_quantity: parseInt(product.stock),
        sku: product.sku,
        category_id: parseInt(product.categoryId),
        status: product.status,
        product_type: product.type,
        weight: product.weight ? parseInt(product.weight) : null,
        dimensions: product.dimensions,
        specifications:
          product.specifications.length > 0 ? product.specifications : null,
      };

      // Tạo sản phẩm mới
      const response = await productService.createProduct(productData);

      if (response && response.product_id) {
        // Upload ảnh nếu có
        if (selectedFiles.length > 0) {
          await Promise.all(
            selectedFiles.map((file) =>
              productService.uploadProductImage(response.product_id, file)
            )
          );
        }

        toast.success("Tạo sản phẩm mới thành công");
        navigate(`/vendor/product/${response.product_id}`);
      } else {
        toast.error("Có lỗi xảy ra khi tạo sản phẩm");
      }
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      toast.error(
        "Lỗi khi tạo sản phẩm: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex items-center mb-6 border-b pb-4">
          <button
            onClick={() => navigate("/vendor/products")}
            className="mr-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
          >
            <FaArrowLeft className="text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold">Thêm sản phẩm mới</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Thông tin cơ bản */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Thông tin cơ bản</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả sản phẩm
                </label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleDescriptionChange}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="categoryId"
                    value={product.categoryId}
                    onChange={handleCategoryChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((category) => (
                      <option
                        key={category.category_id}
                        value={category.category_id}
                      >
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={product.sku}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại sản phẩm
                  </label>
                  <select
                    name="type"
                    value={product.type}
                    onChange={handleTypeChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="physical">Sản phẩm vật lý</option>
                    <option value="digital">Sản phẩm số</option>
                    <option value="service">Dịch vụ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={product.status}
                    onChange={handleStatusChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="unpublished">Chưa đăng bán</option>
                    <option value="active">Đăng bán ngay</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin giá & kho */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Thông tin giá & kho</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá bán <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    ₫
                  </span>
                  <input
                    type="text"
                    name="price"
                    value={product.price}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá gốc
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    ₫
                  </span>
                  <input
                    type="text"
                    name="originalPrice"
                    value={product.originalPrice}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="stock"
                  value={product.stock}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Thông tin vận chuyển */}
          {product.type === "physical" && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">
                Thông tin vận chuyển
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cân nặng (gram)
                  </label>
                  <input
                    type="text"
                    name="weight"
                    value={product.weight}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kích thước (DxRxC, cm)
                  </label>
                  <input
                    type="text"
                    name="dimensions"
                    value={product.dimensions}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Ví dụ: 10x5x3"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Hình ảnh sản phẩm */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Hình ảnh sản phẩm</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {/* Hiển thị ảnh đã chọn */}
                {previewImages.map((preview, index) => (
                  <div
                    key={index}
                    className="relative border rounded-lg overflow-hidden h-32"
                  >
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                ))}

                {/* Nút thêm ảnh */}
                {previewImages.length < 5 && (
                  <div className="border rounded-lg h-32 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                    <input
                      type="file"
                      id="product-images"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="product-images"
                      className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
                    >
                      <FaUpload className="text-gray-400 text-2xl mb-2" />
                      <span className="text-sm text-gray-500">Thêm ảnh</span>
                    </label>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * Tối đa 5 ảnh, kích thước tối đa 5MB/ảnh
              </p>
            </div>
          </div>

          {/* Thông số kỹ thuật */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Thông số kỹ thuật</h2>
              <button
                type="button"
                onClick={addSpecification}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded flex items-center hover:bg-gray-300 transition-colors"
              >
                <FaPlus className="mr-1" size={12} /> Thêm thông số
              </button>
            </div>

            {product.specifications.length > 0 ? (
              <div className="space-y-3">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={spec.name}
                      onChange={(e) =>
                        handleSpecificationChange(index, "name", e.target.value)
                      }
                      placeholder="Tên thông số"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) =>
                        handleSpecificationChange(
                          index,
                          "value",
                          e.target.value
                        )
                      }
                      placeholder="Giá trị"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      className="p-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Chưa có thông số kỹ thuật. Nhấn "Thêm thông số" để bắt đầu.
              </p>
            )}
          </div>

          {/* Các nút thao tác */}
          <div className="flex justify-end space-x-4 mt-8 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate("/vendor/products")}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center"
            >
              <FaTimes className="mr-2" /> Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors flex items-center ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <div className="mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" /> Lưu sản phẩm
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
