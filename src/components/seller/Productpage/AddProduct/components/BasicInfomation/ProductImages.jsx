import React from "react";

const ProductImages = ({ images, onChange }) => {
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    onChange(files);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-red-500 mr-1">*</span>
          <label className="text-sm font-medium">Product Images</label>
        </div>
        <div className="flex items-center space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="imageRatio"
              value="1:1"
              defaultChecked
              className="form-radio text-red-500"
            />
            <span className="ml-2 text-sm">1:1 Image</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="imageRatio"
              value="3:4"
              className="form-radio text-gray-400"
            />
            <span className="ml-2 text-sm">3:4 Image</span>
          </label>
          <button className="text-blue-500 text-sm hover:underline">
            View Example
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative w-24 h-24">
            <img
              src={URL.createObjectURL(image)}
              alt={`Product ${index + 1}`}
              className="w-full h-full object-cover border rounded"
            />
            <button
              onClick={() => {
                const newImages = [...images];
                newImages.splice(index, 1);
                onChange(newImages);
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}

        {images.length < 9 && (
          <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-gray-400">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="product-images"
            />
            <label htmlFor="product-images" className="text-center cursor-pointer">
              <div className="text-gray-400 text-sm">Add Image</div>
              <div className="text-gray-400 text-sm">({images.length}/9)</div>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImages;