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
import { getShopInfo } from "../../../../services/vendorService";

// Key để lưu và lấy draft từ localStorage
const PRODUCT_DRAFT_KEY = "shopee_product_draft";

const AddProduct = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Basic information");
  const [shopId, setShopId] = useState(null);

  const fillingSuggestionRef = useRef(null);
  const basicInfoRef = useRef(null);
  const salesInfoRef = useRef(null);
  const shippingRef = useRef(null);
  const othersRef = useRef(null);
  const productTabsRef = useRef(null);

  // State để kiểm soát việc hiển thị modal gợi ý khôi phục dữ liệu nháp
  const [showDraftModal, setShowDraftModal] = useState(false);

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

  // Kiểm tra localStorage khi trang được tải
  useEffect(() => {
    const checkForDraft = () => {
      try {
        const savedDraft = localStorage.getItem(PRODUCT_DRAFT_KEY);
        if (savedDraft) {
          const draftData = JSON.parse(savedDraft);
          // Hiển thị xác nhận nếu có dữ liệu nháp
          setShowDraftModal(true);
        }
      } catch (error) {
        console.error("Lỗi khi đọc dữ liệu nháp:", error);
      }
    };

    checkForDraft();
  }, []);

  // Lấy thông tin shop khi component được tải
  useEffect(() => {
    const fetchShopInfo = async () => {
      try {
        const response = await getShopInfo();
        if (response && response.shop_id) {
          setShopId(response.shop_id);
        } else {
          toast.error("Không thể lấy thông tin cửa hàng");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin shop:", error);
        toast.error("Lỗi khi lấy thông tin cửa hàng");
      }
    };

    fetchShopInfo();
  }, []);

  // Hàm khôi phục dữ liệu nháp từ localStorage
  const restoreDraft = () => {
    try {
      const savedDraft = localStorage.getItem(PRODUCT_DRAFT_KEY);
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft);

        // Chỉ cập nhật các trường text và số, không phải là file
        const newProductData = {
          ...productData,
          ...draftData,
          // Giữ nguyên trường images vì không thể lưu file vào localStorage
          images: productData.images,
          promotionImage: productData.promotionImage,
        };

        setProductData(newProductData);
        toast.success("Draft data has been restored successfully");
        setShowDraftModal(false);
      }
    } catch (error) {
      console.error("Lỗi khi khôi phục dữ liệu nháp:", error);
      toast.error("Failed to restore draft data");
    }
  };

  // Hàm từ chối khôi phục dữ liệu nháp
  const discardDraft = () => {
    localStorage.removeItem(PRODUCT_DRAFT_KEY);
    setShowDraftModal(false);
    toast.info("Draft has been discarded");
  };

  // Hàm lưu dữ liệu nháp vào localStorage
  const saveDraft = () => {
    try {
      // Tạo bản sao của productData để xử lý trước khi lưu
      const draftToSave = { ...productData };

      // Xóa những trường không thể lưu vào localStorage (như File objects)
      delete draftToSave.images;
      delete draftToSave.promotionImage;

      // Lưu vào localStorage
      localStorage.setItem(PRODUCT_DRAFT_KEY, JSON.stringify(draftToSave));
      toast.success("Product draft saved successfully");

      // Có thể kết hợp với việc lưu lên server nếu cần
      // handleSubmit("save");
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu nháp:", error);
      toast.error("Failed to save draft data");
    }
  };

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

  const handleSubmit = async (action) => {
    try {
      toast.dismiss();

      // Validate dữ liệu trước khi gửi
      if (
        !productData.productName ||
        !productData.description ||
        !productData.price ||
        !productData.stock ||
        !productData.category
      ) {
        toast.error("Vui lòng điền đầy đủ thông tin cơ bản của sản phẩm");
        return;
      }

      // Validate ảnh
      if (!productData.images || productData.images.length === 0) {
        toast.error("Vui lòng tải lên ít nhất một hình ảnh sản phẩm");
        return;
      }

      // Chuẩn bị FormData
      const formData = new FormData();

      // Thêm thông tin cơ bản
      formData.append("productName", productData.productName);
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      formData.append("stock", productData.stock);
      formData.append("category", productData.category);
      formData.append("weight", productData.weight || "0.5");

      // Xử lý parcelSize - đảm bảo là object không phải string
      const parcelSize = {
        width: productData.parcelSize.width || "5",
        length: productData.parcelSize.length || "5",
        height: productData.parcelSize.height || "5",
      };
      formData.append("parcelSize", JSON.stringify(parcelSize));

      formData.append("status", action === "publish" ? "ACTIVE" : "DRAFT");

      // Xử lý variations nếu có
      if (productData.variations && productData.variations.length > 0) {
        // Loại bỏ image_url từ variations để backend tự xử lý
        const variations = productData.variations.map(
          ({ image_url, ...rest }) => rest
        );
        formData.append("variations", JSON.stringify(variations));
      }

      // Xử lý ảnh sản phẩm
      if (productData.images && productData.images.length > 0) {
        // Ảnh chính (primary image)
        formData.append("primaryImage", productData.images[0]);

        // Các ảnh phụ (additional images)
        for (let i = 1; i < productData.images.length; i++) {
          formData.append("additionalImages", productData.images[i]);
        }

        // Log để kiểm tra
        console.log("=== CHECKING FORM DATA ===");
        console.log("Primary Image:", productData.images[0]);
        console.log("Additional Images:", productData.images.slice(1));
        console.log("Variations:", JSON.parse(formData.get("variations")));
      }

      // Hiển thị loading toast
      const loadingToast = toast.loading("Đang tạo sản phẩm...");

      // Gọi service để tạo sản phẩm
      const response = await productService.createProductWithFormData(formData);

      // Xử lý kết quả
      if (response.success) {
        toast.update(loadingToast, {
          render: "Tạo sản phẩm thành công!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        // Xóa dữ liệu nháp sau khi tạo thành công
        localStorage.removeItem(PRODUCT_DRAFT_KEY);

        // Chuyển hướng sau 1 giây
        setTimeout(() => {
          navigate("/vendor/products");
        }, 1000);
      } else {
        throw new Error(response.message || "Tạo sản phẩm thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      toast.error(error.message || "Có lỗi xảy ra khi tạo sản phẩm");
    }
  };

  // Kiểm tra xem category đã được chọn chưa
  const hasCategory = Boolean(productData.category);

  // Cập nhật chức năng của nút Save as Draft
  const handleSaveAndDelist = () => {
    // Lưu nháp vào localStorage
    saveDraft();

    // Tiếp tục với việc lưu lên server
    handleSubmit("save");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Modal gợi ý khôi phục dữ liệu nháp */}
      {showDraftModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
            <h3 className="text-lg font-semibold mb-4">Resume Draft</h3>
            <p className="mb-6">
              You have an unsaved product draft. Would you like to continue
              editing where you left off?
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={discardDraft}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Discard Draft
              </button>
              <button
                onClick={restoreDraft}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Resume Editing
              </button>
            </div>
          </div>
        </div>
      )}

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
                  onSaveAndDelist={handleSaveAndDelist}
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
