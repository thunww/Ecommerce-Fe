import React, { Component } from "react";
import { updateOrderStatus } from "../../../../services/vendorService";
import { toast } from "react-toastify";

class OrderRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isStatusMenuOpen: false,
      isLoading: false,
      isActionMenuOpen: false,
    };
  }

  toggleStatusMenu = () => {
    // Only allow menu to open if the order is in pending status
    const { order } = this.props;
    if (order.latest_order_status !== "pending") {
      toast.info("You can only update orders with Pending status");
      return;
    }

    this.setState((prevState) => ({
      isStatusMenuOpen: !prevState.isStatusMenuOpen,
    }));
  };

  toggleActionMenu = () => {
    this.setState((prevState) => ({
      isActionMenuOpen: !prevState.isActionMenuOpen,
    }));
  };

  // Handle action outside of the menu to close it
  handleClickOutside = (e) => {
    if (this.actionMenuRef && !this.actionMenuRef.contains(e.target)) {
      this.setState({ isActionMenuOpen: false });
    }
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleStatusChange = async (newStatus) => {
    const { order, onOrderUpdated } = this.props;

    // Vendor can only change status from pending to processing
    if (order.latest_order_status !== "pending" || newStatus !== "processing") {
      toast.error("Vendors can only change orders from Pending to Processing");
      this.setState({ isStatusMenuOpen: false });
      return;
    }

    try {
      this.setState({ isLoading: true });

      // Use product_id instead of id which might not exist
      const orderId = order.id || order.product_id;

      console.log("Updating order status:", {
        orderId,
        newStatus,
        orderDetails: order,
      });

      // Call API to update order status
      await updateOrderStatus(orderId, newStatus);

      // Show success message
      toast.success(`Order status updated to Processing`);

      // Close the dropdown menu
      this.setState({ isStatusMenuOpen: false });

      // Refresh order list if callback provided
      if (onOrderUpdated) {
        onOrderUpdated();
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status. Please try again.");
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleViewDetails = () => {
    const { order } = this.props;
    this.setState({ isActionMenuOpen: false });

    // Use a modal to display order details
    // For demonstration, we'll use a toast
    toast.info(`Viewing details for order ${order.product_id}`);

    // In a real implementation, this would navigate to a details page or open a modal
    // window.location.href = `/seller/orders/details/${order.id || order.product_id}`;
  };

  handlePrintInvoice = () => {
    const { order } = this.props;
    this.setState({ isActionMenuOpen: false });

    // Generate and print invoice
    // For demonstration, we'll use a toast
    toast.info(`Printing invoice for order ${order.product_id}`);

    // In a real implementation, this would open a print-friendly page
  };

  handleAddNote = () => {
    const { order } = this.props;
    this.setState({ isActionMenuOpen: false });

    // Prompt user to add a note
    const note = prompt("Add note to this order:");
    if (note) {
      toast.success(`Note added to order ${order.product_id}`);
    }
  };

  handleProcess = async () => {
    const { order, onActionClick } = this.props;

    if (!order.product_id) {
      toast.error("Product ID is missing");
      return;
    }

    try {
      // Gọi hàm xử lý từ parent component
      await onActionClick(order.product_id);

      // Đóng menu action nếu đang mở
      this.setState({ isActionMenuOpen: false });
    } catch (error) {
      console.error("Error processing order:", error);
      toast.error(error.message || "Không thể xử lý đơn hàng");
    }
  };

  // Convert status to readable text
  getStatusText(status) {
    switch (status) {
      case "pending":
        return "Pending Confirmation";
      case "processing":
        return "Processing";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status || "Undefined";
    }
  }

  // Get color for status badge
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

  // Check if the order can be updated by vendor
  canUpdateOrder() {
    const { order } = this.props;
    return order.latest_order_status === "pending";
  }

  render() {
    const { order, selected, onSelect, onActionClick } = this.props;
    const { isStatusMenuOpen, isLoading, isActionMenuOpen } = this.state;
    const canUpdate = this.canUpdateOrder();

    return (
      <div
        className={`grid grid-cols-6 py-4 px-4 text-sm border-t first:border-t-0 border-x ${
          selected ? "bg-blue-50" : ""
        }`}
      >
        {/* Selection & Product Column */}
        <div className="flex items-center">
          <input
            type="checkbox"
            className="mr-2 h-4 w-4"
            checked={selected}
            onChange={() => onSelect(order.id || order.product_id)}
          />
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

        {/* Actions Column */}
        <div className="flex items-center justify-end relative">
          {/* Process Button */}
          <button
            onClick={this.handleProcess}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2"
            disabled={order.latest_order_status !== "pending"}
          >
            Process
          </button>

          {/* Action Menu Button */}
          <button
            onClick={this.toggleActionMenu}
            className="p-2 hover:bg-gray-100 rounded-full"
            ref={(ref) => (this.actionMenuRef = ref)}
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>

          {/* Action Menu Dropdown */}
          {isActionMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                <button
                  onClick={this.handleViewDetails}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  View Details
                </button>
                <button
                  onClick={this.handlePrintInvoice}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Print Invoice
                </button>
                <button
                  onClick={this.handleAddNote}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Add Note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default OrderRow;
