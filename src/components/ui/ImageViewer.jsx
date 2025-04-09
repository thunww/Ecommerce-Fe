import React, { useRef, useState, useEffect } from "react";
import {
  FaTimes,
  FaSearchPlus,
  FaSearchMinus,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const ImageViewer = ({
  isOpen,
  imageUrl,
  productName,
  onClose,
  images = [],
}) => {
  const imageContainerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Sử dụng danh sách ảnh được cung cấp hoặc tạo một danh sách mới từ imageUrl
  const imageList =
    images.length > 0
      ? images
      : imageUrl
      ? [{ url: imageUrl, label: productName }]
      : [];

  // Reset khi mở viewer mới hoặc khi đổi ảnh
  useEffect(() => {
    if (isOpen) {
      console.log("ImageViewer opened with data:", {
        imageUrl,
        images,
        productName,
      });

      // Reset zoom và position
      setScale(1);
      setPosition({ x: 0, y: 0 });

      // Tìm chỉ mục của ảnh hiện tại trong danh sách
      if (imageUrl && images && images.length > 0) {
        const foundIndex = images.findIndex((img) => {
          if (typeof img === "string") return img === imageUrl;
          return img.url === imageUrl;
        });

        console.log(
          "Found image at index:",
          foundIndex,
          "for imageUrl:",
          imageUrl
        );

        // Nếu tìm thấy ảnh, đặt chỉ mục, nếu không dùng ảnh đầu tiên
        setCurrentImageIndex(foundIndex !== -1 ? foundIndex : 0);
      } else {
        // Mặc định là ảnh đầu tiên nếu không tìm thấy
        setCurrentImageIndex(0);
        console.log("Using default image index 0");
      }
    }
  }, [isOpen, imageUrl, images]);

  // Tạo một useEffect riêng để xử lý việc log thông tin ảnh hiện tại khi currentImageIndex thay đổi
  useEffect(() => {
    if (isOpen && imageList && imageList.length > 0) {
      console.log(
        "Current image info:",
        currentImageIndex,
        imageList[currentImageIndex]
      );
    }
  }, [isOpen, currentImageIndex, imageList]);

  // Cải thiện xử lý ảnh hiện tại
  const currentImage = imageList[currentImageIndex] || null;
  let currentImageUrl = "";
  let currentImageLabel = "";

  // Xử lý đúng cách tùy thuộc vào loại dữ liệu
  if (currentImage) {
    if (typeof currentImage === "string") {
      currentImageUrl = currentImage;
      currentImageLabel = productName || "Product Image";
    } else {
      currentImageUrl = currentImage.url || "";
      currentImageLabel =
        currentImage.label ||
        currentImage.variantName ||
        productName ||
        "Product Image";
    }
  } else if (imageUrl) {
    // Fallback sang imageUrl nếu không tìm thấy ảnh trong danh sách
    currentImageUrl = imageUrl;
    currentImageLabel = productName || "Product Image";
  }

  console.log("Final image data:", { currentImageUrl, currentImageLabel });

  // Ngăn chặn cuộn trang khi trong modal
  useEffect(() => {
    const preventScroll = (e) => {
      if (isOpen) {
        e.preventDefault();
      }
    };

    // Thêm event listener khi component mount
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("wheel", preventScroll, { passive: false });
      console.log("ImageViewer opened with image:", currentImageUrl);
    }

    // Cleanup khi component unmount
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("wheel", preventScroll);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Xử lý phóng to
  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.25, 3));
    console.log("Zoom in. New scale:", Math.min(scale + 0.25, 3));
  };

  // Xử lý thu nhỏ
  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.25, 0.5));
    console.log("Zoom out. New scale:", Math.max(scale - 0.25, 0.5));
  };

  // Xử lý mở đầu kéo thả
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    console.log("Mouse down. Start dragging.");
  };

  // Xử lý khi di chuyển chuột
  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({
        x: newX,
        y: newY,
      });
    }
  };

  // Xử lý kết thúc kéo thả
  const handleMouseUp = () => {
    setIsDragging(false);
    console.log("Mouse up. Stop dragging. Position:", position);
  };

  // Xử lý khi con lăn chuột
  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      // Lăn lên = phóng to
      handleZoomIn();
    } else {
      // Lăn xuống = thu nhỏ
      handleZoomOut();
    }
  };

  // Đóng khi nhấn ESC
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowLeft") {
      handlePrevImage();
    } else if (e.key === "ArrowRight") {
      handleNextImage();
    } else if (e.key === "+" || e.key === "=") {
      handleZoomIn();
    } else if (e.key === "-") {
      handleZoomOut();
    }
  };

  // Xử lý chuyển đến ảnh trước
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => {
      const newIndex = prev - 1 < 0 ? imageList.length - 1 : prev - 1;
      // Reset zoom và position khi chuyển ảnh
      setScale(1);
      setPosition({ x: 0, y: 0 });
      return newIndex;
    });
  };

  // Xử lý chuyển đến ảnh sau
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => {
      const newIndex = (prev + 1) % imageList.length;
      // Reset zoom và position khi chuyển ảnh
      setScale(1);
      setPosition({ x: 0, y: 0 });
      return newIndex;
    });
  };

  // Thêm event listener để xử lý phím
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="relative h-full w-full overflow-hidden flex items-center justify-center">
        {/* Kiểm tra nếu có nhiều ảnh */}
        {imageList.length > 1 && (
          <>
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 z-10"
              onClick={() => {
                setCurrentImageIndex((prev) =>
                  prev === 0 ? imageList.length - 1 : prev - 1
                );
                // Reset scale và position khi chuyển ảnh
                setScale(1);
                setPosition({ x: 0, y: 0 });
                console.log("Switched to previous image");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 z-10"
              onClick={() => {
                setCurrentImageIndex((prev) =>
                  prev === imageList.length - 1 ? 0 : prev + 1
                );
                // Reset scale và position khi chuyển ảnh
                setScale(1);
                setPosition({ x: 0, y: 0 });
                console.log("Switched to next image");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Container xử lý image zoom và pan */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          {/* Hiển thị ảnh với scale và position */}
          {currentImageUrl ? (
            <img
              src={currentImageUrl}
              alt={currentImageLabel || "Product Image"}
              className="max-h-[80vh] max-w-[80vw] object-contain transition-transform"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: "center",
                transition: isDragging ? "none" : "transform 0.2s ease-out",
              }}
              onError={(e) => {
                console.error("Failed to load image:", currentImageUrl);
                // Thử tải lại ảnh một lần trước khi hiển thị ảnh lỗi
                const originalSrc = e.target.src;
                const retryCount = e.target.getAttribute("data-retry") || 0;

                if (parseInt(retryCount) < 1) {
                  console.log("Retrying image load:", originalSrc);
                  e.target.setAttribute("data-retry", "1");

                  // Đặt timeout ngắn để tải lại
                  setTimeout(() => {
                    e.target.src = originalSrc;
                  }, 1000);
                } else {
                  // Nếu đã thử tải lại một lần, hiển thị ảnh lỗi
                  e.target.src =
                    "https://via.placeholder.com/400x400?text=Image+Not+Found";
                }
              }}
            />
          ) : (
            <div className="bg-gray-200 p-8 rounded text-gray-500">
              No image available
            </div>
          )}
        </div>

        {/* Tên sản phẩm và tên biến thể */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-75 px-4 py-2 rounded-lg">
          <h3 className="text-lg font-semibold text-center">
            {currentImageLabel}
          </h3>
        </div>

        {/* Các nút chức năng */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
          <button
            className="bg-white bg-opacity-75 rounded-full p-2 hover:bg-opacity-100"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
          <button
            className="bg-white bg-opacity-75 rounded-full p-2 hover:bg-opacity-100"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 12H6"
              />
            </svg>
          </button>
          <button
            className="bg-white bg-opacity-75 rounded-full p-2 hover:bg-opacity-100"
            onClick={() => {
              setScale(1);
              setPosition({ x: 0, y: 0 });
              console.log("Reset zoom and position");
            }}
            title="Reset Zoom"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>

        {/* Nút đóng viewer */}
        <button
          className="absolute top-4 right-4 bg-white bg-opacity-75 rounded-full p-2 hover:bg-opacity-100"
          onClick={onClose}
          title="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ImageViewer;
