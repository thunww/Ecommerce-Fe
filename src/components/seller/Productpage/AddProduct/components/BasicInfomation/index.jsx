import React, { useState, useRef, useEffect } from "react";
import productService from "../../../../../../services/productService";
import { toast } from "react-toastify";

const BasicInformation = ({ productData, onInputChange }) => {
  const [imageRatio, setImageRatio] = useState("1:1"); // Mặc định là 1:1
  const [productImages, setProductImages] = useState([]); // Quản lý danh sách ảnh sản phẩm
  const [promotionImage, setPromotionImage] = useState(null); // Quản lý ảnh khuyến mãi
  const [categories, setCategories] = useState([]); // Danh sách danh mục
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false); // Hiển thị dropdown danh mục
  const [isLoadingCategories, setIsLoadingCategories] = useState(false); // Trạng thái đang tải danh mục
  const [categoryError, setCategoryError] = useState(null); // Lỗi khi tải danh mục

  // Refs cho input file
  const productImagesInputRef = useRef(null);
  const promotionImageInputRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  // Fetch danh sách danh mục khi component được mount
  const fetchCategories = async (skipCache = false) => {
    try {
      setIsLoadingCategories(true);
      setCategoryError(null);
      const response = await productService.getCategories(skipCache);

      // Kiểm tra và lấy đúng dữ liệu categories từ response
      if (response && response.data) {
        setCategories(response.data);
      } else if (Array.isArray(response)) {
        // Trường hợp response trả về trực tiếp là mảng
        setCategories(response);
      } else {
        console.error("Dữ liệu categories không đúng định dạng:", response);
        setCategoryError("Định dạng dữ liệu không đúng");
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategoryError("Không thể tải danh mục");
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cập nhật phương thức useEffect để đồng bộ hóa productImages với productData
  useEffect(() => {
    // Nếu có ảnh từ productData, cập nhật state
    if (productData.images && productData.images.length > 0) {
      setProductImages(productData.images);
    }

    // Nếu có ảnh khuyến mãi từ productData, cập nhật state
    if (productData.promotionImage) {
      setPromotionImage(productData.promotionImage);
    }
  }, []);

  // Hàm xử lý khi thay đổi tỷ lệ ảnh
  const handleRatioChange = (ratio) => {
    setImageRatio(ratio);
  };

  // Hàm xử lý khi chọn danh mục
  const handleCategorySelect = (category) => {
    // Chỉ lưu category_id và hiển thị category_name
    onInputChange("category", category.category_id);
    // Lưu category_name chỉ để hiển thị
    onInputChange("selectedCategoryName", category.category_name);
    setShowCategoryDropdown(false);
  };

  // Hàm xử lý upload ảnh sản phẩm
  const handleProductImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    console.log("Files được chọn:", files);

    if (files.length + productImages.length > 9) {
      toast.error("Bạn chỉ có thể tải lên tối đa 9 ảnh sản phẩm");
      return;
    }

    // Kiểm tra kích thước và định dạng ảnh
    const validFiles = files.filter((file) => {
      console.log("Đang kiểm tra file:", file.name, file.type, file.size);

      const isValidType = file.type.match(/^image\/(jpeg|jpg|png)$/i);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

      if (!isValidType) {
        toast.error(
          `File "${file.name}" không phải là định dạng ảnh hợp lệ (JPG, JPEG, PNG)`
        );
        return false;
      }

      if (!isValidSize) {
        toast.error(`File "${file.name}" vượt quá kích thước tối đa 5MB`);
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) {
      return;
    }

    // Thêm các file hợp lệ vào state
    const newImages = [...productImages, ...validFiles];
    setProductImages(newImages);
    onInputChange("images", newImages);

    toast.success(`Đã thêm ${validFiles.length} ảnh sản phẩm`);
  };

  // Hàm xóa ảnh sản phẩm
  const removeProductImage = (index) => {
    const newImages = [...productImages];
    newImages.splice(index, 1);
    setProductImages(newImages);
    onInputChange("images", newImages);
    toast.info("Đã xóa ảnh sản phẩm");
  };

  // Hàm xóa ảnh khuyến mãi
  const removePromotionImage = () => {
    setPromotionImage(null);
    onInputChange("promotionImage", null);
    toast.info("Đã xóa ảnh khuyến mãi");
  };

  // Thêm hàm xử lý upload ảnh khuyến mãi
  const handlePromotionImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Kiểm tra định dạng
    const isValidType = file.type.match(/^image\/(jpeg|jpg|png)$/i);
    if (!isValidType) {
      toast.error("Chỉ chấp nhận file ảnh định dạng JPG, JPEG, PNG");
      return;
    }

    // Kiểm tra kích thước
    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      toast.error("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    // Cập nhật state và productData
    setPromotionImage(file);
    onInputChange("promotionImage", file);
    toast.success("Đã thêm ảnh khuyến mãi");
  };

  // Tính toán kích thước khung addImage dựa trên tỷ lệ
  const getImageContainerStyle = () => {
    if (imageRatio === "1:1") {
      return "w-[120px] h-[120px]";
    } else if (imageRatio === "3:4") {
      // Tỷ lệ 3:4 chuẩn quốc tế (3cm x 4cm)
      // Giữ chiều cao 120px và điều chỉnh chiều rộng theo tỷ lệ 3:4
      return "w-[90px] h-[120px]";
    }
    return "w-[120px] h-[120px]";
  };

  return (
    <div className="space-y-8">
      {/* Product Images */}
      <div className="grid grid-cols-[180px,1fr] gap-2">
        <div className="flex items-start">
          <span className="text-red-500 mr-0.5">*</span>
          <span className="text-sm">Product Images</span>
        </div>
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => handleRatioChange("1:1")}
            >
              <span
                className={`w-4 h-4 rounded-full ${
                  imageRatio === "1:1"
                    ? "bg-red-500 text-white"
                    : "border border-gray-300 text-gray-500"
                } flex items-center justify-center text-xs`}
              >
                1
              </span>
              <span className="text-sm text-gray-600">1:1 Image</span>
            </div>
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => handleRatioChange("3:4")}
            >
              <span
                className={`w-4 h-4 rounded-full ${
                  imageRatio === "3:4"
                    ? "bg-red-500 text-white"
                    : "border border-gray-300 text-gray-500"
                } flex items-center justify-center text-xs`}
              >
                2
              </span>
              <span className="text-sm text-gray-600">3:4 Image</span>
            </div>
            <button className="text-blue-600 text-sm">View Example</button>
          </div>

          {/* Thông tin hướng dẫn */}
          <div className="text-xs text-gray-500 mb-3">
            <div className="font-medium text-red-500">
              • Yêu cầu tải lên ít nhất 1 hình ảnh sản phẩm (tối đa 9 ảnh)
            </div>
            <div>• Định dạng: JPG, JPEG, PNG</div>
            <div>• Kích thước tối đa: 5MB mỗi ảnh</div>
            <div>
              • Ảnh nên rõ ràng, không chứa text quảng cáo và được chụp trên nền
              trắng
            </div>
          </div>

          {/* Hiển thị ảnh đã tải lên */}
          <div className="flex flex-wrap gap-2 mb-2">
            {productImages.map((image, index) => (
              <div key={index} className="relative">
                <div
                  className={`${
                    imageRatio === "1:1"
                      ? "w-[120px] h-[120px]"
                      : "w-[90px] h-[120px]"
                  } bg-gray-100 rounded border flex items-center justify-center`}
                >
                  <img
                    src={
                      image instanceof File ? URL.createObjectURL(image) : image
                    }
                    alt={`Product ${index + 1}`}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white text-xs px-1">
                  {image instanceof File
                    ? Math.round(image.size / 1024) + " KB"
                    : "Uploaded"}
                </span>
                <button
                  onClick={() => removeProductImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Khung upload ảnh */}
          {productImages.length < 9 && (
            <div
              className={`border border-dashed ${
                productImages.length === 0
                  ? "border-red-400"
                  : "border-gray-300"
              } rounded p-2 ${getImageContainerStyle()} flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-all duration-300`}
              onClick={() => productImagesInputRef.current.click()}
            >
              <input
                type="file"
                ref={productImagesInputRef}
                onChange={handleProductImagesUpload}
                accept="image/jpeg, image/png, image/jpg"
                multiple
                className="hidden"
              />
              <div className="w-6 h-6 mb-1">
                <svg viewBox="0 0 24 24" fill="none" className="text-red-500">
                  <path
                    d="M12 4v16m8-8H4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span
                className={`text-xs ${
                  productImages.length === 0
                    ? "text-red-500 font-medium"
                    : "text-gray-500"
                }`}
              >
                {productImages.length === 0
                  ? "Add Image (Required)"
                  : `Add Image (${productImages.length}/9)`}
              </span>
              <span className="text-xs text-gray-400 mt-1">{imageRatio}</span>
            </div>
          )}
        </div>
      </div>
      {/* Promotion Image */}
      <div className="grid grid-cols-[180px,1fr] gap-2">
        <div className="flex items-start">
          <span className="text-red-500 mr-0.5">*</span>
          <span className="text-sm">Promotion Image</span>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-2">
            <div>• Upload 1:1 image (tối đa 5MB, định dạng JPG, JPEG, PNG)</div>
            <div>
              • Promotion image will be used on the promotion page, search
              result page, daily discover, etc... Upload Promotion Image will
              inspire buyers to click on your product.
            </div>
          </div>

          {/* Hiển thị ảnh khuyến mãi đã tải lên */}
          {promotionImage ? (
            <div className="relative w-[120px] h-[120px]">
              <div className="w-full h-full bg-gray-100 rounded border flex items-center justify-center">
                <img
                  src={
                    promotionImage instanceof File
                      ? URL.createObjectURL(promotionImage)
                      : promotionImage
                  }
                  alt="Promotion"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white text-xs px-1">
                {promotionImage instanceof File
                  ? Math.round(promotionImage.size / 1024) + " KB"
                  : "Uploaded"}
              </span>
              <button
                onClick={removePromotionImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ) : (
            <div
              className="border border-dashed border-gray-300 rounded p-2 w-[120px] h-[120px] flex flex-col items-center justify-center cursor-pointer hover:border-gray-400"
              onClick={() => promotionImageInputRef.current.click()}
            >
              <input
                type="file"
                ref={promotionImageInputRef}
                onChange={handlePromotionImageUpload}
                accept="image/jpeg, image/png, image/jpg"
                className="hidden"
              />
              <div className="w-6 h-6 mb-1">
                <svg viewBox="0 0 24 24" fill="none" className="text-red-500">
                  <path
                    d="M12 4v16m8-8H4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="text-xs text-gray-500">
                Add Image (Optional)
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Product Name */}
      <div className="grid grid-cols-[180px,1fr] gap-2">
        <div className="flex items-start">
          <span className="text-red-500 mr-0.5">*</span>
          <span className="text-sm">Product Name</span>
        </div>
        <div className="relative">
          <input
            type="text"
            value={productData.productName}
            onChange={(e) => onInputChange("productName", e.target.value)}
            placeholder="Brand Name + Product Type + Key Features (Materials, Colors, Size, Model)"
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            maxLength={120}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            {productData.productName.length}/120
          </span>
        </div>
      </div>
      {/* Category */}
      <div className="grid grid-cols-[180px,1fr] gap-2">
        <div className="flex items-start">
          <span className="text-red-500 mr-0.5">*</span>
          <span className="text-sm">Category</span>
        </div>
        <div className="relative" ref={categoryDropdownRef}>
          <input
            type="text"
            value={productData.selectedCategoryName || ""}
            readOnly
            placeholder="Please set category"
            onClick={() => setShowCategoryDropdown(true)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50 cursor-pointer"
          />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${
                showCategoryDropdown ? "rotate-90" : ""
              }`}
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

          {/* Dropdown danh mục */}
          {showCategoryDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {isLoadingCategories ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  Loading Category...
                </div>
              ) : categoryError ? (
                <div className="p-3">
                  <div className="text-sm text-red-500 mb-2">
                    {categoryError}
                  </div>
                  <button
                    className="text-sm bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => fetchCategories(true)}
                  >
                    Loadding Category
                  </button>
                </div>
              ) : categories.length > 0 ? (
                <div>
                  <div className="flex justify-between items-center px-3 py-1 border-b">
                    <span className="text-xs text-gray-500">
                      Have {categories.length} categories
                    </span>
                    <button
                      className="text-xs text-blue-500"
                      onClick={() => fetchCategories(true)}
                    >
                      Loadding Category
                    </button>
                  </div>
                  <ul className="py-1">
                    {categories.map((category) => (
                      <li
                        key={category.category_id}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleCategorySelect(category)}
                      >
                        {category.category_name}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="p-3">
                  <div className="text-sm text-gray-500 mb-2">
                    No category found
                  </div>
                  <button
                    className="text-sm bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => fetchCategories(true)}
                  >
                    Loadding Category
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Product Description */}
      <div className="grid grid-cols-[180px,1fr] gap-2">
        <div className="flex items-start">
          <span className="text-red-500 mr-0.5">*</span>
          <span className="text-sm">Product Description</span>
        </div>
        <div className="relative">
          <textarea
            value={productData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm min-h-[200px] resize-none"
            maxLength={3000}
            placeholder="Please enter product description"
          />
          <span className="absolute right-3 bottom-3 text-xs text-gray-400">
            {productData.description.length}/3000
          </span>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
