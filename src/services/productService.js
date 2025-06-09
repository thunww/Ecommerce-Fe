import productApi from "../api/VendorAPI/productApi";
import productApi1 from "../api/productApi";
import axiosClient from "../api/axiosClient";
import axios from "axios";

const productService = {
  // Lấy danh sách sản phẩm theo shopId
  getProductsByShopId: async (shopId) => {
    try {
      const response = await productApi.getProductsByShopId(shopId);
      return response.data;
    } catch (error) {
      console.error("Error fetching products by shopId:", error);
      throw error;
    }
  },

  // Lấy chi tiết sản phẩm theo ID
  getProductById: async (productId) => {
    try {
      const response = await productApi1.getProductById(productId);
      return response.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw error;
    }
  },
  updateProductStatus: async (productId, status) => {
    try {
      const response = await productApi1.updateProductStatus(productId, status);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getProductRelated: async (categoryId) => {
    try {
      const response = await productApi1.getProductRelated(categoryId);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  searchProduct: async ({
    keyword = "",
    categoryId,
    minPrice,
    maxPrice,
    sort,
    minRating,
  } = {}) => {
    try {
      const response = await productApi1.searchProduct({
        keyword,
        categoryId,
        minPrice,
        maxPrice,
        sort,
        minRating,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  searchSuggest: async (keyword, limit = 5) => {
    try {
      const response = await productApi1.searchSuggest(keyword, limit);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteProductById: async (productId) => {
    try {
      const response = await productApi1.deleteProduct(productId);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ===== BẮT ĐẦU: CÁC HÀM TẠO SẢN PHẨM =====

  // Lấy thông tin shop từ API
  _getShopInfo: async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return null;

      const response = await axiosClient.get("/vendor/my-shop");

      if (response && response.data && response.data.shop_id !== undefined) {
        return response.data.shop_id.toString();
      }
      return null;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin shop:", error);
      return null;
    }
  },

  // Kiểm tra và chuẩn bị FormData - đơn giản hóa để không làm mất thông tin file
  _prepareFormData: async (formData) => {
    // Kiểm tra xem formData có thực sự là FormData hay không
    if (!(formData instanceof FormData)) {
      throw new Error("Dữ liệu phải là FormData");
    }

    // Kiểm tra các trường trong formData
    const existingKeys = Array.from(formData.keys());
    console.log("Các trường trong FormData:", existingKeys);

    // Kiểm tra các trường bắt buộc
    const requiredFields = [
      "productName",
      "price",
      "stock",
      "category",
      "description",
      "status",
      "parcelSize",
      "weight",
    ];

    const missingFields = requiredFields.filter(
      (field) => !existingKeys.includes(field)
    );

    if (missingFields.length > 0) {
      throw new Error(`Thiếu các trường bắt buộc: ${missingFields.join(", ")}`);
    }

    // Lấy shopId và gán vào FormData
    const shopId = (await productService._getShopInfo()) || "1";
    formData.set("shopId", shopId);

    // Tạo biến thể mặc định nếu chưa có
    if (
      existingKeys.includes("price") &&
      existingKeys.includes("stock") &&
      !existingKeys.includes("variations")
    ) {
      const price = formData.get("price");
      const stock = formData.get("stock");
      const weight = formData.get("weight") || "0.5";

      const defaultVariation = [
        {
          color: "Mặc định",
          material: "Mặc định",
          size: null,
          ram: null,
          processor: null,
          storage: null,
          price: parseFloat(price) || 0,
          stock: parseInt(stock) || 1,
          weight: parseFloat(weight) || 0.5,
          image_url: null,
        },
      ];

      formData.append("variations", JSON.stringify(defaultVariation));
    }

    // QUAN TRỌNG: Xử lý lại ảnh để đảm bảo tên field đúng với yêu cầu backend
    const hasPrimaryImage = existingKeys.includes("primaryImage");
    const hasAdditionalImages = existingKeys.includes("additionalImages");

    if (hasPrimaryImage || hasAdditionalImages) {
      // Tạo FormData mới
      const newFormData = new FormData();

      // Copy tất cả các trường không phải ảnh
      for (let [key, value] of formData.entries()) {
        if (
          key !== "primaryImage" &&
          key !== "additionalImages" &&
          key !== "imageUrls"
        ) {
          newFormData.append(key, value);
        }
      }

      // Xử lý ảnh chính
      if (hasPrimaryImage) {
        const primaryImage = formData.get("primaryImage");
        if (primaryImage instanceof File) {
          newFormData.append("primaryImage", primaryImage);
          console.log(
            `Đã thêm ảnh chính: ${primaryImage.name} (${Math.round(
              primaryImage.size / 1024
            )} KB)`
          );
        }
      }

      // Xử lý các ảnh phụ
      if (hasAdditionalImages) {
        const additionalImages = formData.getAll("additionalImages");
        additionalImages.forEach((image, index) => {
          if (image instanceof File) {
            newFormData.append("additionalImages", image);
            console.log(
              `Đã thêm ảnh phụ ${index + 1}: ${image.name} (${Math.round(
                image.size / 1024
              )} KB)`
            );
          }
        });
      }

      // Xử lý imageUrls nếu có
      if (existingKeys.includes("imageUrls")) {
        try {
          const imageUrls = JSON.parse(formData.get("imageUrls"));
          if (Array.isArray(imageUrls) && imageUrls.length > 0) {
            newFormData.append("imageUrls", JSON.stringify(imageUrls));
          }
        } catch (e) {
          console.error("Lỗi khi parse imageUrls:", e);
        }
      }

      // Log để kiểm tra
      console.log("=== FORMDATA SAU KHI XỬ LÝ ẢNH ===");
      for (let [key, value] of newFormData.entries()) {
        if (value instanceof File) {
          console.log(
            `${key}: File[${value.name}] (${Math.round(value.size / 1024)} KB)`
          );
        } else if (
          key === "variations" ||
          key === "parcelSize" ||
          key === "shippingOptions"
        ) {
          console.log(`${key}: [JSON Data]`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      return newFormData;
    }

    return formData;
  },

  // Xử lý tạo sản phẩm với FormData
  createProductWithFormData: async (formData) => {
    try {
      // Validate dữ liệu trước khi gửi
      if (
        !formData.get("productName") ||
        !formData.get("description") ||
        !formData.get("price") ||
        !formData.get("stock") ||
        !formData.get("category")
      ) {
        throw new Error("Vui lòng điền đầy đủ thông tin cơ bản của sản phẩm");
      }

      // Kiểm tra ảnh
      const primaryImage = formData.get("primaryImage");
      if (!primaryImage) {
        throw new Error("Vui lòng tải lên ít nhất một hình ảnh sản phẩm");
      }

      // Xử lý FormData trước khi gửi
      const processedFormData = await productService._prepareFormData(formData);

      // Log để kiểm tra
      console.log("=== FORMDATA TRƯỚC KHI GỬI ĐI ===");
      for (let [key, value] of processedFormData.entries()) {
        if (value instanceof File) {
          console.log(
            `${key}: File[${value.name}] (${Math.round(value.size / 1024)} KB)`
          );
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      // Gọi API tạo sản phẩm
      const response = await productApi.createProduct(processedFormData);

      // Xử lý response
      if (response.data?.success) {
        return response.data;
      } else {
        throw new Error(response.data?.message || "Tạo sản phẩm thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      throw error;
    }
  },

  // Alias cho createProductWithFormData để tương thích với code cũ
  createProduct: async function (formData) {
    return this.createProductWithFormData(formData);
  },

  // Cập nhật sản phẩm
  updateProduct: async (productId, productData) => {
    try {
      const response = await productApi.updateProduct(productId, productData);
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  // Xóa sản phẩm
  deleteProduct: async (productId) => {
    try {
      const response = await productApi.deleteProduct(productId);
      return response.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  // Upload ảnh sản phẩm
  uploadProductImage: async (productId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await productApi.uploadProductImage(productId, formData);
      return response.data;
    } catch (error) {
      console.error("Error uploading product image:", error);
      throw error;
    }
  },

  // Lấy sản phẩm theo bộ lọc
  getFilteredProducts: async (shopId, filters) => {
    try {
      const response = await productApi.getFilteredProducts(shopId, filters);
      return response.data;
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      throw error;
    }
  },

  // Cập nhật số lượng tồn kho
  updateStock: async (productId, quantity) => {
    try {
      const response = await productApi.updateStock(productId, { quantity });
      return response.data;
    } catch (error) {
      console.error("Error updating stock:", error);
      throw error;
    }
  },

  // Cập nhật trạng thái sản phẩm
  updateStatus: async (productId, status) => {
    try {
      const response = await productApi.updateStatus(productId, { status });
      return response.data;
    } catch (error) {
      console.error("Error updating product status:", error);
      throw error;
    }
  },

  // Lấy thống kê sản phẩm
  getProductStats: async (shopId) => {
    try {
      const response = await productApi.getProductStats(shopId);
      return response.data;
    } catch (error) {
      console.error("Error fetching product statistics:", error);
      throw error;
    }
  },

  // Xử lý vi phạm sản phẩm
  handleViolation: async (productId, responseData) => {
    try {
      const response = await productApi.handleViolation(
        productId,
        responseData
      );
      return response.data;
    } catch (error) {
      console.error("Error handling violation:", error);
      throw error;
    }
  },

  // Lấy danh sách danh mục sản phẩm
  getCategories: async () => {
    try {
      const response = await productApi.getCategories();
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  getAllProducts: async () => {
    try {
      const response = await productApi1.getAllProducts();
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};

export default productService;
