import axiosClient from "../api/axiosClient";
import categoryApi from "../api/VendorAPI/productApi";
import orderApi from "../api/VendorAPI/orderApi";

// Lấy danh sách đơn hàng của shop
export const getShopOrderedProducts = async (shopId) => {
  try {
    if (!shopId) {
      throw new Error("shopId is required");
    }

    const response = await orderApi.getAllOrders_list(shopId);

    // Kiểm tra response
    if (!response) {
      throw new Error("No response from server");
    }

    // Lấy dữ liệu từ response
    const responseData = response.data;

    if (!responseData || !responseData.success) {
      throw new Error("Invalid response from server");
    }

    // Lấy mảng orders từ response
    const orderData = responseData.data;

    if (!Array.isArray(orderData)) {
      throw new Error("Invalid data structure received from server");
    }

    // Xử lý và format dữ liệu trả về
    const formattedOrders = orderData
      .map((order, index) => {
        if (!order) {
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

          return formattedOrder;
        } catch (err) {
          return null;
        }
      })
      .filter((order) => order !== null);

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
      throw new Error("Không thể kết nối đến server");
    } else {
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

    return response.data;
  } catch (error) {
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

export const getRevenue = async (userId) => {
  try {
    if (!userId) {
      throw new Error("userId is required");
    }

    const response = await axiosClient.get("/vendor/revenue");
    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data.revenue || 0;
  } catch (error) {
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

export const getShopInfo = async () => {
  try {
    const response = await axiosClient.get("/vendor/my-shop");
    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  } catch (error) {
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

export const getAllCategory = async () => {
  try {
    const response = await categoryApi.getCategories();
    if (!response.data) {
      throw new Error("Không nhận được dữ liệu từ server");
    }

    return response.data;
  } catch (error) {
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

    const response = await orderApi.updateOrderStatus(orderId, newStatus);

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
      throw new Error("Cannot connect to server");
    } else {
      throw error;
    }
  }
};

// Xử lý đơn hàng (process suborder)
export const processOrder = async (productId) => {
  try {
    if (!productId) {
      throw new Error("Product ID is required");
    }

    const response = await orderApi.processOrder(productId);

    if (!response || !response.data) {
      throw new Error("No response received from server");
    }

    const responseData = response.data;

    // Kiểm tra kết quả từ server
    if (!responseData.success) {
      throw new Error(responseData.message || "Failed to process order");
    }

    console.log("Order processed successfully:", {
      productId,
      response: responseData,
    });

    return responseData;
  } catch (error) {
    console.error("Error processing order:", {
      error,
      message: error.message,
      productId,
    });

    if (error.response) {
      const errorMessage = error.response.data?.message || "Server error";
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error("Cannot connect to server");
    } else {
      throw error;
    }
  }
};

export const getOrderStats = async () => {
  try {
    const response = await orderApi.getOrderStats();

    if (!response.data || !response.data.data) {
      throw new Error("Không nhận được dữ liệu thống kê từ server");
    }

    const rawStats = response.data.data; // Lấy dữ liệu thống kê từ thuộc tính 'data'

    // Xử lý và format dữ liệu thống kê
    const formattedStats = {
      // Cập nhật để lấy từ rawStats
      totalOrders: rawStats.total_orders || 0,
      totalRevenue: parseFloat(rawStats.total_revenue || 0),
      averageOrderValue: parseFloat(rawStats.average_order_value || 0),
      // Xử lý mảng orderStats để tạo đối tượng ordersByStatus
      ordersByStatus: rawStats.orderStats?.reduce(
        (acc, stat) => {
          if (stat.status) {
            acc[stat.status.toLowerCase()] = stat.count;
          }
          return acc;
        },
        {
          // Đảm bảo có đủ các trạng thái với giá trị mặc định là 0
          pending: 0,
          processing: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0,
        }
      ),
      // rawStats.ordersByDate không có trong ảnh, giữ nguyên nếu có
      ordersByDate: rawStats.orders_by_date || [],
      // Xử lý topProducts (từ productStats trong ảnh?) - cần làm rõ cấu trúc backend
      // Dựa trên ảnh, productStats chỉ có totalProducts và averagePrice, không có top_products
      // Nếu backend có trả về top_products ở đâu đó, cần điều chỉnh.
      // Tạm thời lấy productStats nếu có, nhưng không dùng cho topProducts table
      productStatsSummary: rawStats.productStats || {
        totalProducts: 0,
        averagePrice: 0,
      },
      views: rawStats.views || 0,
      // Xử lý recentOrders (không có trong ảnh) - giữ nguyên nếu có
      recentOrders:
        rawStats.recent_orders?.map((order) => ({
          orderId: order.order_id,
          customerName: order.customer_name,
          totalAmount: parseFloat(order.total_amount || 0),
          status: order.status,
          orderDate: new Date(order.order_date),
        })) || [],
      // Nếu backend trả về top_products, điều chỉnh lại phần này
      topProducts:
        rawStats.top_products?.map((product) => ({
          productId: product.product_id,
          name: product.name,
          quantity: product.quantity,
          revenue: parseFloat(product.revenue || 0),
        })) || [],
    };

    return formattedStats;
  } catch (error) {
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
