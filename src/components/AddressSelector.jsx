import React, { useState, useEffect } from 'react';

const AddressSelector = ({ onChange, onAddressChange, value = '', type = 'full' }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [street, setStreet] = useState('');

  // Parse initial value if provided
  useEffect(() => {
    if (value) {
      try {
        const [streetPart, wardPart, districtPart, provincePart] = value.split(', ').reverse();
        setStreet(streetPart || '');
        setSelectedWard(wardPart || '');
        setSelectedDistrict(districtPart || '');
        setSelectedProvince(provincePart || '');
      } catch (error) {
        console.error('Error parsing address:', error);
      }
    }
  }, [value]);

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
          const province = provinces.find(p => p.name === selectedProvince);
          if (province) {
            const response = await fetch(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`);
            const data = await response.json();
            setDistricts(data.districts || []);
          }
        } catch (error) {
          console.error('Error fetching districts:', error);
        }
      } else {
        setDistricts([]);
      }
      setSelectedDistrict('');
      setWards([]);
      setSelectedWard('');
    };
    fetchDistricts();
  }, [selectedProvince, provinces]);

  // Fetch wards when district is selected
  useEffect(() => {
    const fetchWards = async () => {
      if (selectedDistrict) {
        try {
          const district = districts.find(d => d.name === selectedDistrict);
          if (district) {
            const response = await fetch(`https://provinces.open-api.vn/api/d/${district.code}?depth=2`);
            const data = await response.json();
            setWards(data.wards || []);
          }
        } catch (error) {
          console.error('Error fetching wards:', error);
        }
      } else {
        setWards([]);
      }
      setSelectedWard('');
    };
    fetchWards();
  }, [selectedDistrict, districts]);

  // Update address when any selection changes
  useEffect(() => {
    if (type === 'shipper') {
      if (selectedWard && selectedDistrict && selectedProvince) {
        const address = {
          ward: selectedWard,
          district: selectedDistrict,
          province: selectedProvince,
          fullAddress: `${selectedWard}, ${selectedDistrict}, ${selectedProvince}`
        };
        if (onChange) onChange(address);
        if (onAddressChange) onAddressChange(address);
      }
    } else {
      if (street && selectedWard && selectedDistrict && selectedProvince) {
        const address = {
          street,
          ward: selectedWard,
          district: selectedDistrict,
          province: selectedProvince,
          fullAddress: `${street}, ${selectedWard}, ${selectedDistrict}, ${selectedProvince}`
        };
        if (onChange) onChange(address);
        if (onAddressChange) onAddressChange(address);
      }
    }
  }, [street, selectedWard, selectedDistrict, selectedProvince, onChange, onAddressChange, type]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-red-700">
          Tỉnh/Thành phố <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
        >
          <option value="">Chọn Tỉnh/Thành phố</option>
          {provinces.map((province) => (
            <option key={province.code} value={province.name}>
              {province.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-red-700">
          Quận/Huyện <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
          disabled={!selectedProvince}
        >
          <option value="">Chọn Quận/Huyện</option>
          {districts.map((district) => (
            <option key={district.code} value={district.name}>
              {district.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-red-700">
          Phường/Xã <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedWard}
          onChange={(e) => setSelectedWard(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
          disabled={!selectedDistrict}
        >
          <option value="">Chọn Phường/Xã</option>
          {wards.map((ward) => (
            <option key={ward.code} value={ward.name}>
              {ward.name}
            </option>
          ))}
        </select>
      </div>

      {type === 'full' && (
        <div>
          <label className="block text-sm font-medium text-red-700">
            Số nhà, tên đường <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-red-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            placeholder="Nhập số nhà, tên đường"
          />
        </div>
      )}
    </div>
  );
};

export default AddressSelector; 