import React, { Component } from "react";

class OrderRow extends Component {
  // Chuyển đổi trạng thái sang tiếng Anh
  getStatusText(status) {
    switch (status) {
      case "pending":
        return "Pending Confirmation";
      case "processing":
        return "Waiting for Pickup";
      case "shipped":
        return "In Transit";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status || "Undefined";
    }
  }

  // Lấy màu cho trạng thái
  getStatusColor(status) {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "processing":
        return "bg-blue-100 text-blue-600";
      case "shipped":
        return "bg-purple-100 text-purple-600";
      case "delivered":
        return "bg-green-100 text-green-600";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  render() {
    const { order } = this.props;
    console.log("Order data in row:", order); // Debug log

    return (
      <div className="grid grid-cols-5 py-4 px-4 text-sm border-t first:border-t-0">
        {/* Product Column */}
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gray-100 rounded mr-2">
            <img
              src={order.image_url || "placeholder.jpg"}
              alt={order.product_name}
              className="w-full h-full object-cover rounded"
            />
          </div>
          <div>
            <div className="font-medium">{order.product_name}</div>
            <div className="text-gray-500 text-xs">
              Product ID: {order.product_id}
            </div>
          </div>
        </div>

        {/* Total Column */}
        <div className="flex items-center">
          <div>
            <div className="font-medium">
              Quantity: {order.total_quantity_sold || 0}
            </div>
            <div className="text-gray-500 text-xs">
              Revenue: {(order.total_revenue || 0).toLocaleString("en-US")}$
            </div>
          </div>
        </div>

        {/* Status Column */}
        <div className="flex items-center">
          <span
            className={`px-2 py-1 rounded-full text-xs ${this.getStatusColor(
              order.latest_order_status
            )}`}
          >
            {this.getStatusText(order.latest_order_status)}
          </span>
        </div>

        {/* Color & Material Column */}
        <div className="flex items-center">
          <div className="flex flex-col">
            <span className="font-medium">{order.color || "N/A"}</span>
            <span className="text-gray-500 text-xs">
              {order.material ? `Material: ${order.material}` : ""}
            </span>
          </div>
        </div>

        {/* Price Column */}
        <div className="flex items-center">
          <div className="font-medium">
            {(order.price || 0).toLocaleString("en-US")}$
          </div>
        </div>
      </div>
    );
  }
}

export default OrderRow;
