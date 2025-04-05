import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FillingSuggestion from "./components/FillingSuggestion";
import ProductTabs from "./components/ProductTabs";
import BasicInformation from "./components/BasicInfomation";
import SalesInformation from "./components/SalesInformation";
import Shipping from "./components/Shipping";
import Others from "./components/Others";
import FooterButtons from "./components/FooterButtons";

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
    video: null,
    productName: "",
    category: "",
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

  const handleSaveAndPublish = () => {
    navigate("/vendor/products");
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
              <FooterButtons
                onCancel={() => navigate("/vendor/products")}
                onSaveAndPublish={handleSaveAndPublish}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
