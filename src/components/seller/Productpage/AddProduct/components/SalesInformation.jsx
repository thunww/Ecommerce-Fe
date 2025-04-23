import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {
  API_BASE_URL,
  UPLOAD_URL,
  DEFAULT_PRODUCT_IMAGE,
} from "../../../../../config/config";

// URL ảnh mặc định từ config
// const DEFAULT_IMAGE_URL = "https://cdn.tgdd.vn/Products/Images/1942/279935/TimerThumb/smart-samsung-4k-43-inch-ua43au7002-(40).jpg";

const SalesInformation = ({ hasCategory, productData, onInputChange }) => {
  const [showVariations, setShowVariations] = useState(false);
  const [variations, setVariations] = useState([
    { id: 1, name: "", options: [] },
  ]);
  const [variantList, setVariantList] = useState([
    { id: 1, image: null, imageUrl: null, price: "", stock: "0", sku: "" },
  ]);
  const [price, setPrice] = useState(productData.price || "");
  const [stock, setStock] = useState(productData.stock || "");
  const fileInputRef = useRef(null);
  const [applyAllValues, setApplyAllValues] = useState({
    price: "",
    stock: "",
    sku: "",
  });

  // Đồng bộ dữ liệu từ productData khi component mount
  useEffect(() => {
    if (productData.price) setPrice(productData.price);
    if (productData.stock) setStock(productData.stock);

    if (productData.variations && productData.variations.length > 0) {
      // Đảm bảo mỗi biến thể có weight và các trường cần thiết
      const updatedVariations = productData.variations.map(
        (variant, index) => ({
          ...variant,
          weight: variant.weight || productData.weight || "",
          material: variant.material || `variation${index + 1}`,
          option: variant.option || variant.color || "",
        })
      );

      setVariantList(updatedVariations);
      setShowVariations(true);
    } else if (productData.weight) {
      // Nếu không có variations nhưng có weight, cập nhật variantList
      setVariantList((prevList) =>
        prevList.map((variant) => ({
          ...variant,
          weight: productData.weight,
        }))
      );
    }
  }, [productData]);

  // Thêm variation mới
  const handleAddVariation = () => {
    // Kiểm tra nếu đã có 2 variations thì không cho thêm nữa
    if (variations.length >= 2) return;

    setVariations([
      ...variations,
      { id: variations.length + 1, name: "", options: [] },
    ]);
    // Cập nhật variantList khi thêm variation mới
    setVariantList((prevList) =>
      prevList.map((variant) => ({
        ...variant,
        variations: [...(variant.variations || []), ""],
      }))
    );
  };

  // Xóa variation
  const handleRemoveVariation = (id) => {
    setVariations(variations.filter((v) => v.id !== id));
    // Cập nhật variantList khi xóa variation
    setVariantList((prevList) =>
      prevList.map((variant) => ({
        ...variant,
        variations:
          variant.variations?.filter((_, index) => index !== id - 1) || [],
      }))
    );
  };

  // Sửa lại hàm generateCombinations để chỉ tạo combinations từ options của variation đầu tiên
  const generateCombinations = (optionsArrays) => {
    // Chỉ lấy options từ variation đầu tiên
    const firstVariationOptions = optionsArrays[0] || [];

    // Mỗi option sẽ tạo ra một variant
    return firstVariationOptions.map((option) => [option]);
  };

  // Sửa lại generateVariantList để đảm bảo color luôn lấy từ option
  const generateVariantList = (variations) => {
    // Nếu không có variations hoặc không có options
    if (!variations.length || !variations[0]?.options?.length) {
      return [
        {
          id: 1,
          color: variations[0]?.options[0] || "", // Lấy option đầu tiên nếu có
          material: variations[0]?.name || "",
          size: "",
          ram: "",
          processor: "",
          storage: "",
          weight: productData.weight || 1,
          price: price || "",
          stock: stock || "0",
          image_url: DEFAULT_PRODUCT_IMAGE,
          option: variations[0]?.options[0] || "", // Đồng bộ với color
        },
      ];
    }

    // Lấy variation đầu tiên và tên của nó
    const firstVariation = variations[0];
    const variationName = firstVariation.name || "";

    // Tạo variant cho mỗi option
    return firstVariation.options.map((option, index) => ({
      id: index + 1,
      color: option, // Luôn lấy giá trị từ option
      material: variationName,
      size: "",
      ram: "",
      processor: "",
      storage: "",
      weight: productData.weight || 1,
      price: price || "",
      stock: stock || "0",
      image_url: DEFAULT_PRODUCT_IMAGE,
      option: option, // Đồng bộ với color
    }));
  };

  // Hàm xử lý khi lưu variant
  const handleSubmit = () => {
    // Đảm bảo mỗi variant có đầy đủ thông tin
    const processedVariants = variantList.map((variant) => {
      // Lấy giá trị color từ option trước, nếu không có thì mới lấy từ color
      const color = variant.option || variant.color || "";
      const material = variant.material || variations[0]?.name || "";

      return {
        ...variant,
        color: color, // Đảm bảo color luôn có giá trị từ option
        material: material,
        option: color, // Đồng bộ option với color
        size: variant.size || "",
        ram: variant.ram || "",
        processor: variant.processor || "",
        storage: variant.storage || "",
        weight: variant.weight || productData.weight || 1,
        price: variant.price || price || "",
        stock: variant.stock || stock || "0",
        image_url: variant.image_url || DEFAULT_PRODUCT_IMAGE,
      };
    });

    // Cập nhật lại variantList với dữ liệu đã xử lý
    setVariantList(processedVariants);
    onInputChange("variations", processedVariants);
  };

  // Hàm xử lý khi thêm option
  const handleAddOption = (variationId, value) => {
    if (!value.trim()) return;

    const trimmedValue = value.trim();

    // Kiểm tra option trùng lặp
    const variationToUpdate = variations.find((v) => v.id === variationId);
    if (variationToUpdate && variationToUpdate.options.includes(trimmedValue)) {
      toast.warning(`Option "${trimmedValue}" đã tồn tại trong danh sách!`);
      return;
    }

    // Cập nhật variations
    const updatedVariations = variations.map((v) =>
      v.id === variationId ? { ...v, options: [...v.options, trimmedValue] } : v
    );
    setVariations(updatedVariations);

    // Chỉ xử lý variant khi là variation đầu tiên và đã bật variations
    if (variationId === 1 && showVariations) {
      const currentMaterial = updatedVariations[0]?.name || "";

      // Tạo variant mới với color và option cùng giá trị
      const newVariant = {
        id: variantList.length + 1,
        color: trimmedValue,
        option: trimmedValue, // Đảm bảo option luôn có cùng giá trị với color
        material: currentMaterial,
        size: "",
        ram: "",
        processor: "",
        storage: "",
        weight: productData.weight || 1,
        price: price || "",
        stock: stock || "0",
        image_url: DEFAULT_PRODUCT_IMAGE,
      };

      // Cập nhật variantList
      const updatedList = [...variantList, newVariant];
      setVariantList(updatedList);
      onInputChange("variations", updatedList);
    }
  };

  // Sửa lại handleVariantChange để đảm bảo không ghi đè color
  const handleVariantChange = (variantId, field, value) => {
    const updatedVariantList = variantList.map((variant) => {
      if (variant.id === variantId) {
        const updatedVariant = { ...variant };

        // Xử lý đặc biệt cho trường color và option
        if (field === "color" || field === "option") {
          updatedVariant.color = value;
          updatedVariant.option = value; // Luôn đồng bộ color và option
        } else {
          updatedVariant[field] = value || "";
        }

        // Chuẩn hóa giá trị số
        if (field === "price" && value) {
          const cleanPrice = parseFloat(value);
          if (!isNaN(cleanPrice)) {
            updatedVariant.price = cleanPrice;
          }
        }
        if (field === "stock" && value) {
          const cleanStock = parseInt(value);
          if (!isNaN(cleanStock)) {
            updatedVariant.stock = cleanStock;
          }
        }

        return updatedVariant;
      }
      return variant;
    });

    setVariantList(updatedVariantList);
    onInputChange("variations", updatedVariantList);
  };

  // Sửa lại handleVariationNameChange để không ảnh hưởng đến color
  const handleVariationNameChange = (id, value) => {
    // Cập nhật tên variation
    const updatedVariations = variations.map((v) =>
      v.id === id ? { ...v, name: value } : v
    );
    setVariations(updatedVariations);

    // Chỉ cập nhật material khi thay đổi tên variation đầu tiên
    if (id === 1) {
      const updatedVariantList = variantList.map((variant) => ({
        ...variant,
        material: value || "", // Chỉ cập nhật material
        color: variant.option || variant.color || "", // Giữ nguyên color từ option
      }));

      setVariantList(updatedVariantList);
      onInputChange("variations", updatedVariantList);
    }
  };

  // Sửa lại handleRemoveOption để đảm bảo xóa đúng variant khi xóa option
  const handleRemoveOption = (variationId, optionIndex) => {
    // Lấy giá trị option trước khi xóa
    const optionToRemove = variations.find((v) => v.id === variationId)
      ?.options[optionIndex];

    const updatedVariations = variations.map((v) =>
      v.id === variationId
        ? {
            ...v,
            options: v.options.filter((_, index) => index !== optionIndex),
          }
        : v
    );
    setVariations(updatedVariations);

    // Nếu đang xóa option từ variation đầu tiên (ảnh hưởng đến color)
    if (variationId === 1 && optionToRemove) {
      // Xóa variant tương ứng với option đó
      const updatedVariantList = variantList.filter(
        (variant) =>
          variant.color !== optionToRemove && variant.option !== optionToRemove
      );

      setVariantList(updatedVariantList);
      onInputChange("variations", updatedVariantList);
    }
  };

  // Validate file
  const validateFile = (file) => {
    // Kiểm tra kích thước file (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size should not exceed 5MB");
      return false;
    }

    // Kiểm tra định dạng file
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload an image file (JPEG, PNG, GIF)");
      return false;
    }

    return true;
  };

  // Xử lý upload ảnh
  const handleImageUpload = async (variantId, file) => {
    try {
      if (!file || !validateFile(file)) return;

      // Tạo URL preview tạm thời
      const previewUrl = URL.createObjectURL(file);

      // Hiển thị trạng thái đang tải
      toast.info("Đang tải ảnh lên...");

      // Tạo FormData để gửi file
      const formData = new FormData();
      formData.append("image", file);

      // Gọi API upload ảnh
      const response = await axios.post(UPLOAD_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Log để kiểm tra response format
      console.log("Response từ API upload:", response.data);

      // LUÔN sử dụng URL ảnh mặc định thay vì URL từ server
      // const uploadedUrl = response.data.data?.image_url;
      const uploadedUrl = DEFAULT_PRODUCT_IMAGE;

      console.log("Sử dụng URL ảnh mặc định:", uploadedUrl);

      // Cập nhật variant với ảnh mới và URL thật từ server
      const updatedVariantList = variantList.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              image: file, // Giữ file để có thể tham chiếu nếu cần
              imageUrl: previewUrl, // URL tạm thời để hiển thị preview
              image_url: uploadedUrl, // LUÔN sử dụng URL ảnh mặc định
            }
          : variant
      );

      // Cập nhật state
      setVariantList(updatedVariantList);

      // Thông báo thành công
      toast.success("Tải ảnh lên thành công (Sử dụng ảnh mặc định)");

      // Gửi thông báo về component cha để cập nhật variations
      onInputChange("variations", updatedVariantList);
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên:", error);
      toast.error(
        "Tải ảnh lên thất bại: " +
          (error.response?.data?.message ||
            error.message ||
            "Đã xảy ra lỗi không xác định")
      );
    }
  };

  // Xử lý click vào nút upload
  const handleUploadClick = (variantId) => {
    fileInputRef.current.click();
    fileInputRef.current.dataset.variantId = variantId;
  };

  // Xử lý khi chọn file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const variantId = parseInt(fileInputRef.current.dataset.variantId);
    if (file) {
      handleImageUpload(variantId, file);
    }
  };

  // Xóa ảnh
  const handleRemoveImage = (variantId) => {
    setVariantList((prevList) =>
      prevList.map((variant) =>
        variant.id === variantId
          ? { ...variant, image: null, imageUrl: null }
          : variant
      )
    );
  };

  // Xử lý thay đổi giá trị Apply to All
  const handleApplyAllChange = (field, value) => {
    setApplyAllValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Xử lý khi click Apply to All
  const handleApplyToAll = () => {
    const updatedVariantList = variantList.map((variant) => {
      const updates = {};

      // Chỉ cập nhật các trường có giá trị
      if (applyAllValues.price !== "") {
        updates.price = applyAllValues.price;
      }
      if (applyAllValues.stock !== "") {
        updates.stock = applyAllValues.stock;
      }
      if (applyAllValues.sku !== "") {
        updates.sku = applyAllValues.sku;
      }

      // Lấy giá trị material từ variant hiện tại hoặc từ tên của variation đầu tiên
      const material = variant.material || variations[0]?.name || "Variation1";

      // Lấy giá trị color từ variant hiện tại (option/color) hoặc mặc định
      const color = variant.color || variant.option || "Default";

      // Đảm bảo giữ lại các trường này
      return {
        ...variant,
        ...updates,
        option: color, // Giữ lại giá trị làm color
        color: color, // Đảm bảo color luôn có giá trị
        material: material, // Giữ lại material
        weight: productData.weight || variant.weight || "", // Lấy weight từ productData hoặc giữ lại nếu đã có
        image_url: variant.image_url || DEFAULT_PRODUCT_IMAGE, // Đảm bảo luôn có URL ảnh
      };
    });

    setVariantList(updatedVariantList);

    // Cập nhật giá trị về component cha
    if (applyAllValues.price !== "") {
      onInputChange("price", applyAllValues.price);
      setPrice(applyAllValues.price);
    }

    if (applyAllValues.stock !== "") {
      onInputChange("stock", applyAllValues.stock);
      setStock(applyAllValues.stock);
    }

    // Cập nhật variations cho component cha
    onInputChange("variations", updatedVariantList);

    // Reset giá trị sau khi áp dụng
    setApplyAllValues({
      price: "",
      stock: "",
      sku: "",
    });

    toast.success("Values applied to all variations successfully");
  };

  // Xử lý khi thay đổi giá cơ bản
  const handlePriceChange = (value) => {
    setPrice(value);
    onInputChange("price", value);

    // Nếu không có biến thể, cập nhật giá cho biến thể mặc định
    if (variantList.length === 1 && !showVariations) {
      const updatedVariantList = variantList.map((variant) => ({
        ...variant,
        price: value,
        image_url: variant.image_url || DEFAULT_PRODUCT_IMAGE, // Đảm bảo luôn có URL ảnh
      }));
      setVariantList(updatedVariantList);
      onInputChange("variations", updatedVariantList);
    }
  };

  // Xử lý khi thay đổi tồn kho cơ bản
  const handleStockChange = (value) => {
    setStock(value);
    onInputChange("stock", value);

    // Nếu không có biến thể, cập nhật tồn kho cho biến thể mặc định
    if (variantList.length === 1 && !showVariations) {
      const updatedVariantList = variantList.map((variant) => ({
        ...variant,
        stock: value,
      }));
      setVariantList(updatedVariantList);
      onInputChange("variations", updatedVariantList);
    }
  };

  return (
    <div>
      <div className="space-y-8">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        <h2 className="text-base font-medium">Sales Information</h2>

        {!hasCategory ? (
          <div className="text-center py-8 text-gray-500">
            Available only after you select a product category
          </div>
        ) : (
          <div className="space-y-8">
            {/* Variations */}
            <div>
              <div className="flex items-start mb-2">
                <span className="text-red-500 mr-1">•</span>
                <span className="text-sm">Variations</span>
              </div>
              <div>
                {!showVariations ? (
                  <button
                    className="inline-flex items-center px-4 py-2 border border-dashed border-red-500 rounded hover:bg-red-50"
                    onClick={() => setShowVariations(true)}
                  >
                    <span className="text-red-500 mr-1">+</span>
                    <span className="text-red-500">Enable Variations</span>
                  </button>
                ) : (
                  <div className="bg-gray-50 rounded-md">
                    {/* Variations Section */}
                    <div className="p-4">
                      {variations.map((variation, index) => (
                        <div key={variation.id} className="mb-4">
                          {/* Variation Name Row */}
                          <div className="grid grid-cols-[100px,1fr,32px] items-center gap-3">
                            <span className="text-sm">
                              Variation{index + 1}
                            </span>
                            <div className="relative">
                              <input
                                type="text"
                                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                                placeholder="e.g. Color, etc"
                                value={variation.name}
                                onChange={(e) =>
                                  handleVariationNameChange(
                                    variation.id,
                                    e.target.value
                                  )
                                }
                              />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                                0/14
                              </span>
                            </div>
                            {/* Chỉ cho phép xóa variation khi có nhiều hơn 1 variation */}
                            {variations.length > 1 && (
                              <button
                                className="text-gray-400 hover:text-gray-600 text-xl"
                                onClick={() =>
                                  handleRemoveVariation(variation.id)
                                }
                              >
                                ×
                              </button>
                            )}
                          </div>

                          {/* Options Row */}
                          <div className="grid grid-cols-[100px,1fr,32px,32px] items-center gap-3 mt-3">
                            <span className="text-sm">Options</span>
                            <div className="relative">
                              <input
                                type="text"
                                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                                placeholder="e.g. Red, etc"
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    handleAddOption(
                                      variation.id,
                                      e.target.value
                                    );
                                    e.target.value = "";
                                  }
                                }}
                              />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                                0/20
                              </span>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600 text-xl">
                              +
                            </button>
                            <button className="text-gray-400 hover:text-gray-600">
                              ⊕
                            </button>
                          </div>

                          {/* Options List */}
                          <div className="ml-[100px] flex flex-wrap gap-2 mt-2">
                            {variation.options.map((option, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded border text-sm"
                              >
                                {option}
                                <button
                                  className="text-gray-400 hover:text-gray-600 ml-1"
                                  onClick={() =>
                                    handleRemoveOption(variation.id, idx)
                                  }
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Chỉ hiển thị nút Add Variation khi chưa đạt tối đa */}
                      {variations.length < 2 && (
                        <button
                          className="text-red-500 border border-dashed border-gray-300 rounded px-4 py-2 w-full hover:bg-gray-50"
                          onClick={handleAddVariation}
                        >
                          + Add Variation {variations.length + 1}
                        </button>
                      )}
                    </div>

                    {/* Variation List */}
                    <div className="mt-4">
                      <div className="text-sm font-medium mb-2">
                        Variation List
                      </div>

                      {/* Apply to All Row */}
                      <div className="grid grid-cols-[auto,1fr,1fr,1fr] items-center gap-4 px-4 py-2 bg-white border-b">
                        <div className="grid grid-cols-[repeat(2,minmax(100px,1fr))] gap-4">
                          {variations.map((_, index) => (
                            <div key={index}></div>
                          ))}
                        </div>
                        <div>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">
                              ₫
                            </span>
                            <input
                              type="text"
                              className="w-full pl-6 pr-3 py-1.5 border border-gray-300 rounded text-sm"
                              placeholder="Price"
                              value={applyAllValues.price}
                              onChange={(e) =>
                                handleApplyAllChange("price", e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <input
                            type="text"
                            className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                            placeholder="Stock"
                            value={applyAllValues.stock}
                            onChange={(e) =>
                              handleApplyAllChange("stock", e.target.value)
                            }
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                            placeholder="SKU"
                            value={applyAllValues.sku}
                            onChange={(e) =>
                              handleApplyAllChange("sku", e.target.value)
                            }
                          />
                          <button
                            className="whitespace-nowrap px-3 py-1.5 bg-[#FFA5BA] text-white rounded text-sm hover:bg-[#FF8DA7] disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleApplyToAll}
                            disabled={
                              !applyAllValues.price &&
                              !applyAllValues.stock &&
                              !applyAllValues.sku
                            }
                          >
                            Apply to All
                          </button>
                        </div>
                      </div>

                      {/* Table Headers */}
                      <div className="grid grid-cols-[auto,1fr,1fr,1fr] items-center gap-4 px-4 py-2 bg-[#FAFAFA]">
                        <div className="grid grid-cols-[repeat(2,minmax(100px,1fr))] gap-4">
                          {variations.map((variation, index) => (
                            <div key={index} className="text-sm">
                              <span className="text-red-500 mr-1">•</span>
                              Variation {index + 1}
                            </div>
                          ))}
                        </div>
                        <div className="text-sm">
                          <span className="text-red-500 mr-1">*</span>
                          Price
                        </div>
                        <div className="text-sm">
                          <span className="text-red-500 mr-1">*</span>
                          Stock
                        </div>
                        <div className="text-sm">SKU</div>
                      </div>

                      {/* Variant Rows */}
                      {variantList.map((variant, rowIndex) => (
                        <div
                          key={rowIndex}
                          className="grid grid-cols-[auto,1fr,1fr,1fr] items-center gap-4 px-4 py-4 bg-white border-b"
                        >
                          <div className="grid grid-cols-[repeat(2,minmax(100px,1fr))] gap-4">
                            {variations.map((variation, colIndex) => (
                              <div
                                key={colIndex}
                                className="flex flex-col items-center"
                              >
                                {colIndex === 0 ? (
                                  <button
                                    onClick={() =>
                                      handleUploadClick(variant.id)
                                    }
                                    className="w-16 h-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
                                  >
                                    <svg
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                                        stroke="#999999"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M12 8V16"
                                        stroke="#999999"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M8 12H16"
                                        stroke="#999999"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </button>
                                ) : (
                                  <div className="text-sm text-gray-500">
                                    {variant.variations?.[colIndex] || "-"}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          <div>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                                ₫
                              </span>
                              <input
                                type="text"
                                className="w-full pl-6 pr-3 py-1.5 border border-gray-300 rounded text-sm"
                                placeholder="Input"
                                value={variant.price}
                                onChange={(e) =>
                                  handleVariantChange(
                                    variant.id,
                                    "price",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div>
                            <input
                              type="text"
                              className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                              placeholder="0"
                              value={variant.stock}
                              onChange={(e) =>
                                handleVariantChange(
                                  variant.id,
                                  "stock",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                              placeholder="Input"
                              value={variant.sku}
                              onChange={(e) =>
                                handleVariantChange(
                                  variant.id,
                                  "sku",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Thêm trường thông tin cho từng biến thể */}
                    <div className="mt-4 bg-white p-4 rounded-md border">
                      <h3 className="text-sm font-medium mb-3">
                        Thông số kỹ thuật biến thể
                      </h3>

                      {variantList.map((variant, index) => (
                        <div
                          key={`specs-${index}`}
                          className="mb-4 p-3 border rounded-md"
                        >
                          <h4 className="text-sm font-medium mb-2">
                            Biến thể {index + 1}{" "}
                            {variant.option ? `(${variant.option})` : ""}
                          </h4>

                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            {/* Size */}
                            <div className="flex flex-col">
                              <label className="text-sm mb-1">
                                Kích thước (Size)
                              </label>
                              <input
                                type="text"
                                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                                placeholder="VD: 14 inch, XL, 42EU..."
                                value={variant.size || ""}
                                onChange={(e) =>
                                  handleVariantChange(
                                    variant.id,
                                    "size",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            {/* RAM */}
                            <div className="flex flex-col">
                              <label className="text-sm mb-1">RAM (GB)</label>
                              <input
                                type="text"
                                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                                placeholder="VD: 8, 16, 32..."
                                value={variant.ram || ""}
                                onChange={(e) =>
                                  handleVariantChange(
                                    variant.id,
                                    "ram",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            {/* Processor */}
                            <div className="flex flex-col">
                              <label className="text-sm mb-1">
                                Bộ xử lý (Processor)
                              </label>
                              <input
                                type="text"
                                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                                placeholder="VD: Intel Core i7, Apple M2..."
                                value={variant.processor || ""}
                                onChange={(e) =>
                                  handleVariantChange(
                                    variant.id,
                                    "processor",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            {/* Storage */}
                            <div className="flex flex-col">
                              <label className="text-sm mb-1">
                                Bộ nhớ (Storage - GB)
                              </label>
                              <input
                                type="text"
                                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                                placeholder="VD: 256, 512, 1024..."
                                value={variant.storage || ""}
                                onChange={(e) =>
                                  handleVariantChange(
                                    variant.id,
                                    "storage",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Price */}
            {!showVariations && (
              <div className="grid grid-cols-[180px,1fr] gap-2">
                <div className="flex items-start">
                  <span className="text-red-500 mr-0.5">*</span>
                  <span className="text-sm">Price</span>
                </div>
                <div className="relative w-[200px]">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    ₫
                  </div>
                  <input
                    type="text"
                    className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="Input"
                    value={price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Stock */}
            {!showVariations && (
              <div className="grid grid-cols-[180px,1fr] gap-2">
                <div className="flex items-start">
                  <span className="text-red-500 mr-0.5">*</span>
                  <span className="text-sm">Stock</span>
                  <span className="ml-1 text-gray-400">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                  </span>
                </div>
                <div>
                  <input
                    type="text"
                    className="w-[200px] px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="0"
                    value={stock}
                    onChange={(e) => handleStockChange(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesInformation;
