import axiosClient from "../api/axiosClient";
import categoryApi from "../api/VendorAPI/productApi";
import orderApi from "../api/VendorAPI/orderApi";

// Lấy danh sách đơn hàng của shop
export const getShopOrderedProducts = async (shopId) => {
  try {
    if (!shopId) {
      throw new Error("shopId is required");
    }

    console.log("Calling API with shopId:", shopId);
    const response = await orderApi.getAllOrders_list(shopId);
    console.log("Raw API Response:", response);

    // Kiểm tra response
    if (!response) {
      console.error("No response received");
      throw new Error("No response from server");
    }

    // Lấy dữ liệu từ response
    const responseData = response.data;
    console.log("Response data structure:", {
      fullResponse: response,
      data: responseData,
      success: responseData?.success,
      orderData: responseData?.data,
    });

    if (!responseData || !responseData.success) {
      console.error("Invalid response data:", responseData);
      throw new Error("Invalid response from server");
    }

    // Lấy mảng orders từ response
    const orderData = responseData.data;
    console.log("Order data array:", orderData);

    if (!Array.isArray(orderData)) {
      console.error("Order data is not an array:", orderData);
      throw new Error("Invalid data structure received from server");
    }

    // Xử lý và format dữ liệu trả về
    const formattedOrders = orderData
      .map((order, index) => {
        console.log(`Processing order ${index + 1}:`, order);

        if (!order) {
          console.warn(`Order at index ${index} is null or undefined`);
          return null;
        }

        try {
          const formattedOrder = {
            product_id: order.product_id,
            product_name: order.product_name || "Không có tên",
            image_url: order.image_url || "/placeholder.jpg",
            total_quantity_sold: parseInt(order.total_quantity_sold || 0),
            total_revenue: parseFloat(order.total_revenue || 0),
            latest_order_status: order.latest_order_status || "pending",
            latest_order_date:
              order.latest_order_date || new Date().toISOString(),
            color: order.color || "N/A",
            material: order.material || "N/A",
            price: parseFloat(order.price || 0),
            current_stock: parseInt(order.current_stock || 0),
            description: order.description || "Không có mô tả",
            product_status: order.product_status || "active",
            variant_id: order.variant_id,
            size: order.size || "N/A",
          };
          console.log(`Formatted order ${index + 1}:`, formattedOrder);
          return formattedOrder;
        } catch (err) {
          console.error(`Error processing order at index ${index}:`, err);
          return null;
        }
      })
      .filter((order) => order !== null);

    console.log("Final formatted orders:", formattedOrders);
    return formattedOrders;
  } catch (error) {
    console.error("Error in getShopOrderedProducts:", {
      error,
      message: error.message,
      response: error.response,
      request: error.request,
    });

    if (error.response) {
      // Log chi tiết response error
      console.error("Error response details:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
      });

      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        "Lỗi từ server";
      throw new Error(errorMessage);
    } else if (error.request) {
      console.error("Network error details:", error.request);
      throw new Error("Không thể kết nối đến server");
    } else {
      console.error("Other error details:", error);
      throw error;
    }
  }
};

export const getAllOrders = async (shopId) => {
  try {
    const response = await orderApi.getAllOrders();
    if (!response.data) {
      throw new Error("No data received from server");
    }
    console.log("Danh sách đơn hàng:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    if (error.response) {
      const errorMessage = error.response.data?.message || "Lỗi từ server";
      console.error("Server error details:", error.response.data);
      throw new Error(errorMessage);
    } else if (error.request) {
      console.error("Network error:", error.request);
      throw new Error("Không thể kết nối đến server");
    } else {
      console.error("Other error:", error);
      throw error;
    }
  }
};

export const getRevenue = async (userId) => {
  try {
    if (!userId) {
      throw new Error("userId is required");
    }

    const response = await axiosClient.get("/vendor/revenue");
    if (!response.data) {
      throw new Error("No data received from server");
    }
    console.log("Doanh thu:", response.data);
    return response.data.revenue || 0;
  } catch (error) {
    console.error("Lỗi khi lấy doanh thu:", error);
    if (error.response) {
      const errorMessage = error.response.data?.message || "Lỗi từ server";
      console.error("Server error details:", error.response.data);
      throw new Error(errorMessage);
    } else if (error.request) {
      console.error("Network error:", error.request);
      throw new Error("Không thể kết nối đến server");
    } else {
      console.error("Other error:", error);
      throw error;
    }
  }
};

export const getShopInfo = async () => {
  try {
    const response = await axiosClient.get("/vendor/my-shop");
    if (!response.data) {
      throw new Error("No data received from server");
    }
    console.log("Thông tin shop:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin shop:", error);
    if (error.response) {
      const errorMessage = error.response.data?.message || "Lỗi từ server";
      console.error("Server error details:", error.response.data);
      throw new Error(errorMessage);
    } else if (error.request) {
      console.error("Network error:", error.request);
      throw new Error("Không thể kết nối đến server");
    } else {
      console.error("Other error:", error);
      throw error;
    }
  }
};

export const getAllCategory = async () => {
  try {
    const response = await categoryApi.getCategories();
    if (!response.data) {
      throw new Error("Không nhận được dữ liệu từ server");
    }
    console.log("Danh sách danh mục:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục:", error);
    if (error.response) {
      const errorMessage = error.response.data?.message || "Lỗi từ server";
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error("Không thể kết nối đến server");
    } else {
      throw error;
    }
  }
};

export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    if (!orderId) {
      throw new Error("Order ID is required");
    }

    if (!newStatus) {
      throw new Error("New status is required");
    }

    console.log(`Updating order ${orderId} to status: ${newStatus}`);

    const response = await orderApi.updateOrderStatus(orderId, newStatus);
    console.log("Order status update response:", response);

    // Check if response exists
    if (!response) {
      throw new Error("No response received from server");
    }

    // Get response data
    const responseData = response.data;
    console.log("Response data structure:", {
      fullResponse: response,
      data: responseData,
    });

    // Check for success flag in response data
    if (responseData && responseData.success === false) {
      throw new Error(responseData.message || "Failed to update order status");
    }

    return responseData;
  } catch (error) {
    console.error("Error updating order status:", {
      error,
      message: error.message,
      orderId,
      newStatus,
    });

    if (error.response) {
      console.error("Server error details:", {
        status: error.response.status,
        data: error.response.data,
      });
      const errorMessage = error.response.data?.message || "Server error";
      throw new Error(errorMessage);
    } else if (error.request) {
      console.error("Network error:", error.request);
      throw new Error("Cannot connect to server");
    } else {
      console.error("Other error:", error);
      throw error;
    }
  }
};
