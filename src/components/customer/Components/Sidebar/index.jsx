import React, { useState, useEffect } from "react";

const Sidebar = ({ filters, onFilterChange, onSearchChange }) => {
  // Local state cho các bộ lọc để kiểm soát checkbox, slider
  const [selectedCategories, setSelectedCategories] = useState(
    filters.categories || []
  );
  const [priceRange, setPriceRange] = useState(filters.priceRange || [1, 100]);
  const categories = ["Áo", "Quần", "Giày", "Phụ kiện"]; // ví dụ category tĩnh, có thể lấy từ API

  // Khi user check/uncheck category
  const handleCategoryChange = (category) => {
    let newSelected;
    if (selectedCategories.includes(category)) {
      newSelected = selectedCategories.filter((c) => c !== category);
    } else {
      newSelected = [...selectedCategories, category];
    }
    setSelectedCategories(newSelected);
  };

  // Khi price range thay đổi (ví dụ dùng 2 input number)
  const handlePriceMinChange = (e) => {
    const newMin = Number(e.target.value);
    if (newMin <= priceRange[1]) {
      setPriceRange([newMin, priceRange[1]]);
    }
  };
  const handlePriceMaxChange = (e) => {
    const newMax = Number(e.target.value);
    if (newMax >= priceRange[0]) {
      setPriceRange([priceRange[0], newMax]);
    }
  };

  // Khi selectedCategories hoặc priceRange thay đổi thì gọi onFilterChange
  useEffect(() => {
    onFilterChange({
      categories: selectedCategories,
      priceRange,
    });
  }, [selectedCategories, priceRange]);

  return (
    <div className="w-[20%] p-3 border-r border-gray-300">
      {/* Search bar */}
      <input
        type="text"
        placeholder="Tìm sản phẩm..."
        value={filters.keyword || ""}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-400 rounded"
      />

      {/* Categories */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Danh mục</h3>
        {categories.map((category) => (
          <label key={category} className="block">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryChange(category)}
            />{" "}
            {category}
          </label>
        ))}
      </div>

      {/* Price Range */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Khoảng giá</h3>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min={0}
            value={priceRange[0]}
            onChange={handlePriceMinChange}
            className="w-16 p-1 border border-gray-400 rounded"
          />
          <span>-</span>
          <input
            type="number"
            min={0}
            value={priceRange[1]}
            onChange={handlePriceMaxChange}
            className="w-16 p-1 border border-gray-400 rounded"
          />
          <span>VNĐ</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
