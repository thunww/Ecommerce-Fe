// src/components/seller/Productpage/AddProduct/index.jsx
import React, { useState, useRef } from "react";
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
  const contentRef = useRef(null);
  const [productData, setProductData] = useState({
    images: [],
    promotionImage: null,
    video: null,
    productName: "",
    category: "",
    description: "",
  });

  const handleInputChange = (name, value) => {
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSaveAndPublish = () => {
    navigate("/vendor/products");
  };

  const renderTabContent = () => {
    // Nếu chưa chọn category, chỉ hiển thị Basic Information
    if (!productData.category && activeTab !== "Basic information") {
      return (
        <div className="py-8 text-center text-gray-500">
          Available only after you select a product category
        </div>
      );
    }

    switch (activeTab) {
      case "Basic information":
        return (
          <BasicInformation
            productData={productData}
            onInputChange={handleInputChange}
          />
        );
      case "Sales information":
        return <SalesInformation />;
      case "Shipping":
        return <Shipping />;
      case "Others":
        return <Others />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[1500px] mx-auto">
        <div className="flex gap-4 p-4">
          {/* Left column - Filling Suggestion */}
          <div className="w-72 flex-shrink-0">
            <FillingSuggestion />
          </div>

          {/* Right column - Main content */}
          <div className="flex-1 bg-white rounded-lg shadow-sm">
            {/* Tabs section */}
            <div className="border-b">
              <ProductTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
            </div>

            {/* Content section */}
            <div ref={contentRef} className="divide-y divide-gray-200">
              {/* Basic Information section */}
              <div className="p-6">
                <h2 className="text-lg font-medium mb-6">Basic information</h2>
                <BasicInformation
                  productData={productData}
                  onInputChange={handleInputChange}
                />
              </div>

              {/* Sales Information section */}
              <div className="p-6">
                <h2 className="text-lg font-medium mb-6">Sales information</h2>
                {!productData.category ? (
                  <div className="py-4 text-center text-gray-500">
                    Available only after you select a product category
                  </div>
                ) : (
                  <SalesInformation />
                )}
              </div>

              {/* Shipping section */}
              <div className="p-6">
                <h2 className="text-lg font-medium mb-6">Shipping</h2>
                {!productData.category ? (
                  <div className="py-4 text-center text-gray-500">
                    Available only after you select a product category
                  </div>
                ) : (
                  <Shipping />
                )}
              </div>

              {/* Others section */}
              <div className="p-6">
                <h2 className="text-lg font-medium mb-6">Others</h2>
                {!productData.category ? (
                  <div className="py-4 text-center text-gray-500">
                    Available only after you select a product category
                  </div>
                ) : (
                  <Others />
                )}
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
