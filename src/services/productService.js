import productApi from "../api/VendorAPI/productApi";
import axiosClient from "../api/axiosClient";

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
      const response = await productApi.getProductById(productId);
      return response.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw error;
    }
  },

  // Tạo sản phẩm mới - Gọi đến API productApi đã được định nghĩa
  async createProduct(formData) {
    console.log("ProductService: Tạo sản phẩm mới");

    // Kiểm tra xem formData có thực sự là FormData hay không
    if (!(formData instanceof FormData)) {
      console.error("Tham số không phải là FormData!");
      throw new Error("Dữ liệu phải là FormData");
    }

    // Liệt kê các trường trong formData để kiểm tra
    const existingKeys = [];
    for (let key of formData.keys()) {
      existingKeys.push(key);
    }
    console.log("Các trường hiện có trong formData:", existingKeys);

    // Danh sách các trường bắt buộc
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

    // Kiểm tra và thêm các trường còn thiếu với giá trị mặc định
    for (const field of requiredFields) {
      if (!existingKeys.includes(field)) {
        console.warn(`Trường ${field} bị thiếu, thêm giá trị mặc định`);

        // Thêm giá trị mặc định tùy theo trường
        switch (field) {
          case "productName":
            formData.append("productName", "Sản phẩm mới");
            break;
          case "price":
            formData.append("price", "0");
            break;
          case "stock":
            formData.append("stock", "1");
            break;
          case "category":
            formData.append("category", "3"); // Mặc định là Computers
            break;
          case "description":
            formData.append("description", "Chưa có mô tả");
            break;
          case "status":
            formData.append("status", "pending");
            break;
          case "parcelSize":
            formData.append("parcelSize", "medium");
            break;
          case "weight":
            formData.append("weight", "0.5");
            break;
          default:
            formData.append(field, "");
        }
      }
    }

    // Lấy userId từ localStorage
    const userDataStr = localStorage.getItem("user");
    let shopId = "1"; // Giá trị mặc định

    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        const userId = userData.id;
        console.log("Đã lấy được userId từ localStorage:", userId);

        // Map userId với shopId tương ứng
        // Giả sử có một mapping đơn giản
        shopId = userId.toString();
        console.log("ShopId được map:", shopId);
      } catch (error) {
        console.error("Lỗi khi parse userData từ localStorage:", error);
      }
    } else {
      console.warn("Không tìm thấy thông tin user trong localStorage");
    }

    // Thêm hoặc cập nhật shopId trong formData
    formData.set("shopId", shopId);
    console.log("Đã set shopId trong formData:", shopId);

    // Kiểm tra nếu có biến thể mà không ở dạng JSON, thì chuyển đổi
    if (
      existingKeys.includes("price") &&
      existingKeys.includes("stock") &&
      !existingKeys.includes("variations")
    ) {
      console.log("Tạo biến thể mặc định từ giá và số lượng chính");
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
          image_url: "default.jpg",
        },
      ];

      formData.append("variations", JSON.stringify(defaultVariation));
    }

    try {
      console.log("Gửi formData lên server...");

      // Chuyển đổi FormData thành JSON object
      const jsonData = {};
      for (let [key, value] of formData.entries()) {
        // Xử lý các trường đặc biệt
        if (
          key === "variations" ||
          key === "shippingOptions" ||
          key === "parcelSize"
        ) {
          try {
            jsonData[key] = JSON.parse(value);
          } catch (e) {
            jsonData[key] = value;
          }
        }
        // Xử lý images
        else if (key === "images" || key === "imageUrls") {
          if (!jsonData.images) jsonData.images = [];
          if (value instanceof File) {
            // Tạm thời dùng URL placeholder cho file
            jsonData.images.push("https://via.placeholder.com/300x300");
          } else {
            jsonData.images.push(value);
          }
        }
        // Các trường thông thường
        else {
          jsonData[key] = value;
        }
      }

      // Đảm bảo các trường bắt buộc có định dạng đúng
      jsonData.price = parseFloat(jsonData.price) || 0;
      jsonData.stock = parseInt(jsonData.stock) || 0;
      jsonData.weight = parseFloat(jsonData.weight) || 0.5;

      // Đảm bảo variations có định dạng đúng
      if (jsonData.variations && Array.isArray(jsonData.variations)) {
        jsonData.variations = jsonData.variations.map((v) => ({
          ...v,
          price: parseFloat(v.price) || jsonData.price,
          stock: parseInt(v.stock) || jsonData.stock,
          weight: parseFloat(v.weight) || jsonData.weight,
        }));
      }

      console.log("Dữ liệu JSON được chuẩn bị:", jsonData);

      // Gửi request với JSON
      const response = await productApi.createProduct(jsonData);
      console.log("Response từ server:", response);

      // Phân tích cấu trúc phản hồi
      if (response) {
        console.log("Đang phân tích cấu trúc phản hồi...");

        // Trường hợp 1: response.data.data.product_id hoặc response.data.data.id
        if (response.data && response.data.data) {
          if (response.data.data.product_id || response.data.data.id) {
            const productId =
              response.data.data.product_id || response.data.data.id;
            console.log("Tìm thấy ID sản phẩm ở data.data:", productId);
            return { data: { product_id: productId } };
          }
        }

        // Trường hợp 2: response.data.product_id hoặc response.data.id
        if (response.data) {
          if (response.data.product_id || response.data.id) {
            const productId = response.data.product_id || response.data.id;
            console.log("Tìm thấy ID sản phẩm ở data:", productId);
            return { data: { product_id: productId } };
          }
        }

        // Trường hợp 3: response có message thành công
        if (response.data && (response.data.message || response.data.success)) {
          console.log(
            "Không tìm thấy ID nhưng có message thành công:",
            response.data
          );
          return {
            data: {
              message: response.data.message || "Tạo sản phẩm thành công",
              success: true,
            },
          };
        }

        // Trường hợp 4: response.success = true (ở cấp cao nhất)
        if (response.success === true) {
          console.log("Tìm thấy success flag ở cấp cao nhất");
          return { success: true, data: {} };
        }

        // Trả về response gốc nếu không khớp với các trường hợp trên
        console.log("Trả về response gốc vì không khớp các pattern");
        return response;
      }

      // Nếu không có response, trả về lỗi
      throw new Error("Không nhận được phản hồi từ server");
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      throw error;
    }
  },

  // Tạo sản phẩm mới với FormData - Cho trường hợp có file ảnh
  createProductWithFormData: async (formData) => {
    try {
      console.log("Gọi API tạo sản phẩm với FormData");

      // Log để debug
      for (let [key, value] of formData.entries()) {
        if (key !== "images" || (key === "images" && value instanceof File)) {
          console.log(
            `FormData: ${key} = ${value instanceof File ? value.name : value}`
          );
        } else if (key === "variations") {
          console.log(`FormData: ${key} = ${value.substring(0, 100)}...`);
        }
      }

      const response = await productApi.createProduct(formData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm với FormData:", error);
      throw error;
    }
  },

  // Tạo sản phẩm mới với JSON - Cho trường hợp không có file ảnh
  createProductWithJson: async (productData) => {
    try {
      console.log("Gọi API tạo sản phẩm với JSON");
      console.log("JSON Data:", productData);

      const response = await productApi.createProductWithJson(productData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm với JSON:", error);
      throw error;
    }
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
      const response = await productApi.getAllProducts();
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default productService;
