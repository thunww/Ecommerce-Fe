import React, { useState } from "react";
import { Upload, Store, MapPin, FileText, Image, Award } from "lucide-react";
import shopApi from "../../../api/VendorAPI/shopApi";
import Swal from "sweetalert2";

export default function VendorRegistration() {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      // Tạo FormData object để gửi file
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

      const response = await shopApi.registerVendor(submitData);

      if (response.data) {
        Swal.fire({
          title: "Thành công!",
          text: "Đăng ký thành công! Vui lòng chờ xét duyệt.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
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
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      Swal.fire({
        title: "Lỗi!",
        text:
          error.response?.data?.message ||
          "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-orange-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Main Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-[#ee4d2d] px-6 py-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Award className="w-6 h-6 mr-3" />
              Thông Tin Cửa Hàng
            </h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Shop Name */}
            <div className="space-y-2">
              <label className="flex items-center text-base font-semibold text-gray-800">
                <Store className="w-5 h-5 mr-2 text-indigo-600" />
                Tên Cửa Hàng *
              </label>
              <input
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleInputChange}
                placeholder="Nhập tên cửa hàng của bạn"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base bg-white/80 backdrop-blur-sm"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="flex items-center text-base font-semibold text-gray-800">
                <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                Mô Tả Cửa Hàng *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Mô tả về cửa hàng, sản phẩm và dịch vụ của bạn..."
                rows="4"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base resize-none bg-white/80 backdrop-blur-sm"
                required
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="flex items-center text-base font-semibold text-gray-800">
                <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
                Địa Chỉ *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Nhập địa chỉ cửa hàng"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base bg-white/80 backdrop-blur-sm"
                required
              />
            </div>

            {/* File Uploads */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Logo Upload */}
              <div className="space-y-2">
                <label className="flex items-center text-base font-semibold text-gray-800">
                  <Image className="w-5 h-5 mr-2 text-indigo-600" />
                  Logo Cửa Hàng
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-indigo-400 transition-colors duration-200 bg-gradient-to-br from-gray-50 to-indigo-50/30">
                  {logoPreview ? (
                    <div className="space-y-2">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-24 h-24 object-cover rounded-lg mx-auto border-2 border-white shadow-md"
                      />
                      <p className="text-sm text-gray-600">Logo đã chọn</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-gray-600 font-medium">
                          Tải lên logo cửa hàng
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG tối đa 5MB
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
                    className="inline-block mt-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg cursor-pointer hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md text-sm font-medium"
                  >
                    Chọn File
                  </label>
                </div>
              </div>

              {/* Banner Upload */}
              <div className="space-y-2">
                <label className="flex items-center text-base font-semibold text-gray-800">
                  <Image className="w-5 h-5 mr-2 text-indigo-600" />
                  Banner Cửa Hàng
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-indigo-400 transition-colors duration-200 bg-gradient-to-br from-gray-50 to-purple-50/30">
                  {bannerPreview ? (
                    <div className="space-y-2">
                      <img
                        src={bannerPreview}
                        alt="Banner preview"
                        className="w-full h-24 object-cover rounded-lg border-2 border-white shadow-md"
                      />
                      <p className="text-sm text-gray-600">Banner đã chọn</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-gray-600 font-medium">
                          Tải lên banner cửa hàng
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG tối đa 10MB
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
                    className="inline-block mt-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg cursor-pointer hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md text-sm font-medium"
                  >
                    Chọn File
                  </label>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  required
                />
                <label
                  htmlFor="terms"
                  className="text-gray-700 text-sm leading-relaxed"
                >
                  Tôi đồng ý với{" "}
                  <a
                    href="#"
                    className="text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    Điều khoản dịch vụ
                  </a>{" "}
                  và{" "}
                  <a
                    href="#"
                    className="text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    Chính sách bảo mật
                  </a>{" "}
                  của nền tảng
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className={`px-8 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-[#ee4d2d] text-white text-base font-bold rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-[#e63d1a] transition-all duration-300 shadow-lg transform hover:scale-105 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Đang xử lý..." : "Đăng Ký Ngay"}
              </button>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent text-center mb-6">
            Lợi Ích Khi Trở Thành Vendor
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center group">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform duration-300">
                <Store className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-base font-bold text-gray-800 mb-2">
                Mở Rộng Thị Trường
              </h4>
              <p className="text-sm text-gray-600">
                Tiếp cận hàng triệu khách hàng tiềm năng trên toàn quốc
              </p>
            </div>
            <div className="text-center group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform duration-300">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-base font-bold text-gray-800 mb-2">
                Hỗ Trợ Toàn Diện
              </h4>
              <p className="text-sm text-gray-600">
                Đội ngũ hỗ trợ 24/7 và công cụ quản lý bán hàng chuyên nghiệp
              </p>
            </div>
            <div className="text-center group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-[#ee4d2d] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-base font-bold text-gray-800 mb-2">
                Chi Phí Thấp
              </h4>
              <p className="text-sm text-gray-600">
                Phí dịch vụ cạnh tranh và không phí thiết lập ban đầu
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
