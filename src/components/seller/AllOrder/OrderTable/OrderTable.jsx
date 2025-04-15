import React, { Component } from "react";
import OrderTableHeader from "./OrderTableHeader";
import OrderTableBody from "./OrderTableBody";
import EmptyState from "./EmptyState";
import { toast } from "react-toastify";
import { updateOrderStatus } from "../../../../services/vendorService";
import { format } from "date-fns";

class OrderTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOrders: [],
      showActionMenu: false,
      currentOrderForAction: null,
      filters: {
        status: "all",
        searchTerm: "",
        dateRange: "all",
      },
      sortField: "latest_order_date",
      sortDirection: "desc",
      showFilterPanel: false,
      showExportOptions: false,
    };
  }

  // Toggle filter panel
  toggleFilterPanel = () => {
    this.setState((prevState) => ({
      showFilterPanel: !prevState.showFilterPanel,
    }));
  };

  // Handle filter changes
  handleFilterChange = (filterName, value) => {
    this.setState((prevState) => ({
      filters: {
        ...prevState.filters,
        [filterName]: value,
      },
    }));
  };

  // Handle sort changes
  handleSortChange = (field) => {
    this.setState((prevState) => {
      // If clicking the same field, toggle direction
      if (prevState.sortField === field) {
        return {
          sortDirection: prevState.sortDirection === "asc" ? "desc" : "asc",
        };
      }
      // Otherwise, sort by the new field in ascending order
      return {
        sortField: field,
        sortDirection: "asc",
      };
    });
  };

  // Export orders to CSV
  getCSVData = () => {
    const { orders } = this.props;

    // Filter orders first
    const filteredOrders = this.getFilteredOrders(orders);

    if (filteredOrders.length === 0) {
      toast.warning("No orders to export");
      return [];
    }

    // Return formatted data for CSV
    return filteredOrders.map((order) => ({
      "Product ID": order.product_id,
      "Product Name": order.product_name,
      Status: this.getStatusText(order.latest_order_status),
      Quantity: order.total_quantity_sold || 0,
      Revenue: (order.total_revenue || 0).toLocaleString("en-US"),
      Price: (order.price || 0).toLocaleString("en-US"),
      Color: order.color || "N/A",
      Material: order.material || "N/A",
      "Created At": order.created_at
        ? format(new Date(order.created_at), "yyyy-MM-dd HH:mm:ss")
        : "N/A",
    }));
  };

  // Toggle selection for a single order
  handleSelectOrder = (orderId) => {
    this.setState((prevState) => {
      if (prevState.selectedOrders.includes(orderId)) {
        return {
          selectedOrders: prevState.selectedOrders.filter(
            (id) => id !== orderId
          ),
        };
      } else {
        return { selectedOrders: [...prevState.selectedOrders, orderId] };
      }
    });
  };

  // Toggle selection for all orders
  handleSelectAll = () => {
    const { orders } = this.props;
    const filteredOrders = this.getFilteredOrders(orders);

    if (this.state.selectedOrders.length === filteredOrders.length) {
      // If all orders are currently selected, deselect all
      this.setState({ selectedOrders: [] });
    } else {
      // Otherwise, select all filtered orders
      const allOrderIds = filteredOrders.map(
        (order) => order.id || order.product_id || order.variant_id
      );
      this.setState({ selectedOrders: allOrderIds });
    }
  };

  // Filter orders based on current filters
  getFilteredOrders = (orders) => {
    const { filters, sortField, sortDirection } = this.state;

    // Filter by status
    let filteredOrders = orders;
    if (filters.status !== "all") {
      filteredOrders = filteredOrders.filter(
        (order) => order.latest_order_status === filters.status
      );
    }

    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.product_name?.toLowerCase().includes(term) ||
          order.product_id?.toString().includes(term) ||
          order.color?.toLowerCase().includes(term)
      );
    }

    // Filter by date range
    if (filters.dateRange !== "all") {
      const now = new Date();
      let startDate;

      switch (filters.dateRange) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "week":
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "month":
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        filteredOrders = filteredOrders.filter((order) => {
          const orderDate = new Date(order.latest_order_date);
          return orderDate >= startDate;
        });
      }
    }

    // Sort orders
    filteredOrders.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle special cases for nested properties or non-string/number values
      if (sortField === "latest_order_date") {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      } else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      } else if (aValue === undefined || aValue === null) {
        aValue = 0;
        bValue = bValue || 0;
      } else if (bValue === undefined || bValue === null) {
        bValue = 0;
        aValue = aValue || 0;
      }

      // Compare values based on sort direction
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return filteredOrders;
  };

  // Handle showing action menu for individual order
  handleOrderAction = (order) => {
    this.setState({
      currentOrderForAction: order,
      showActionMenu: true,
    });
    // In a real implementation, you'd show a menu or modal here
    console.log("Action clicked for order:", order);

    // For demonstration, show a toast
    toast.info(`Actions menu for ${order.product_name}`);
  };

  // Process selected orders
  handleProcessOrders = async () => {
    const { orders, onOrderUpdated } = this.props;
    const { selectedOrders } = this.state;

    if (selectedOrders.length === 0) {
      toast.warning("No orders selected");
      return;
    }

    try {
      // Filter to get only pending orders
      const pendingOrders = orders.filter(
        (order) =>
          order.latest_order_status === "pending" &&
          selectedOrders.includes(
            order.id || order.product_id || order.variant_id
          )
      );

      if (pendingOrders.length === 0) {
        toast.warning("No pending orders selected");
        return;
      }

      // For each pending order, update status to "processing"
      const updatePromises = pendingOrders.map((order) =>
        updateOrderStatus(
          order.id || order.product_id || order.variant_id,
          "processing"
        )
      );

      await Promise.all(updatePromises);

      toast.success(`${pendingOrders.length} orders updated to Processing`);

      // Reset selected orders
      this.setState({ selectedOrders: [] });

      // Refresh the order list
      if (onOrderUpdated) {
        onOrderUpdated();
      }
    } catch (error) {
      console.error("Error processing orders:", error);
      toast.error("Failed to update order status");
    }
  };

  // Process batch action for selected orders
  handleBatchAction = (action) => {
    const { selectedOrders } = this.state;

    if (selectedOrders.length === 0) {
      toast.warning("Please select at least one order");
      return;
    }

    // Handle different batch actions
    switch (action) {
      case "process":
        this.processSelectedOrders();
        break;
      case "print":
        this.printSelectedOrders();
        break;
      case "export":
        this.showExportOptions();
        break;
      default:
        toast.info(`Action ${action} not implemented yet`);
    }
  };

  // Process selected orders
  processSelectedOrders = () => {
    const { onBatchProcess } = this.props;
    const { selectedOrders } = this.state;

    if (onBatchProcess) {
      onBatchProcess(selectedOrders);
    } else {
      toast.info(`Processing ${selectedOrders.length} orders`);
    }
  };

  // Print selected orders
  printSelectedOrders = () => {
    const { selectedOrders } = this.state;
    toast.info(`Printing ${selectedOrders.length} orders`);
    // Implement actual print functionality here
  };

  // Show export options
  showExportOptions = () => {
    this.setState({ showExportOptions: true });
  };

  // Export orders to CSV
  exportToCSV = () => {
    const data = this.getCSVData();
    if (data.length === 0) {
      toast.warning("Không có đơn hàng để xuất");
      return;
    }

    // Tạo các header cho CSV
    const headers = Object.keys(data[0]);

    // Tạo nội dung CSV
    const csvRows = [];
    csvRows.push(headers.join(","));

    // Thêm dữ liệu vào rows
    for (const row of data) {
      const values = headers.map((header) => {
        const value = row[header];
        // Thêm dấu ngoặc kép cho các giá trị chuỗi để xử lý dấu phẩy
        return `"${value}"`;
      });
      csvRows.push(values.join(","));
    }

    // Tạo blob và tải xuống
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `orders_export_${new Date().toISOString()}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Đơn hàng đã được xuất ra tệp CSV");
    this.hideExportOptions();
  };

  // Hide export options
  hideExportOptions = () => {
    this.setState({ showExportOptions: false });
  };

  render() {
    const { orders, onOrderUpdated } = this.props;
    const { selectedOrders, filters, showFilterPanel, showExportOptions } =
      this.state;

    const filteredOrders = this.getFilteredOrders(orders);

    return (
      <div className="mt-4">
        {/* Filter Panel */}
        <div className="mb-4 bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Orders Management</h3>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200 flex items-center"
                onClick={this.toggleFilterPanel}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clipRule="evenodd"
                  />
                </svg>
                Filter
              </button>
              <button
                className="px-3 py-1 bg-green-50 text-green-600 rounded text-sm hover:bg-green-100 flex items-center"
                onClick={() => this.handleBatchAction("export")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    clipRule="evenodd"
                  />
                </svg>
                Export
              </button>
            </div>
          </div>

          {/* Expandable Filter Controls */}
          {showFilterPanel && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 pt-3 border-t">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full border rounded py-1.5 px-3 text-sm"
                  value={filters.status}
                  onChange={(e) =>
                    this.handleFilterChange("status", e.target.value)
                  }
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending Confirmation</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Search Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search by product, ID, color..."
                  className="w-full border rounded py-1.5 px-3 text-sm"
                  value={filters.searchTerm}
                  onChange={(e) =>
                    this.handleFilterChange("searchTerm", e.target.value)
                  }
                />
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <select
                  className="w-full border rounded py-1.5 px-3 text-sm"
                  value={filters.dateRange}
                  onChange={(e) =>
                    this.handleFilterChange("dateRange", e.target.value)
                  }
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="text-sm text-gray-500 mb-2">
          Showing {filteredOrders.length}{" "}
          {filteredOrders.length === 1 ? "order" : "orders"}
          {filters.status !== "all" && ` with status: ${filters.status}`}
          {filters.searchTerm && ` matching: "${filters.searchTerm}"`}
        </div>

        <OrderTableHeader
          onSelectAll={this.handleSelectAll}
          allSelected={
            filteredOrders.length > 0 &&
            selectedOrders.length === filteredOrders.length
          }
          hasSelectedItems={selectedOrders.length > 0}
          onProcessOrders={this.handleProcessOrders}
        />

        {filteredOrders && filteredOrders.length > 0 ? (
          <OrderTableBody
            orders={filteredOrders}
            selectedOrders={selectedOrders}
            onSelectOrder={this.handleSelectOrder}
            onOrderAction={this.handleOrderAction}
            onOrderUpdated={onOrderUpdated}
          />
        ) : (
          <div className="border rounded-b-lg p-8 text-center text-gray-500">
            No orders match your filters. Try adjusting your search criteria.
          </div>
        )}

        {/* Export Options */}
        {showExportOptions && (
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium">Export Options</h3>
                <p className="text-xs text-gray-500">
                  {selectedOrders.length > 0
                    ? `Exporting ${selectedOrders.length} selected orders`
                    : `Exporting all ${filteredOrders.length} filtered orders`}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-200"
                  onClick={this.hideExportOptions}
                >
                  Cancel
                </button>

                <button
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={this.exportToCSV}
                >
                  Export to CSV
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Get status text from status code
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
}

export default OrderTable;
