import React, { useState, useEffect } from 'react';

const AddressSelector = ({ onAddressChange }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('https://provinces.open-api.vn/api/p/');
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };

    fetchProvinces();
  }, []);

  // Fetch districts when province is selected
  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedProvince) {
        try {
          const response = await fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`);
          const data = await response.json();
          setDistricts(data.districts || []);
          setSelectedDistrict('');
          setSelectedWard('');
          setWards([]);
        } catch (error) {
          console.error('Error fetching districts:', error);
        }
      }
    };

    fetchDistricts();
  }, [selectedProvince]);

  // Fetch wards when district is selected
  useEffect(() => {
    const fetchWards = async () => {
      if (selectedDistrict) {
        try {
          const response = await fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`);
          const data = await response.json();
          setWards(data.wards || []);
          setSelectedWard('');
        } catch (error) {
          console.error('Error fetching wards:', error);
        }
      }
    };

    fetchWards();
  }, [selectedDistrict]);

  // Update address when any field changes
  useEffect(() => {
    if (onAddressChange) {
      const address = {
        province: provinces.find(p => p.code === selectedProvince)?.name || '',
        district: districts.find(d => d.code === selectedDistrict)?.name || '',
        ward: wards.find(w => w.code === selectedWard)?.name || ''
      };
      onAddressChange(address);
    }
  }, [selectedProvince, selectedDistrict, selectedWard, provinces, districts, wards, onAddressChange]);

  return (
    <div className="space-y-4">
      {/* Province Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tỉnh/Thành phố
        </label>
        <select
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">Chọn tỉnh/thành phố</option>
          {provinces.map((province) => (
            <option key={province.code} value={province.code}>
              {province.name}
            </option>
          ))}
        </select>
      </div>

      {/* District Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quận/Huyện
        </label>
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          disabled={!selectedProvince}
        >
          <option value="">Chọn quận/huyện</option>
          {districts.map((district) => (
            <option key={district.code} value={district.code}>
              {district.name}
            </option>
          ))}
        </select>
      </div>

      {/* Ward Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phường/Xã
        </label>
        <select
          value={selectedWard}
          onChange={(e) => setSelectedWard(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          disabled={!selectedDistrict}
        >
          <option value="">Chọn phường/xã</option>
          {wards.map((ward) => (
            <option key={ward.code} value={ward.code}>
              {ward.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AddressSelector; 