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
      onInputChange("variations", updatedVariations);
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

  // Tạo danh sách variants mới khi variations hoặc options thay đổi
  const generateVariantList = (variations) => {
    // Nếu không có variations hoặc không có options nào, trả về biến thể mặc định với color và material
    if (
      variations.length === 0 ||
      variations.every((v) => v.options.length === 0)
    ) {
      return [
        {
          id: 1,
          image: null,
          imageUrl: null,
          price: "",
          stock: "0",
          sku: "",
          color: "Default", // Thêm giá trị mặc định cho color
          material: "Variation1", // Thêm giá trị mặc định cho material
          weight: productData.weight || "", // Lấy weight từ productData
          image_url: DEFAULT_PRODUCT_IMAGE, // Thêm URL ảnh mặc định
        },
      ];
    }

    // Lấy tất cả các options từ các variations
    const optionsArrays = variations
      .filter((v) => v.options.length > 0)
      .map((v) => v.options);

    // Lấy tên các variations để sử dụng làm material
    const variationNames = variations
      .filter((v) => v.options.length > 0)
      .map((v) => v.name || `Variation${v.id}`);

    console.log("Options arrays:", optionsArrays);
    console.log("Variation names (for material):", variationNames);

    // Tạo tất cả các tổ hợp có thể từ các options
    const generateCombinations = (arrays) => {
      const result = [];
      const helper = (arr, i) => {
        if (i === arrays.length) {
          result.push(arr);
          return;
        }
        for (let j = 0; j < arrays[i].length; j++) {
          helper([...arr, arrays[i][j]], i + 1);
        }
      };
      helper([], 0);
      return result;
    };

    // Tạo tất cả các tổ hợp
    const combinations = generateCombinations(optionsArrays);
    console.log("Combinations:", combinations);

    // Tạo variants mới từ các tổ hợp
    const result = combinations.map((combo, index) => {
      // Lấy chính xác material là tên của variation đầu tiên
      const material =
        variationNames.length > 0 ? variationNames[0] : `Variation${index + 1}`;

      // Lấy color là giá trị option đầu tiên hoặc Default nếu không có
      const color = combo.length > 0 ? combo[0] : "Default";

      const variant = {
        id: index + 1,
        image: null,
        imageUrl: null,
        price: "",
        stock: "0",
        sku: "",
        combination: combo,
        option: color, // Lưu option đầu tiên làm color
        color: color, // Thêm cả color để đảm bảo
        material: material, // Sử dụng tên variation làm material
        weight: productData.weight || "", // Lấy weight từ productData
        variationName: combo.join(" - "),
        image_url: DEFAULT_PRODUCT_IMAGE, // Thêm URL ảnh mặc định
      };
      console.log(`Tạo biến thể ${index + 1}:`, variant);
      return variant;
    });

    console.log("Final variant list:", result);
    return result;
  };

  // Cập nhật tên variation
  const handleVariationNameChange = (id, value) => {
    console.log(`Thay đổi tên variation ${id} thành "${value}"`);

    // Cập nhật tên trong danh sách variations
    const updatedVariations = variations.map((v) =>
      v.id === id ? { ...v, name: value } : v
    );
    setVariations(updatedVariations);

    // Cập nhật material trong variantList nếu đây là variation đầu tiên
    if (id === 1) {
      const materialValue = value || `Variation${id}`;
      console.log(
        `Cập nhật material thành "${materialValue}" cho tất cả biến thể`
      );

      const updatedVariantList = variantList.map((variant) => ({
        ...variant,
        material: materialValue,
      }));

      setVariantList(updatedVariantList);
      onInputChange("variations", updatedVariantList);
    }
  };

  // Thêm option
  const handleAddOption = (variationId, value) => {
    if (!value.trim()) return;

    const trimmedValue = value.trim();
    console.log(`Thêm option "${trimmedValue}" vào variation ${variationId}`);

    const updatedVariations = variations.map((v) =>
      v.id === variationId ? { ...v, options: [...v.options, trimmedValue] } : v
    );

    console.log("variations sau khi cập nhật:", updatedVariations);
    setVariations(updatedVariations);

    // Tự động cập nhật variantList khi thêm option
    const newVariantList = generateVariantList(updatedVariations);

    // Kiểm tra xem các option có được truyền chính xác không
    newVariantList.forEach((variant, index) => {
      console.log(`Biến thể ${index + 1} sau khi thêm option:`, {
        option: variant.option,
        color: variant.color,
        material: variant.material,
      });
    });

    setVariantList(newVariantList);

    // Cập nhật về component cha
    onInputChange("variations", newVariantList);
  };

  // Xóa option
  const handleRemoveOption = (variationId, optionIndex) => {
    const updatedVariations = variations.map((v) =>
      v.id === variationId
        ? {
            ...v,
            options: v.options.filter((_, index) => index !== optionIndex),
          }
        : v
    );
    setVariations(updatedVariations);

    // Tự động cập nhật variantList khi xóa option
    const newVariantList = generateVariantList(updatedVariations);
    setVariantList(newVariantList);

    // Cập nhật về component cha
    onInputChange("variations", newVariantList);
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

    toast.success("Đã áp dụng giá trị cho tất cả variations");
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

  // Cập nhật variant khi thay đổi giá hoặc stock
  const handleVariantChange = (variantId, field, value) => {
    const updatedVariantList = variantList.map((variant) => {
      if (variant.id === variantId) {
        // Tạo biến thể mới với trường được cập nhật
        const updatedVariant = {
          ...variant,
          [field]: value,
        };

        // Đảm bảo các trường này luôn có giá trị
        if (!updatedVariant.color) updatedVariant.color = "Default";
        if (!updatedVariant.material)
          updatedVariant.material = `variation${variantId}`;
        if (!updatedVariant.weight)
          updatedVariant.weight = productData.weight || "";
        if (!updatedVariant.image_url)
          updatedVariant.image_url = DEFAULT_PRODUCT_IMAGE;

        return updatedVariant;
      }
      return variant;
    });

    setVariantList(updatedVariantList);

    // Nếu chỉ có 1 variant, cập nhật giá trị cho sản phẩm chính
    if (updatedVariantList.length === 1) {
      if (field === "price") {
        setPrice(value);
        onInputChange("price", value);
      } else if (field === "stock") {
        setStock(value);
        onInputChange("stock", value);
      }
    }

    // Cập nhật toàn bộ danh sách variants
    onInputChange("variations", updatedVariantList);

    // Log để kiểm tra
    console.log(
      `Cập nhật biến thể ${variantId}, field ${field}:`,
      updatedVariantList
    );
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
