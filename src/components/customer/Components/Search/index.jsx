import React, { useState, useEffect, useRef } from "react";
import { IoSearchSharp, IoCloseOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import productService from "../../../../services/productService";

const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef(null);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Reset khi rời khỏi trang /search
  useEffect(() => {
    if (!location.pathname.startsWith("/search")) {
      setSearchValue("");
      setSuggestions([]);
    }
  }, [location.pathname]);

  // Debounce gọi gợi ý
  useEffect(() => {
    if (!searchValue.trim()) {
      setSuggestions([]);
      return;
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(searchValue);
    }, 300); // debounce 300ms
  }, [searchValue]);

  const fetchSuggestions = async (keyword) => {
    try {
      const res = await productService.searchSuggest(keyword);
      if (res.success) {
        setSuggestions(res.data);
        setShowDropdown(true);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      setSuggestions([]);
    }
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setShowDropdown(false);
    }
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSelectSuggestion = (name) => {
    setSearchValue(name);
    navigate(`/search?q=${encodeURIComponent(name)}`);
    setShowDropdown(false);
  };

  // Ẩn dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-center w-full py-1" ref={dropdownRef}>
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
          >
            <IoSearchSharp className="text-base" />
          </button>
        </div>

        {showDropdown && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-200 mt-1 rounded-md shadow-md max-h-60 overflow-y-auto text-sm">
            {suggestions.map((item) => (
              <li
                key={item.product_id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectSuggestion(item.product_name)}
              >
                {item.product_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
