import React, { useRef, useState, useEffect } from "react";
import {
  FaTimes,
  FaSearchPlus,
  FaSearchMinus,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import axios from "axios";
import { API_BASE_URL } from "../../config/config";

const ImageViewer = ({
  isOpen,
  imageUrl,
  productName,
  onClose,
  images = [],
  productId = null,
}) => {
  const imageContainerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy ảnh từ API theo product_id
  useEffect(() => {
    const fetchProductImages = async () => {
      if (!isOpen) return;

      setIsLoading(true);
      setError(null);

      try {
        // Phương án 1: Sử dụng hình ảnh đã được truyền vào component
        if (images && images.length > 0) {
          console.log("Using provided images:", images);
          setLoadedImages(
            images.map((img, index) => ({
              url: typeof img === "string" ? img : img.url,
              label: productName || "Ảnh sản phẩm",
              isPrimary: index === 0,
            }))
          );
          setIsLoading(false);
          return;
        }

        // Phương án 2: Sử dụng imageUrl được truyền vào
        if (imageUrl) {
          console.log("Using provided imageUrl:", imageUrl);
          setLoadedImages([
            {
              url: imageUrl,
              label: productName || "Ảnh sản phẩm",
              isPrimary: true,
            },
          ]);
          setIsLoading(false);
          return;
        }

        // Phương án 3: Gọi API nếu có productId
        if (productId) {
          try {
            console.log("Fetching images for product ID:", productId);
            const token = localStorage.getItem("accessToken");

            // Gọi API lấy danh sách sản phẩm trực tiếp
            const response = await axios.get(
              `${API_BASE_URL}/api/v1/vendor/shop/products`,
              {
                headers: {
                  Authorization: token ? `Bearer ${token}` : "",
                },
                timeout: 8000, // Set timeout 8 seconds
              }
            );

            if (!response.data || !Array.isArray(response.data)) {
              throw new Error("API trả về dữ liệu không hợp lệ");
            }

            // Tìm sản phẩm trong danh sách
            const productIdInt = parseInt(productId);
            const product = response.data.find(
              (p) => p.product_id === productIdInt
            );

            if (!product) {
              console.error(`Không tìm thấy sản phẩm với ID: ${productId}`);
              throw new Error(`Không tìm thấy sản phẩm với ID: ${productId}`);
            }

            console.log("Found product:", product);

            // Xử lý ảnh từ dữ liệu sản phẩm
            const productImages = [];

            // Thêm ảnh chính (nếu có)
            if (product.main_image) {
              productImages.push({
                url: product.main_image,
                label: product.product_name || "Ảnh chính",
                isPrimary: true,
              });
            }

            // Thêm các ảnh khác từ mảng images
            if (product.images && Array.isArray(product.images)) {
              const additionalImages = product.images
                .filter(
                  (img) => img && img.url && img.url !== product.main_image
                )
                .map((img, index) => ({
                  url: img.url,
                  label: product.product_name + ` - ${index + 1}`,
                  isPrimary: false,
                }));

              productImages.push(...additionalImages);
            }

            // Nếu không có ảnh nào, dùng ảnh mặc định từ prop
            if (productImages.length === 0 && imageUrl) {
              productImages.push({
                url: imageUrl,
                label: productName || "Ảnh sản phẩm",
                isPrimary: true,
              });
            }

            if (productImages.length > 0) {
              setLoadedImages(productImages);
              setError(null);
            } else {
              throw new Error("Sản phẩm không có ảnh");
            }
          } catch (error) {
            console.error("Lỗi khi tải ảnh sản phẩm:", error);
            fallbackToProvidedImage();
          }
        } else {
          // Không có dữ liệu để hiển thị
          setError("Không có ảnh để hiển thị");
        }
      } catch (error) {
        console.error("Lỗi tổng thể:", error);
        fallbackToProvidedImage();
      } finally {
        setIsLoading(false);
      }
    };

    // Hàm xử lý dữ liệu ảnh từ sản phẩm
    const processProductImages = (product) => {
      let productImages = [];

      // Thêm ảnh chính
      if (product.main_image) {
        productImages.push({
          url: product.main_image,
          label: product.product_name,
          isPrimary: true,
        });
      }

      // Thêm ảnh biến thể
      if (product.images && Array.isArray(product.images)) {
        const additionalImages = product.images
          .filter((img) => img.url && img.url !== product.main_image)
          .map((img, index) => ({
            url: img.url,
            label: `${product.product_name} - ${index + 1}`,
            isPrimary: false,
            variantId: img.variant_id,
            price: img.price,
          }));

        productImages = [...productImages, ...additionalImages];
      }

      if (productImages.length > 0) {
        setLoadedImages(productImages);
        setCurrentImageIndex(0);
      } else {
        fallbackToProvidedImage();
      }
    };

    // Fallback to imageUrl if available
    const fallbackToProvidedImage = () => {
      if (imageUrl) {
        console.log("Fallback to imageUrl:", imageUrl);
        setLoadedImages([
          {
            url: imageUrl,
            label: productName || "Ảnh sản phẩm",
            isPrimary: true,
          },
        ]);
        setError(null);
      } else if (images && images.length > 0) {
        // Fallback to provided images
        setLoadedImages(
          images.map((img, index) => ({
            url: typeof img === "string" ? img : img.url,
            label: productName || "Ảnh sản phẩm",
            isPrimary: index === 0,
          }))
        );
        setError(null);
      } else {
        setError("Không có ảnh để hiển thị");
      }
    };

    fetchProductImages();
  }, [isOpen, imageUrl, images, productId, productName]);

  // Sử dụng danh sách ảnh đã tải hoặc danh sách được cung cấp
  const imageList =
    loadedImages.length > 0
      ? loadedImages
      : images.length > 0
      ? images
      : imageUrl
      ? [{ url: imageUrl, label: productName }]
      : [];

  // Reset khi mở viewer mới hoặc khi đổi ảnh
  useEffect(() => {
    if (isOpen) {
      // Reset zoom và position
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, currentImageIndex]);

  // Cải thiện xử lý ảnh hiện tại
  const currentImage = imageList[currentImageIndex] || null;
  let currentImageUrl = "";
  let currentImageLabel = "";

  // Xử lý đúng cách tùy thuộc vào loại dữ liệu
  if (currentImage) {
    if (typeof currentImage === "string") {
      currentImageUrl = currentImage;
      currentImageLabel = productName || "Ảnh sản phẩm";
    } else {
      currentImageUrl = currentImage.url || "";
      currentImageLabel =
        currentImage.label ||
        currentImage.variantName ||
        productName ||
        "Ảnh sản phẩm";
    }
  } else if (imageUrl) {
    // Fallback sang imageUrl nếu không tìm thấy ảnh trong danh sách
    currentImageUrl = imageUrl;
    currentImageLabel = productName || "Ảnh sản phẩm";
  }

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
    }

    // Cleanup khi component unmount
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("wheel", preventScroll);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Hiển thị trạng thái loading
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
        <div className="bg-white rounded-lg p-6 flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg">Đang tải ảnh sản phẩm...</p>
        </div>
      </div>
    );
  }

  // Hiển thị lỗi khi không có ảnh nào
  if (error && imageList.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
        <div className="bg-white rounded-lg p-6 flex flex-col items-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  // Xử lý phóng to
  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.25, 3));
  };

  // Xử lý thu nhỏ
  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.25, 0.5));
  };

  // Xử lý mở đầu kéo thả
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
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
    if (imageList.length <= 1) return;

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
    if (imageList.length <= 1) return;

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
              onClick={handlePrevImage}
            >
              <FaChevronLeft className="h-6 w-6" />
            </button>
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 z-10"
              onClick={handleNextImage}
            >
              <FaChevronRight className="h-6 w-6" />
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
          ref={imageContainerRef}
        >
          {/* Hiển thị ảnh với scale và position */}
          {currentImageUrl ? (
            <img
              src={currentImageUrl}
              alt={currentImageLabel || "Ảnh sản phẩm"}
              className="max-h-[80vh] max-w-[80vw] object-contain transition-transform"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: "center",
                transition: isDragging ? "none" : "transform 0.2s ease-out",
              }}
              onError={(e) => {
                console.error("Failed to load image:", currentImageUrl);
                e.target.src =
                  "https://via.placeholder.com/400x400?text=Ảnh+không+tải+được";
              }}
            />
          ) : (
            <div className="bg-gray-200 p-8 rounded text-gray-500">
              Không có ảnh
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
            title="Phóng to"
          >
            <FaSearchPlus className="h-6 w-6" />
          </button>
          <button
            className="bg-white bg-opacity-75 rounded-full p-2 hover:bg-opacity-100"
            onClick={handleZoomOut}
            title="Thu nhỏ"
          >
            <FaSearchMinus className="h-6 w-6" />
          </button>
          <button
            className="bg-white bg-opacity-75 rounded-full p-2 hover:bg-opacity-100"
            onClick={() => {
              setScale(1);
              setPosition({ x: 0, y: 0 });
            }}
            title="Đặt lại kích thước"
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

        {/* Chỉ thị số ảnh */}
        {imageList.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full">
            {currentImageIndex + 1} / {imageList.length}
          </div>
        )}

        {/* Nút đóng viewer */}
        <button
          className="absolute top-4 right-4 bg-white bg-opacity-75 rounded-full p-2 hover:bg-opacity-100"
          onClick={onClose}
          title="Đóng"
        >
          <FaTimes className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default ImageViewer;
