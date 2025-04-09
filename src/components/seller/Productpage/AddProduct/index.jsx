import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import FillingSuggestion from "./components/FillingSuggestion";
import ProductTabs from "./components/ProductTabs";
import BasicInformation from "./components/BasicInfomation";
import SalesInformation from "./components/SalesInformation";
import Shipping from "./components/Shipping";
import Others from "./components/Others";
import FooterButtons from "./components/FooterButtons";
import productService from "../../../../services/productService";

const AddProduct = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Basic information");

  const fillingSuggestionRef = useRef(null);
  const basicInfoRef = useRef(null);
  const salesInfoRef = useRef(null);
  const shippingRef = useRef(null);
  const othersRef = useRef(null);
  const productTabsRef = useRef(null);

  const [productData, setProductData] = useState({
    images: [],
    promotionImage: null,
    productName: "",
    category: "",
    selectedCategoryName: "",
    description: "",
    // Sales Information
    variations: [],
    price: "",
    stock: "",
    sizeChart: "",
    wholesale: [],
    // Shipping
    weight: "",
    parcelSize: {
      width: "",
      length: "",
      height: "",
    },
    shippingOptions: {
      Nhanh: false,
      "Hỏa Tốc": false,
      "Tiết Kiệm": false,
      "Hàng Cồng Kềnh": false,
    },
    // Others
    preOrder: "No",
    condition: "New",
    parentSKU: "",
  });

  const handleInputChange = (name, value) => {
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    let targetRef;
    switch (tab) {
      case "Basic information":
        targetRef = basicInfoRef;
        break;
      case "Sales information":
        targetRef = salesInfoRef;
        break;
      case "Shipping":
        targetRef = shippingRef;
        break;
      case "Others":
        targetRef = othersRef;
        break;
      default:
        return;
    }

    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Hàm tính toán phần trăm hiển thị của một element trong viewport
  const getVisiblePercentage = (element) => {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const visibleHeight =
      Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const elementHeight = rect.height;
    return (visibleHeight > 0 ? visibleHeight / elementHeight : 0) * 100;
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { ref: basicInfoRef, name: "Basic information" },
        { ref: salesInfoRef, name: "Sales information" },
        { ref: shippingRef, name: "Shipping" },
        { ref: othersRef, name: "Others" },
      ];

      let maxVisibleSection = null;
      let maxVisiblePercentage = 0;

      sections.forEach(({ ref, name }) => {
        if (ref.current) {
          const visiblePercentage = getVisiblePercentage(ref.current);
          if (visiblePercentage > maxVisiblePercentage) {
            maxVisiblePercentage = visiblePercentage;
            maxVisibleSection = name;
          }
        }
      });

      if (maxVisibleSection && maxVisiblePercentage >= 30) {
        setActiveTab(maxVisibleSection);
      }
    };

    let scrollTimeout;
    const debouncedScroll = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(handleScroll, 100);
    };

    window.addEventListener("scroll", debouncedScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", debouncedScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, []);

  // Xử lý khi submit form
  const handleSubmit = async (action) => {
    console.log("Thực hiện hành động:", action);
    console.log("Dữ liệu sản phẩm:", productData);

    try {
      // Validate dữ liệu
      const errors = [];

      if (!productData.productName) {
        errors.push("Tên sản phẩm là bắt buộc");
      }

      if (!productData.category) {
        errors.push("Danh mục sản phẩm là bắt buộc");
      }

      if (!productData.price || isNaN(parseFloat(productData.price))) {
        errors.push("Giá sản phẩm không hợp lệ");
      }

      if (!productData.stock || isNaN(parseInt(productData.stock))) {
        errors.push("Số lượng sản phẩm không hợp lệ");
      }

      // Kiểm tra biến thể
      if (productData.variations && productData.variations.length > 0) {
        const invalidVariations = productData.variations.filter(
          (variant) =>
            !variant.price ||
            isNaN(parseFloat(variant.price)) ||
            !variant.stock ||
            isNaN(parseInt(variant.stock))
        );

        if (invalidVariations.length > 0) {
          errors.push("Một số biến thể có giá hoặc số lượng không hợp lệ");
        }
      }

      // Nếu có lỗi, hiển thị và dừng việc submit
      if (errors.length > 0) {
        errors.forEach((error) => toast.error(error));
        console.error("Lỗi khi xác thực dữ liệu:", errors);
        return;
      }

      // Chuẩn bị formData
      const formData = new FormData();

      // Thêm thông tin cơ bản
      formData.append("productName", productData.productName);
      formData.append("category", productData.category);
      formData.append("description", productData.description || "");
      formData.append("price", productData.price);
      formData.append("stock", productData.stock);
      formData.append("weight", productData.weight || "0.3");

      // Thêm thông tin parcelSize nếu có
      if (productData.parcelSize) {
        // Đảm bảo các giá trị là số
        const parsedParcelSize = {
          width: parseFloat(productData.parcelSize.width) || 0,
          length: parseFloat(productData.parcelSize.length) || 0,
          height: parseFloat(productData.parcelSize.height) || 0,
        };

        // Chuyển đổi thành chuỗi JSON ngắn gọn
        formData.append("parcelSize", JSON.stringify(parsedParcelSize));
      }

      // Thêm thông tin shippingOptions
      if (productData.shippingOptions) {
        formData.append(
          "shippingOptions",
          JSON.stringify(productData.shippingOptions)
        );
      }

      // Thêm thông tin khác
      formData.append("preOrder", productData.preOrder || "No");
      formData.append("condition", productData.condition || "New");
      formData.append("parentSKU", productData.parentSKU || "");

      // Thêm trạng thái dựa trên action
      const status = action === "save" ? "pending" : "active";
      formData.append("status", status);

      // Thêm hình ảnh nếu có
      if (productData.images && productData.images.length > 0) {
        productData.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      // Thêm URLs ảnh nếu có
      if (productData.imageUrls && productData.imageUrls.length > 0) {
        formData.append("imageUrls", JSON.stringify(productData.imageUrls));
      }

      // Xử lý variations
      if (productData.variations && productData.variations.length > 0) {
        // Đảm bảo mỗi biến thể có đầy đủ thông tin
        const processedVariations = productData.variations.map(
          (variant, index) => {
            // Ưu tiên lấy từ option trước, sau đó mới đến color
            // QUAN TRỌNG: Đảm bảo option không bị "null" hoặc undefined
            const color = (
              variant.option ||
              variant.color ||
              "Default"
            ).toString();

            // Ưu tiên lấy material từ tên variation hoặc từ material đã có
            const material = (
              variant.material || `Variation${index + 1}`
            ).toString();

            // Lấy weight từ variant hoặc từ phần Shipping
            const weight = variant.weight || productData.weight || null;

            // Đảm bảo lấy đúng đường dẫn ảnh đã upload nếu có
            const image_url = variant.image_url || null;

            const processedVariant = {
              ...variant,
              option: color, // Đảm bảo option cũng được gán
              color: color, // Đổi tên option thành color để phù hợp với DB
              material: material,
              weight: weight,
              image_url: image_url, // Lưu đường dẫn ảnh đã upload
            };

            console.log(
              `Biến thể ${index + 1} trước khi gửi (FINAL):`,
              processedVariant
            );
            return processedVariant;
          }
        );

        console.log(
          "FINAL - Tất cả biến thể trước khi gửi:",
          processedVariations
        );
        formData.append("variations", JSON.stringify(processedVariations));
      }

      // Log formData để debug
      for (let [key, value] of formData.entries()) {
        console.log(`FormData: ${key} = ${value}`);
      }

      // Gọi API để tạo sản phẩm
      console.log("Gửi request tạo sản phẩm");
      const response = await productService.createProduct(formData);
      console.log("Kết quả tạo sản phẩm:", response);

      // Hiển thị thông báo thành công
      toast.success("Sản phẩm đã được tạo thành công!");

      // Chuyển hướng về trang hiển thị sản phẩm sau khi thêm thành công
      console.log("Chuyển hướng sau 1.5 giây");

      // Đảm bảo chuyển hướng sẽ xảy ra
      setTimeout(() => {
        console.log("Thực hiện chuyển hướng...");
        window.location.href = "/vendor/products";
      }, 1500);
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      toast.error(
        error.message || "Đã xảy ra lỗi khi tạo sản phẩm. Vui lòng thử lại!"
      );
    }
  };

  // Kiểm tra xem category đã được chọn chưa
  const hasCategory = Boolean(productData.category);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[1500px] mx-auto">
        <div className="flex gap-4 p-4">
          {/* Left column - Filling Suggestion */}
          <div className="w-72 flex-shrink-0" ref={fillingSuggestionRef}>
            <FillingSuggestion />
          </div>

          {/* Right column - Main content */}
          <div className="flex-1 bg-white rounded-lg shadow-sm">
            {/* Tabs section */}
            <div
              ref={productTabsRef}
              className="sticky top-0 z-10"
              style={{
                background: "white",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <div className="border-b">
                <ProductTabs
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                />
              </div>
            </div>

            {/* Content section */}
            <div className="divide-y divide-gray-200">
              {/* Basic Information section */}
              <div ref={basicInfoRef} className="p-6">
                <BasicInformation
                  productData={productData}
                  onInputChange={handleInputChange}
                />
              </div>

              {/* Sales Information section */}
              <div ref={salesInfoRef} className="p-6">
                <SalesInformation
                  hasCategory={hasCategory}
                  productData={productData}
                  onInputChange={handleInputChange}
                />
              </div>

              {/* Shipping section */}
              <div ref={shippingRef} className="p-6">
                <Shipping
                  hasCategory={hasCategory}
                  productData={productData}
                  onInputChange={handleInputChange}
                />
              </div>

              {/* Others section */}
              <div ref={othersRef} className="p-6">
                <Others
                  hasCategory={hasCategory}
                  productData={productData}
                  onInputChange={handleInputChange}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t">
              <div className="mt-8">
                <FooterButtons
                  onCancel={() => navigate("/vendor/products")}
                  onSaveAndPublish={() => handleSubmit("publish")}
                  onSaveAndDelist={() => handleSubmit("save")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
