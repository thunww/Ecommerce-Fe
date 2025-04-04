import React from "react";

const PromotionImage = ({ image, onChange }) => {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <span className="text-red-500 mr-1">*</span>
        <label className="text-sm font-medium">Promotion Image</label>
      </div>

      <div className="flex items-start space-x-4">
        <div className="w-24 h-24 flex-shrink-0">
          {image ? (
            <div className="relative w-full h-full">
              <img
                src={URL.createObjectURL(image)}
                alt="Promotion"
                className="w-full h-full object-cover border rounded"
              />
              <button
                onClick={() => onChange(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="w-full h-full border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-gray-400">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="promotion-image"
              />
              <label htmlFor="promotion-image" className="text-center cursor-pointer">
                <div className="text-gray-400 text-sm">Add Image</div>
                <div className="text-gray-400 text-sm">(0/1)</div>
              </label>
            </div>
          )}
        </div>

        <div className="flex-1">
          <p className="text-sm text-gray-500">
            Upload 1:1 Image.
            <br />
            Promotion image will be used on the promotion page, search result page, daily discover, etc.
            <br />
            Upload Promotion Image will inspire buyers to click on your product.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromotionImage;