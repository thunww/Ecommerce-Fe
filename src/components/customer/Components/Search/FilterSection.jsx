import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategories } from "../../../../redux/categorySlice";

const priceRanges = [
  { label: "Tất cả", min: "", max: "" },
  { label: "Dưới 100.000₫", min: 0, max: 100000 },
  { label: "100.000₫ - 200.000₫", min: 100000, max: 200000 },
  { label: "200.000₫ - 500.000₫", min: 200000, max: 500000 },
  { label: "500.000₫ - 1.000.000₫", min: 500000, max: 1000000 },
  { label: "1.000.000₫ - 2.000.000₫", min: 1000000, max: 2000000 },
  { label: "2.000.000₫ - 5.000.000₫", min: 2000000, max: 5000000 },
  { label: "5.000.000₫ - 10.000.000₫", min: 5000000, max: 10000000 },
  { label: "Trên 10.000.000₫", min: 10000000, max: "" },
];

const ratingOptions = [
  { label: "Tất cả", value: 0 },
  { label: "⭐⭐⭐⭐⭐ trở lên", value: 5 },
  { label: "⭐⭐⭐⭐ trở lên", value: 4 },
  { label: "⭐⭐⭐ trở lên", value: 3 },
  { label: "⭐⭐ trở lên", value: 2 },
  { label: "⭐ trở lên", value: 1 },
];

const sortOptions = [
  { label: "Mặc định", value: "" },
  { label: "Giá: Thấp đến cao", value: "price_asc" },
  { label: "Giá: Cao đến thấp", value: "price_desc" },
];

const FilterSection = ({ onFilter, filters }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  const [selectedCategories, setSelectedCategories] = useState(
    Array.isArray(filters.categoryId) ? filters.categoryId.map(String) : []
  );
  const [showAllCategories, setShowAllCategories] = useState(false);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  useEffect(() => {
    setSelectedCategories(
      Array.isArray(filters.categoryId) ? filters.categoryId.map(String) : []
    );
  }, [filters.categoryId]);

  const handleCategoryChange = (categoryId) => {
    const id = String(categoryId);
    let newSelected;
    if (selectedCategories.includes(id)) {
      newSelected = [];
    } else {
      newSelected = [id];
    }
    setSelectedCategories(newSelected);
    onFilter({ categoryId: newSelected });
  };

  const handlePriceRangeChange = (range) => {
    onFilter({
      minPrice: range.min,
      maxPrice: range.max,
    });
  };

  const handleSortChange = (value) => {
    onFilter({ sort: value });
  };

  const toggleShowAllCategories = () => {
    setShowAllCategories((prev) => !prev);
  };

  const displayedCategories = showAllCategories
    ? categories
    : categories.slice(0, 5);

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Danh mục */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Danh mục</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {displayedCategories.length > 0 ? (
            displayedCategories.map((cat) => (
              <label
                key={cat.category_id}
                className="flex items-center text-sm text-gray-700 cursor-pointer hover:text-blue-600"
              >
                <input
                  type="radio"
                  name="category"
                  value={cat.category_id}
                  checked={selectedCategories.includes(String(cat.category_id))}
                  onChange={() => handleCategoryChange(cat.category_id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-2"
                />
                {cat.category_name}
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500">Không có danh mục</p>
          )}
        </div>

        {categories.length > 5 && (
          <button
            onClick={toggleShowAllCategories}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800"
            type="button"
          >
            {showAllCategories ? "Thu gọn ▲" : "Xem thêm ▼"}
          </button>
        )}
      </div>

      {/* Khoảng giá */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Khoảng giá</h3>
        <div className="space-y-2">
          {priceRanges.map((range, index) => {
            const isSelected =
              String(filters.minPrice ?? "") === String(range.min) &&
              String(filters.maxPrice ?? "") === String(range.max);
            return (
              <label
                key={index}
                className="flex items-center text-sm text-gray-700 cursor-pointer hover:text-blue-600"
              >
                <input
                  type="radio"
                  name="priceRange"
                  checked={isSelected}
                  onChange={() => handlePriceRangeChange(range)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-2"
                />
                {range.label}
              </label>
            );
          })}
        </div>
      </div>

      {/* Đánh giá */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Đánh giá</h3>
        <div className="space-y-2">
          {ratingOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center text-sm text-gray-700 cursor-pointer hover:text-blue-600"
            >
              <input
                type="radio"
                name="rating"
                checked={Number(filters.minRating ?? 0) === option.value}
                onChange={() => onFilter({ minRating: option.value })}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-2"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {/* Sắp xếp */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Sắp xếp</h3>
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center text-sm text-gray-700 cursor-pointer hover:text-blue-600"
            >
              <input
                type="radio"
                name="sort"
                value={option.value}
                checked={filters.sort === option.value}
                onChange={() => handleSortChange(option.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-2"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
