import React, { useState } from "react";
import { IoSearchSharp, IoCloseOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { searchProducts } from "../../../../redux/productSilce";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { searchResults, loading, error } = useSelector(
    (state) => state.products
  );

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleClearSearch = () => {
    setSearchValue("");
  };

  // Xử lý nhấn Enter để tìm kiếm
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex justify-center w-full py-1">
      <div className="w-full max-w-lg relative">
        <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
          <div className="flex-grow">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for products, brands and more"
              className="w-full py-2 px-4 text-gray-700 focus:outline-none text-sm"
            />
          </div>

          {searchValue && (
            <button
              onClick={handleClearSearch}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <IoCloseOutline className="text-lg" />
            </button>
          )}

          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white flex items-center justify-center h-8 w-8 rounded-full m-1"
            disabled={loading}
          >
            <IoSearchSharp className="text-base" />
          </button>
        </div>

        {/* Hiển thị trạng thái loading */}
        {loading && (
          <div className="mt-2 text-center text-gray-500">Loading...</div>
        )}

        {/* Hiển thị lỗi */}
        {error && (
          <div className="mt-2 text-center text-red-500">
            {typeof error === "string"
              ? error
              : error.message || "Search failed"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
