import React, { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";

const Search = () => {
  const [searchValue, setSearchValue] = useState("");

  const handleClearSearch = () => {
    setSearchValue("");
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

          <button className="bg-blue-600 hover:bg-blue-700 transition-colors text-white flex items-center justify-center h-8 w-8 rounded-full m-1">
            <IoSearchSharp className="text-base" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Search;
