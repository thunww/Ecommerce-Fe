import React, { useState } from "react";
import {
  Upload,
  Store,
  MapPin,
  FileText,
  Image,
  Award,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import shopApi from "../../../api/VendorAPI/shopApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const RegisterVendor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shopName: "",
    description: "",
    address: "",
    logo: null,
    banner: null,
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [type]: file,
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === "logo") {
          setLogoPreview(e.target.result);
        } else {
          setBannerPreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!termsAccepted) {
        Swal.fire({
          title: "Warning!",
          text: "Please accept the Terms of Service and Privacy Policy to continue.",
          icon: "warning",
        });
        return;
      }

      setIsLoading(true);

      // Tạo FormData object
      const submitData = new FormData();
      submitData.append("shopName", formData.shopName);
      submitData.append("description", formData.description);
      submitData.append("address", formData.address);

      if (formData.logo) {
        submitData.append("logo", formData.logo);
      }
      if (formData.banner) {
        submitData.append("banner", formData.banner);
      }

      // Gọi API đăng ký
      const response = await shopApi.registerVendor(submitData);

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: "Success!",
          text: "Registration successful! Please wait for approval.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          // Chuyển hướng đến trang ShopProfile
          navigate("/vendor/shop-profile");
        });
        // Reset form
        setFormData({
          shopName: "",
          description: "",
          address: "",
          logo: null,
          banner: null,
        });
        setLogoPreview(null);
        setBannerPreview(null);
        setTermsAccepted(false);
      }
    } catch (error) {
      console.error("Registration error:", error);
      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-2 pb-4 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Container chính */}
        <div className="bg-white rounded-3xl p-6">
          {/* Nút quay lại */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-gray-600 hover:text-blue-600 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>

          {/* Header với illustration */}
          <div className="text-center mb-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-1">
              <div className="relative">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-blue-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-xs">💼</span>
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Become a Vendor
            </h1>
            <p className="text-gray-600 text-base">
              Join us to become a delivery partner
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            {/* Left side - Illustration và benefits */}
            <div className="lg:col-span-1 space-y-4">
              {/* Main illustration */}
              <div className="bg-blue-50 rounded-2xl p-4 text-center border border-blue-200">
                <div className="w-24 h-24 mx-auto mb-3 relative">
                  <div className="w-full h-full bg-blue-600 rounded-full flex items-center justify-center">
                    <div className="text-4xl">🛍️</div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce">
                    <span className="text-xl">💰</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  Business Success
                </h3>
                <p className="text-sm text-gray-600">
                  Start your online business journey with us
                </p>
              </div>

              {/* Quick benefits */}
              <div className="space-y-2">
                <div className="flex items-center p-3 bg-white rounded-xl border border-gray-200">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                    <Store className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">
                      Expand Market
                    </h4>
                    <p className="text-xs text-gray-600">
                      Reach millions of customers
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-white rounded-xl border border-gray-200">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">
                      24/7 Support
                    </h4>
                    <p className="text-xs text-gray-600">
                      Professional support team
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-white rounded-xl border border-gray-200">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">
                      Low Cost
                    </h4>
                    <p className="text-xs text-gray-600">
                      No initial setup fees
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {/* Form header */}
                <div className="bg-blue-600 px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <Award className="w-6 h-6 mr-2" />
                    Store Information
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  {/* Shop Name */}
                  <div className="space-y-2">
                    <label className="flex items-center text-base font-semibold text-gray-800">
                      <Store className="w-4 h-4 mr-2 text-blue-600" />
                      Store Name *
                    </label>
                    <input
                      type="text"
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleInputChange}
                      placeholder="Enter your store name..."
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 text-base bg-gray-50 hover:bg-white"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="flex items-center text-base font-semibold text-gray-800">
                      <FileText className="w-4 h-4 mr-2 text-green-600" />
                      Store Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your store, products and services..."
                      rows="3"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-all duration-200 text-base resize-none bg-gray-50 hover:bg-white"
                      required
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <label className="flex items-center text-base font-semibold text-gray-800">
                      <MapPin className="w-4 h-4 mr-2 text-purple-600" />
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your store address..."
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 text-base bg-gray-50 hover:bg-white"
                      required
                    />
                  </div>

                  {/* File Uploads - Compact grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Logo Upload */}
                    <div className="space-y-2">
                      <label className="flex items-center text-base font-semibold text-gray-800">
                        <Image className="w-4 h-4 mr-2 text-orange-600" />
                        Store Logo
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-orange-500 transition-all duration-200 bg-orange-50">
                        {logoPreview ? (
                          <div className="space-y-2">
                            <img
                              src={logoPreview}
                              alt="Logo preview"
                              className="w-16 h-16 object-cover rounded-lg mx-auto border-2 border-gray-300"
                            />
                            <p className="text-xs font-medium text-gray-700">
                              Logo selected ✓
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mx-auto">
                              <Upload className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-700 font-semibold">
                                Upload logo
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG up to 5MB
                              </p>
                            </div>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "logo")}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="inline-block mt-2 px-4 py-1.5 bg-orange-600 text-white rounded-lg cursor-pointer hover:bg-orange-700 transition-all duration-200 text-sm font-semibold"
                        >
                          Choose File
                        </label>
                      </div>
                    </div>

                    {/* Banner Upload */}
                    <div className="space-y-2">
                      <label className="flex items-center text-base font-semibold text-gray-800">
                        <Image className="w-4 h-4 mr-2 text-indigo-600" />
                        Store Banner
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-indigo-500 transition-all duration-200 bg-indigo-50">
                        {bannerPreview ? (
                          <div className="space-y-2">
                            <img
                              src={bannerPreview}
                              alt="Banner preview"
                              className="w-full h-12 object-cover rounded-lg border-2 border-gray-300"
                            />
                            <p className="text-xs font-medium text-gray-700">
                              Banner selected ✓
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto">
                              <Upload className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-700 font-semibold">
                                Upload banner
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG up to 10MB
                              </p>
                            </div>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "banner")}
                          className="hidden"
                          id="banner-upload"
                        />
                        <label
                          htmlFor="banner-upload"
                          className="inline-block mt-2 px-4 py-1.5 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition-all duration-200 text-sm font-semibold"
                        >
                          Choose File
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={termsAccepted}
                        onChange={handleTermsChange}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        required
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm text-gray-700 leading-relaxed"
                      >
                        I agree to the{" "}
                        <a
                          href="#"
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="text-green-600 hover:text-green-800 font-semibold"
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-2">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading || !termsAccepted}
                      className={`px-8 py-2 bg-blue-600 text-white text-base font-bold rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 ${
                        isLoading || !termsAccepted
                          ? "opacity-70 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        "🚀 Register Now"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterVendor;
