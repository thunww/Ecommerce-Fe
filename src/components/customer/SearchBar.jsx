import { Search, X } from "lucide-react";
import { useState } from "react";

const SearchBar = ({ placeholder = "Search products..." }) => {
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  
  const handleClear = () => {
    setSearchText("");
  };

  return (
    <div className="relative w-full max-w-md">
      <div className={`flex items-center relative rounded-full transition-all duration-200 border ${
        isFocused ? "border-blue-500 shadow-md ring-2 ring-blue-100" : "border-gray-300"
      }`}>
        <div className="absolute left-3 flex items-center justify-center">
          <Search className="text-gray-500" size={18} />
        </div>
        
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full bg-white py-2.5 pl-10 pr-10 rounded-full text-sm focus:outline-none"
        />
        
        {searchText && (
          <button 
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Clear search"
          >
            <X size={16} className="text-gray-500" />
          </button>
        )}
      </div>
      
      {isFocused && searchText && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-2">
          <div className="text-xs text-gray-500 px-4 py-1 uppercase font-semibold">Suggestions</div>
          <div className="hover:bg-gray-50 px-4 py-2 cursor-pointer transition-colors duration-150">
            {searchText} in all categories
          </div>
          <div className="hover:bg-gray-50 px-4 py-2 cursor-pointer transition-colors duration-150">
            {searchText} in electronics
          </div>
          <div className="text-center text-sm text-blue-600 hover:text-blue-800 py-2 cursor-pointer">
            See all results
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;