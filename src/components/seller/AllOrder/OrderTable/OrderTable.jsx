import React, { Component } from "react";
import OrderTableHeader from "./OrderTableHeader";
import OrderTableBody from "./OrderTableBody";
import EmptyState from "./EmptyState";
import { toast } from "react-toastify";
import {
  updateOrderStatus,
  processOrder,
} from "../../../../services/vendorService";
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
  handleProcessOrders = async (productId) => {
    try {
      if (!productId) {
        throw new Error("Product ID is required");
      }

      // Gọi API để xử lý đơn hàng
      await processOrder(productId);

      // Hiển thị thông báo thành công
      toast.success("Đơn hàng đã được xử lý thành công");

      // Cập nhật lại danh sách đơn hàng
      if (this.props.onOrderUpdated) {
        await this.props.onOrderUpdated();
      }
    } catch (error) {
      console.error("Error processing order:", error);
      toast.error(error.message || "Không thể xử lý đơn hàng");
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
    const {
      orders,
      onOrderUpdated,
      loading,
      error,
      showFilterPanel,
      showExportOptions,
    } = this.props;

    const { selectedOrders, filters, sortField, sortDirection } = this.state;

    // Get filtered and sorted orders
    const filteredOrders = this.getFilteredOrders(orders);

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <OrderTableHeader
          selectedCount={selectedOrders.length}
          totalCount={filteredOrders.length}
          onSelectAll={this.handleSelectAll}
          onSortChange={this.handleSortChange}
          sortField={sortField}
          sortDirection={sortDirection}
        />

        <OrderTableBody
          orders={filteredOrders}
          selectedOrders={selectedOrders}
          onSelectOrder={this.handleSelectOrder}
          onOrderAction={this.handleProcessOrders}
        />

        {filteredOrders.length === 0 && !loading && !error && (
          <EmptyState message="No orders found matching your criteria" />
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
