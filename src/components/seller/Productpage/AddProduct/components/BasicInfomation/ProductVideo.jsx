import React from "react";

const ProductVideo = ({ video, onChange }) => {
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Product Video</label>

      <div className="flex items-start space-x-4">
        <div className="w-24 h-24 flex-shrink-0">
          {video ? (
            <div className="relative w-full h-full">
              <video
                src={URL.createObjectURL(video)}
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
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
                id="product-video"
              />
              <label htmlFor="product-video" className="text-center cursor-pointer">
                <div className="text-gray-400 text-sm">Add Video</div>
              </label>
            </div>
          )}
        </div>

        <div className="flex-1 text-sm text-gray-500 space-y-1">
          <p>Size: Max 30Mb, resolution should not exceed 1280x1280px</p>
          <p>Duration: 10s-60s</p>
          <p>Format: MP4</p>
          <p>Note: You can publish this listing while the video is being processed. Video will be shown in listing once successfully processed.</p>
        </div>
      </div>
    </div>
  );
};

export default ProductVideo;