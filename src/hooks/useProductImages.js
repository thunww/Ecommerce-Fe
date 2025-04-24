import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL, DEFAULT_PRODUCT_IMAGE } from "../config/config";

/**
 * Hook để lấy và quản lý tất cả ảnh của sản phẩm và biến thể
 * @param {number} initialProductId - ID của sản phẩm ban đầu (có thể null)
 * @returns {Object} Các ảnh, phương thức và trạng thái loading
 */
const useProductImages = (initialProductId = null) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productImages, setProductImages] = useState({});
  const [currentProductId, setCurrentProductId] = useState(initialProductId);

  // Hàm kiểm tra URL hình ảnh có hợp lệ không
  const isValidImageUrl = (url) => {
    if (!url) return false;

    // Kiểm tra cơ bản URL có chứa http
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      console.warn("Invalid image URL format (missing http/https):", url);
      return false;
    }

    return true;
  };

  /**
   * Lấy ảnh cho một sản phẩm cụ thể từ API vendor/shop/products
   * @param {number} productId - ID sản phẩm cần lấy ảnh
   * @returns {Array} Mảng ảnh của sản phẩm
   */
  const fetchShopProductImages = useCallback(
    async (productId) => {
      if (!productId) {
        console.warn("fetchShopProductImages called without productId");
        return [];
      }

      // Trả về cache nếu đã có
      if (productImages[productId]) {
        console.log("Using cached images for product ID:", productId);
        return productImages[productId];
      }

      // Không có trong cache, bắt đầu tải
      setLoading(true);
      setError(null);
      console.log("Fetching shop product images for product ID:", productId);

      try {
        // Kiểm tra API_BASE_URL
        if (!API_BASE_URL) {
          throw new Error("API_BASE_URL không được định nghĩa");
        }

        const token = localStorage.getItem("accessToken");

        console.log(
          "Sử dụng API endpoint:",
          `${API_BASE_URL}/api/v1/vendor/shop/products`
        );

        // Lấy danh sách sản phẩm của shop
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/vendor/shop/products`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
            timeout: 10000, // Đặt timeout để không chờ quá lâu
          }
        );

        // Kiểm tra dữ liệu trả về
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("API trả về cấu trúc dữ liệu không hợp lệ");
        }

        // Tìm sản phẩm trong danh sách
        const product = response.data.find(
          (p) => p.product_id === parseInt(productId)
        );

        if (!product) {
          throw new Error(`Không tìm thấy sản phẩm với ID: ${productId}`);
        }

        console.log("Dữ liệu sản phẩm nhận được:", product);

        // Khởi tạo mảng ảnh
        let allImages = [];

        // Xử lý ảnh chính sản phẩm
        if (product.main_image && isValidImageUrl(product.main_image)) {
          allImages.push({
            url: product.main_image,
            label: product.product_name || "Ảnh chính",
            isPrimary: true,
            type: "main",
          });
        }

        // Xử lý các ảnh khác của sản phẩm
        if (product.images && Array.isArray(product.images)) {
          const additionalImages = product.images
            .filter(
              (img) =>
                img &&
                img.url &&
                isValidImageUrl(img.url) &&
                img.url !== product.main_image
            )
            .map((img, index) => ({
              url: img.url,
              label: `${product.product_name || "Sản phẩm"} - ${index + 1}`,
              isPrimary: false,
              imageId: img.image_id,
              type: "additional",
            }));

          allImages = [...allImages, ...additionalImages];
        }

        // Nếu không có ảnh nào, dùng ảnh mặc định
        if (allImages.length === 0 && product.image) {
          allImages.push({
            url: product.image,
            label: product.product_name || "Ảnh sản phẩm",
            isPrimary: true,
            type: "default",
          });
        }

        // Nếu vẫn không có ảnh nào, dùng ảnh placeholder
        if (allImages.length === 0) {
          allImages.push({
            url: "https://via.placeholder.com/400x400?text=Không+Có+Ảnh",
            label: product.product_name || "Ảnh sản phẩm",
            isPrimary: true,
            type: "placeholder",
          });
        }

        console.log("Danh sách ảnh cuối cùng:", allImages);

        // Lưu vào cache
        setProductImages((prev) => ({
          ...prev,
          [productId]: allImages,
        }));

        setLoading(false);
        return allImages;
      } catch (err) {
        console.error("Lỗi khi tải ảnh sản phẩm từ shop API:", err);

        // Tạo ảnh mặc định khi có lỗi
        const defaultImages = [
          {
            url: "https://via.placeholder.com/400x400?text=Lỗi+Tải+Ảnh",
            label: "Lỗi tải ảnh sản phẩm",
            type: "error",
            isPrimary: true,
          },
        ];

        // Lưu ảnh mặc định vào cache để tránh gọi API liên tục khi có lỗi
        setProductImages((prev) => ({
          ...prev,
          [productId]: defaultImages,
        }));

        setError(err.message || "Lỗi không xác định");
        setLoading(false);
        return defaultImages;
      }
    },
    [productImages]
  );

  /**
   * Lấy ảnh cho một sản phẩm cụ thể
   * @param {number} productId - ID sản phẩm cần lấy ảnh
   * @returns {Array} Mảng ảnh của sản phẩm
   */
  const fetchProductImages = useCallback(
    async (productId) => {
      if (!productId) {
        console.warn("fetchProductImages called without productId");
        return [];
      }

      // Trả về cache nếu đã có
      if (productImages[productId]) {
        console.log("Using cached images for product ID:", productId);
        return productImages[productId];
      }

      // Không có trong cache, bắt đầu tải
      setLoading(true);
      setError(null);
      console.log("Fetching images for product ID:", productId);

      try {
        // Kiểm tra API_BASE_URL
        if (!API_BASE_URL) {
          throw new Error("API_BASE_URL không được định nghĩa");
        }

        console.log(
          "Sử dụng API endpoint:",
          `${API_BASE_URL}/products/${productId}`
        );

        // Lấy thông tin chi tiết sản phẩm
        const response = await axios.get(
          `${API_BASE_URL}/products/${productId}`,
          { timeout: 10000 } // Đặt timeout để không chờ quá lâu
        );

        // Kiểm tra dữ liệu trả về
        if (!response.data || !response.data.data) {
          throw new Error("API trả về cấu trúc dữ liệu không hợp lệ");
        }

        const productData = response.data.data;
        console.log("Dữ liệu sản phẩm nhận được:", productData);

        // Khởi tạo mảng ảnh
        let allImages = [];

        // Xử lý ảnh chính sản phẩm
        if (
          productData.images &&
          Array.isArray(productData.images) &&
          productData.images.length > 0
        ) {
          console.log("Dữ liệu ảnh sản phẩm gốc:", productData.images);

          const mainImages = productData.images
            .filter(
              (img) => img && img.image_url && isValidImageUrl(img.image_url)
            )
            .map((img) => ({
              url: img.image_url,
              label:
                productData.product_name + (img.is_primary ? " (Chính)" : ""),
              isPrimary: !!img.is_primary,
              imageId: img.image_id,
              type: "product",
            }));

          console.log("Ảnh sản phẩm chính đã lọc:", mainImages.length);
          allImages = allImages.concat(mainImages);
        }

        // Xử lý ảnh biến thể
        if (
          productData.variants &&
          Array.isArray(productData.variants) &&
          productData.variants.length > 0
        ) {
          console.log("Dữ liệu biến thể gốc:", productData.variants);

          const variantImages = productData.variants
            .filter(
              (variant) =>
                variant &&
                variant.image_url &&
                isValidImageUrl(variant.image_url)
            )
            .map((variant) => {
              const variantInfo = `${variant.color || ""} ${
                variant.material || ""
              }`.trim();
              return {
                url: variant.image_url,
                label: `${productData.product_name}${
                  variantInfo ? ` - ${variantInfo}` : ""
                }`,
                variantId: variant.variant_id,
                color: variant.color || "Mặc định",
                material: variant.material || "Mặc định",
                type: "variant",
              };
            });

          console.log("Ảnh biến thể đã lọc:", variantImages.length);
          allImages = allImages.concat(variantImages);
        }

        // Xử lý trường hợp sản phẩm chỉ có một ảnh đại diện
        if (productData.image && isValidImageUrl(productData.image)) {
          console.log("Sản phẩm có ảnh đại diện:", productData.image);
          allImages.push({
            url: productData.image,
            label: productData.product_name || "Ảnh sản phẩm",
            isPrimary: allImages.length === 0, // Chỉ đặt là ảnh chính nếu không có ảnh nào khác
            type: "product",
          });
        }

        // Nếu không có ảnh nào, dùng ảnh mặc định
        if (allImages.length === 0) {
          console.log("Không tìm thấy ảnh hợp lệ, sử dụng ảnh mặc định");
          allImages.push({
            url:
              DEFAULT_PRODUCT_IMAGE ||
              "https://via.placeholder.com/400x400?text=Không+Có+Ảnh",
            label: productData.product_name || "Ảnh sản phẩm",
            type: "default",
            isPrimary: true,
          });
        }

        // Đảm bảo có ít nhất một ảnh chính
        if (!allImages.some((img) => img.isPrimary)) {
          allImages[0].isPrimary = true;
          console.log("Đặt ảnh đầu tiên là ảnh chính");
        }

        console.log("Danh sách ảnh cuối cùng:", allImages);

        // Lưu vào cache
        setProductImages((prev) => ({
          ...prev,
          [productId]: allImages,
        }));

        setLoading(false);
        return allImages;
      } catch (err) {
        console.error("Lỗi khi tải ảnh sản phẩm:", err);

        // Phân tích lỗi cụ thể
        let errorMessage = "Lỗi không xác định";
        if (err.response) {
          // Lỗi từ phản hồi của server
          errorMessage = `Lỗi từ server: ${err.response.status} - ${err.response.statusText}`;
          console.error("Response data:", err.response.data);
        } else if (err.request) {
          // Lỗi kết nối - không nhận được phản hồi
          errorMessage = "Không thể kết nối đến server";
        } else {
          // Lỗi khi thiết lập request
          errorMessage = err.message || "Lỗi không xác định";
        }

        setError(errorMessage);
        setLoading(false);

        // Trả về ảnh mặc định khi có lỗi
        const defaultImages = [
          {
            url:
              DEFAULT_PRODUCT_IMAGE ||
              "https://via.placeholder.com/400x400?text=Lỗi+Tải+Ảnh",
            label: "Lỗi tải ảnh: " + errorMessage,
            type: "error",
            isPrimary: true,
          },
        ];

        // Lưu ảnh mặc định vào cache để tránh gọi API liên tục khi có lỗi
        setProductImages((prev) => ({
          ...prev,
          [productId]: defaultImages,
        }));

        return defaultImages;
      }
    },
    [productImages]
  );

  // Auto-fetch khi currentProductId thay đổi
  useEffect(() => {
    if (currentProductId) {
      fetchProductImages(currentProductId);
    }
  }, [currentProductId, fetchProductImages]);

  /**
   * Lấy ảnh chính của sản phẩm
   * @param {number} productId - ID sản phẩm
   * @returns {Object|null} Thông tin ảnh chính hoặc null
   */
  const getPrimaryImage = useCallback(
    (productId) => {
      if (!productImages[productId]) return null;

      return (
        productImages[productId].find((img) => img.isPrimary) ||
        productImages[productId][0] ||
        null
      );
    },
    [productImages]
  );

  /**
   * Đặt sản phẩm hiện tại và tải ảnh
   * @param {number} productId - ID sản phẩm
   */
  const setProductId = useCallback((productId) => {
    setCurrentProductId(productId);
  }, []);

  /**
   * Xóa ảnh khỏi cache để buộc tải lại
   * @param {number} productId - ID sản phẩm cần xóa cache
   */
  const invalidateCache = useCallback((productId = null) => {
    if (productId) {
      setProductImages((prev) => {
        const newCache = { ...prev };
        delete newCache[productId];
        return newCache;
      });
    } else {
      setProductImages({});
    }
  }, []);

  return {
    loading,
    error,
    images: productImages[currentProductId] || [],
    allProductImages: productImages,
    fetchProductImages,
    fetchShopProductImages,
    getPrimaryImage,
    setProductId,
    invalidateCache,
    currentProductId,
  };
};

export default useProductImages;
