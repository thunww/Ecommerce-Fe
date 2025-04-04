import React from "react";

const BasicInformation = ({ productData, onInputChange }) => {
  return (
    <div className="space-y-8">
      {/* Product Images */}
      <div className="grid grid-cols-[180px,1fr] gap-2">
        <div className="flex items-start">
          <span className="text-red-500 mr-0.5">*</span>
          <span className="text-sm">Product Images</span>
        </div>
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">
                1
              </span>
              <span className="text-sm text-gray-600">1:1 Image</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center text-xs">
                2
              </span>
              <span className="text-sm text-gray-600">3-4 Image</span>
            </div>
            <button className="text-blue-600 text-sm">View Example</button>
          </div>
          <div className="border border-dashed border-gray-300 rounded p-2 w-[120px] h-[120px] flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
            <div className="w-6 h-6 mb-1">
              <svg viewBox="0 0 24 24" fill="none" className="text-red-500">
                <path
                  d="M12 4v16m8-8H4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-500">Add Image (0/9)</span>
          </div>
        </div>
      </div>

      {/* Promotion Image */}
      <div className="grid grid-cols-[180px,1fr] gap-2">
        <div className="flex items-start">
          <span className="text-red-500 mr-0.5">*</span>
          <span className="text-sm">Promotion Image</span>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-2">
            <div>• Upload 1:1 image</div>
            <div>
              • Promotion image will be used on the promotion page, search
              result page, daily discover, etc... Upload Promotion Image will
              inspire buyers to click on your product.
            </div>
          </div>
          <div className="border border-dashed border-gray-300 rounded p-2 w-[120px] h-[120px] flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
            <div className="w-6 h-6 mb-1">
              <svg viewBox="0 0 24 24" fill="none" className="text-red-500">
                <path
                  d="M12 4v16m8-8H4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-500">Add Image (0/1)</span>
          </div>
        </div>
      </div>

      {/* Product Video */}
      <div className="grid grid-cols-[180px,1fr] gap-2">
        <div className="flex items-start">
          <span className="text-sm">Product Video</span>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-2">
            <div>
              • Size: Max 30MB, resolution should not exceed 1280×1280px
            </div>
            <div>• Duration: 10s-60s</div>
            <div>• Format: MP4</div>
            <div>
              • Note: You can publish this listing while the video is being
              processed. Video will be shown in listing once successfully
              processed.
            </div>
          </div>
          <div className="border border-dashed border-gray-300 rounded p-2 w-[120px] h-[120px] flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
            <div className="w-6 h-6 mb-1">
              <svg viewBox="0 0 24 24" fill="none" className="text-red-500">
                <path
                  d="M12 4v16m8-8H4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-500">Add Video</span>
          </div>
        </div>
      </div>

      {/* Product Name */}
      <div className="grid grid-cols-[180px,1fr] gap-2">
        <div className="flex items-start">
          <span className="text-red-500 mr-0.5">*</span>
          <span className="text-sm">Product Name</span>
        </div>
        <div className="relative">
          <input
            type="text"
            value={productData.productName}
            onChange={(e) => onInputChange("productName", e.target.value)}
            placeholder="Brand Name + Product Type + Key Features (Materials, Colors, Size, Model)"
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            maxLength={120}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            {productData.productName.length}/120
          </span>
        </div>
      </div>

      {/* Category */}
      <div className="grid grid-cols-[180px,1fr] gap-2">
        <div className="flex items-start">
          <span className="text-red-500 mr-0.5">*</span>
          <span className="text-sm">Category</span>
        </div>
        <div className="relative">
          <input
            type="text"
            value={productData.category}
            readOnly
            placeholder="Please set category"
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50 cursor-pointer"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Product Description */}
      <div className="grid grid-cols-[180px,1fr] gap-2">
        <div className="flex items-start">
          <span className="text-red-500 mr-0.5">*</span>
          <span className="text-sm">Product Description</span>
        </div>
        <div className="relative">
          <textarea
            value={productData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm min-h-[200px] resize-none"
            maxLength={3000}
            placeholder="Please enter product description"
          />
          <span className="absolute right-3 bottom-3 text-xs text-gray-400">
            {productData.description.length}/3000
          </span>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
