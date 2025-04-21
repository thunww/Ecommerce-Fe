import React, { useState, useEffect } from "react";

const AddressForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [specificAddress, setSpecificAddress] = useState("");

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  // Load initial data if provided (for updating)
  useEffect(() => {
    if (initialData.address_id) {
      setFullName(initialData.recipient_name || "");
      setPhoneNumber(initialData.phone || "");
      setSpecificAddress(initialData.address_line || "");

      // Kiểm tra nếu dữ liệu trả về là tên, cần tìm mã `code` từ danh sách tỉnh, huyện, xã
      const province = provinces.find((p) => p.name === initialData.city);
      const district = districts.find((d) => d.name === initialData.district);
      const ward = wards.find((w) => w.name === initialData.ward);

      setSelectedProvince(province ? province.code : "");
      setSelectedDistrict(district ? district.code : "");
      setSelectedWard(ward ? ward.code : "");

      setIsDefault(initialData.is_default || false);
    }
  }, [initialData, provinces, districts, wards]);

  // Fetch provinces when component mounts
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=1")
      .then((res) => res.json())
      .then((data) => {
        setProvinces(data);
      })
      .catch((err) => console.error("Failed to fetch provinces:", err));
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    if (selectedProvince) {
      fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
        .then((res) => res.json())
        .then((data) => setDistricts(data.districts))
        .catch((err) => console.error("Failed to fetch districts:", err));
    } else {
      setDistricts([]);
      setWards([]);
      setSelectedDistrict("");
      setSelectedWard("");
    }
  }, [selectedProvince]);

  // Fetch wards when district changes
  useEffect(() => {
    if (selectedDistrict) {
      fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
        .then((res) => res.json())
        .then((data) => setWards(data.wards))
        .catch((err) => console.error("Failed to fetch wards:", err));
    } else {
      setWards([]);
      setSelectedWard("");
    }
  }, [selectedDistrict]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !fullName ||
      !phoneNumber ||
      !specificAddress ||
      !selectedProvince ||
      !selectedDistrict ||
      !selectedWard
    ) {
      alert("Please fill in all the required fields.");
      return;
    }

    const selectedProvinceName =
      provinces.find((p) => p.code === +selectedProvince)?.name || "";
    const selectedDistrictName =
      districts.find((d) => d.code === +selectedDistrict)?.name || "";
    const selectedWardName =
      wards.find((w) => w.code === +selectedWard)?.name || "";

    const addressDetails = {
      recipient_name: fullName,
      phone: phoneNumber,
      address_line: specificAddress,
      ward: selectedWardName,
      district: selectedDistrictName,
      city: selectedProvinceName,
      is_default: isDefault,
    };

    onSubmit(addressDetails);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded">
      <h2 className="text-xl font-semibold mb-4">Địa chỉ nhận hàng</h2>

      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Họ và Tên
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nhập họ và tên"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          required
        />
      </div>

      {/* Số điện thoại */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Số điện thoại
        </label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Nhập số điện thoại"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          required
        />
      </div>

      {/* Tỉnh / Thành phố */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Tỉnh / Thành phố
        </label>
        <select
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="">-- Chọn Tỉnh / Thành phố --</option>
          {provinces.map((province) => (
            <option key={province.code} value={province.code}>
              {province.name}
            </option>
          ))}
        </select>
      </div>

      {/* Quận / Huyện */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Quận / Huyện
        </label>
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          disabled={!districts.length}
        >
          <option value="">-- Chọn Quận / Huyện --</option>
          {districts.map((district) => (
            <option key={district.code} value={district.code}>
              {district.name}
            </option>
          ))}
        </select>
      </div>

      {/* Phường / Xã */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Phường / Xã
        </label>
        <select
          value={selectedWard}
          onChange={(e) => setSelectedWard(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          disabled={!wards.length}
        >
          <option value="">-- Chọn Phường / Xã --</option>
          {wards.map((ward) => (
            <option key={ward.code} value={ward.code}>
              {ward.name}
            </option>
          ))}
        </select>
      </div>

      {/* Địa chỉ cụ thể */}
      <div className="mb-6">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Địa chỉ cụ thể (Số nhà, tên đường...)
        </label>
        <input
          type="text"
          value={specificAddress}
          onChange={(e) => setSpecificAddress(e.target.value)}
          placeholder="VD: 123 Đường Lê Lợi"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          required
        />
      </div>

      {/* Đặt làm địa chỉ mặc định */}
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          checked={isDefault}
          onChange={() => setIsDefault(!isDefault)}
          id="setDefault"
          className="mr-2"
        />
        <label htmlFor="setDefault" className="text-sm text-gray-700">
          Đặt làm địa chỉ mặc định
        </label>
      </div>

      {/* Nút Submit và Hủy */}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition text-sm"
        >
          {initialData.address_id ? "Cập nhật" : "Xác nhận địa chỉ"}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
