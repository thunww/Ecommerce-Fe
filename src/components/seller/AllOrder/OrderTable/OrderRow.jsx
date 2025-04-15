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
        <div className="flex items-center justify-center relative">
          <button
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={this.toggleActionMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>

          {/* Action Menu */}
          {isActionMenuOpen && (
            <div
              ref={(ref) => (this.actionMenuRef = ref)}
              className="absolute right-0 top-full mt-1 bg-white border rounded shadow-lg z-10 w-48"
            >
              <div className="py-1">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={this.handleViewDetails}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  View Details
                </button>

                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={this.handlePrintInvoice}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Print Invoice
                </button>

                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={this.handleAddNote}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                      clipRule="evenodd"
                    />
                  </svg>
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
