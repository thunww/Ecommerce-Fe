import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Search,
  Filter,
  Download,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import orderApi from "../../../api/VendorAPI/orderApi";
import debounce from "lodash/debounce";

// Helper function to format date to YYYY-MM-DD
const formatDateToYYYYMMDD = (date) => {
  if (!date) return undefined;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = ("0" + (d.getMonth() + 1)).slice(-2);
  const day = ("0" + d.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};

const SearchInput = ({ searchInput, setSearchInput, onSearch }) => {
  const inputRef = useRef(null);

  // Create debounced search function
  const debouncedSearch = useCallback(
    debounce((value) => {
      onSearch(value);
    }, 1000),
    [onSearch]
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch(searchInput);
    }
  };

  useEffect(() => {
    if (inputRef.current === document.activeElement) {
      inputRef.current.focus();
    }
  }, [searchInput]);

  return (
    <div className="relative flex">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          value={searchInput}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Search by order ID, product name"
          ref={inputRef}
          className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-700 placeholder-slate-400 shadow-sm transition-all duration-200 hover:border-slate-300"
        />
      </div>
    </div>
  );
};

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
    dotColor: "bg-amber-500",
    cardBorder: "border-amber-300",
    headerBg: "from-amber-100 to-amber-50",
  },
  processing: {
    label: "Processing",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Package,
    dotColor: "bg-blue-500",
    cardBorder: "border-blue-300",
    headerBg: "from-blue-100 to-blue-50",
  },
  shipped: {
    label: "Shipped",
    color: "bg-violet-50 text-violet-700 border-violet-200",
    icon: Truck,
    dotColor: "bg-violet-500",
    cardBorder: "border-violet-300",
    headerBg: "from-violet-100 to-violet-50",
  },
  delivered: {
    label: "Delivered",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
    dotColor: "bg-emerald-500",
    cardBorder: "border-emerald-300",
    headerBg: "from-emerald-100 to-emerald-50",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: AlertCircle,
    dotColor: "bg-red-500",
    cardBorder: "border-red-300",
    headerBg: "from-red-100 to-red-50",
  },
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [orderStats, setOrderStats] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 7,
    totalItems: 0,
    totalPages: 1,
  });
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const handleSearch = useCallback(
    async (value) => {
      const searchValue = value.trim();
      setLoading(true);

      try {
        const response = await orderApi.getOrders({
          page: pagination.currentPage,
          limit: pagination.limit,
          status: statusFilter !== "all" ? statusFilter : undefined,
          search: searchValue || undefined,
          startDate: startDate ? formatDateToYYYYMMDD(startDate) : undefined,
          endDate: endDate ? formatDateToYYYYMMDD(endDate) : undefined,
        });

        if (response.data.success) {
          const subordersData = response.data.data || [];

          // Update pagination based on API response
          setPagination({
            currentPage: response.data.currentPage || 1,
            limit: pagination.limit,
            totalItems: response.data.total || 0,
            totalPages: response.data.totalPages || 1,
          });

          setOrders(subordersData);
          setFilteredOrders(subordersData);
        } else {
          setError(response.data.message || "Error fetching orders");
        }
      } catch (err) {
        setError(err.message || "Server connection error");
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    },
    [pagination.currentPage, pagination.limit, statusFilter, startDate, endDate]
  );

  useEffect(() => {
    handleSearch(searchTerm);
  }, [
    pagination.currentPage,
    pagination.limit,
    statusFilter,
    startDate,
    endDate,
    searchTerm,
  ]);

  const debouncedSetSearchTerm = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 500),
    []
  );

  const handleSearchInputChange = (value) => {
    setSearchInput(value);
    debouncedSetSearchTerm(value);
  };

  const handleSelectOrder = (subOrderId) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(subOrderId)
        ? prevSelected.filter((id) => id !== subOrderId)
        : [...prevSelected, subOrderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((order) => order.sub_order_id));
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleUpdateStatus = async (status) => {
    if (selectedOrders.length === 0) {
      alert("Please select at least one order to update status.");
      return;
    }

    // Show confirmation dialog with detailed information
    const confirmed = window.confirm(
      `Are you sure you want to update the status of ${selectedOrders.length} selected order(s) to "Processing"?\n\n` +
        `The orders will be updated to the new status and cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      const result = await orderApi.updateSubordersStatusToProcessing(
        selectedOrders
      );

      if (result.success) {
        // Show success message
        alert(
          `Successfully updated ${result.affectedCount} order(s) to "Processing".`
        );

        // Refresh order list
        handleSearch(searchTerm);

        // Reset selected orders
        setSelectedOrders([]);
      } else {
        // Show server error message
        alert(
          result.message || "Failed to update status. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating status. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedOrders.length === 0) {
      alert("Please select at least one order to delete.");
      return;
    }

    // Show confirmation dialog with detailed information
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedOrders.length} selected order(s)?\n\n` +
        `The orders will be permanently deleted and cannot be recovered.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      const result = await orderApi.deleteSuborders(selectedOrders);

      if (result.success) {
        // Show success message
        alert(`Successfully deleted ${result.deletedCount} order(s).`);

        // Refresh order list
        handleSearch(searchTerm);

        // Reset selected orders
        setSelectedOrders([]);
      } else {
        // Show server error message
        alert(result.message || "Failed to delete orders. Please try again later.");
      }
    } catch (error) {
      console.error("Error deleting orders:", error);
      alert("An error occurred while deleting orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      // Get current filter values explicitly
      const currentStatusFilter = statusFilter;
      const currentStartDate = startDate;
      const currentEndDate = endDate;
      const currentSearchTerm = searchTerm;

      // Create URLSearchParams with current filter parameters (only add if valid)
      const params = new URLSearchParams();
      if (currentStatusFilter && currentStatusFilter !== "all") {
        params.append("status", currentStatusFilter);
      }
      if (currentStartDate) {
        params.append("startDate", formatDateToYYYYMMDD(currentStartDate));
      }
      if (currentEndDate) {
        params.append("endDate", formatDateToYYYYMMDD(currentEndDate));
      }
      if (currentSearchTerm) {
        params.append("search", currentSearchTerm);
      }

      const queryString = params.toString();
      const exportUrl = `/vendor/orders/export${queryString ? `?${queryString}` : ""}`;

      console.log("Exporting data with filters:", {
        statusFilter: currentStatusFilter,
        startDate: currentStartDate,
        endDate: currentEndDate,
        searchTerm: currentSearchTerm,
      });
      console.log("Generated query string:", queryString);
      console.log("Calling export API with URL:", exportUrl);

      // Call export API
      const response = await orderApi.exportOrders(queryString);

      // Get Blob data from response
      const responseBlob = response.data;

      // Use FileReader to read text content from Blob
      const reader = new FileReader();

      reader.onload = () => {
        const rawCsvData = reader.result; // CSV content as text

        // Add Byte Order Mark (BOM) for UTF-8 to ensure Excel recognizes encoding
        const BOM = "\ufeff";
        // Concatenate BOM with raw CSV data
        const csvWithBOM = BOM + rawCsvData;

        // Create blob from CSV data with BOM
        const blob = new Blob([csvWithBOM], {
          type: "text/csv;charset=utf-8;",
        });

        // Create URL for downloading file
        const url = window.URL.createObjectURL(blob);

        // Create anchor element for downloading
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `orders_${new Date().toISOString().split("T")[0]}.csv`
        );

        // Append to DOM and trigger click
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      };

      // Start reading Blob as Text
      reader.readAsText(responseBlob);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("An error occurred while exporting data. Please try again later.");
    }
  };

  const formatPrice = (price) => {
    if (price == null) return "0";
    return parseFloat(price).toLocaleString("vi-VN");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateItemPrice = (price, discount, quantity) => {
    const basePrice = parseFloat(price) || 0;
    const discountPercent = parseFloat(discount) || 0;
    const discountedPrice = basePrice * (1 - discountPercent / 100);
    return discountedPrice * (quantity || 1);
  };

  const calculateTotalPrice = (orderItems) => {
    return orderItems.reduce((total, item) => {
      return (
        total +
        calculateItemPrice(
          item.variant_price,
          item.product_discount,
          item.quantity
        )
      );
    }, 0);
  };

  const StatusBadge = ({ status }) => {
    const config = statusConfig[status] || {
      label: "Unknown",
      color: "bg-slate-50 text-slate-700 border-slate-200",
      icon: null,
      dotColor: "bg-slate-400",
      cardBorder: "border-slate-300",
      headerBg: "from-slate-100 to-slate-50",
    };
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${config.color} shadow-sm transition-all duration-200 hover:shadow-md`}
      >
        <span
          className={`w-2.5 h-2.5 rounded-full ${config.dotColor} mr-2`}
        ></span>
        {Icon && <Icon className="w-4 h-4 mr-1" />}
        {config.label}
      </span>
    );
  };

  const OrderCard = ({ order, index }) => {
    const config = statusConfig[order.status] || {
      cardBorder: "border-slate-300",
      headerBg: "from-slate-100 to-slate-50",
    };

    // Function to navigate with product data
    const navigateToOrderDetail = (productIds, variantIds) => {
      const queryParams = new URLSearchParams();
      if (productIds && productIds.length > 0) {
        queryParams.append("productIds", productIds.join(","));
      }
      if (variantIds && variantIds.length > 0) {
        queryParams.append("variantIds", variantIds.join(","));
      }
      const queryString = queryParams.toString();
      navigate(`/vendor/orders/detailOrder?${queryString}`);
    };

    // Handle click on "View Order Details" button
    const handleViewOrderDetail = () => {
      const productIds = order.orderItems
        ? order.orderItems
            .map((item) => item.product_id)
            .filter((id) => id != null)
        : [];
      const variantIds = order.orderItems
        ? order.orderItems
            .map((item) => item.variant_id)
            .filter((id) => id != null)
        : [];
      navigateToOrderDetail(productIds, variantIds);
    };

    const totalPrice = calculateTotalPrice(order.orderItems || []);

    return (
      <div
        className={`bg-white shadow-lg rounded-2xl mb-8 overflow-hidden border-2 ${config.cardBorder} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
      >
        {/* SubOrder Header */}
        <div
          className={`px-8 py-6 flex justify-between items-center bg-gradient-to-r ${config.headerBg} border-b ${config.cardBorder}`}
        >
          <div className="flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-6 w-6 text-indigo-600 rounded border-slate-300 mr-6 focus:ring-indigo-500 focus:ring-2"
              checked={selectedOrders.includes(order.sub_order_id)}
              onChange={() => handleSelectOrder(order.sub_order_id)}
            />
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-1">
                SubOrder #{order.sub_order_id}
              </h3>
              <p className="text-sm text-slate-600 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Order Date: {formatDate(order.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <StatusBadge status={order.status} />
            {selectedOrders.includes(order.sub_order_id) && (
              <button
                onClick={() => handleSelectOrder(order.sub_order_id)}
                className="text-red-600 hover:text-red-700 transition-colors"
              >
                <AlertCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* SubOrder Details */}
        <div className="p-8 bg-white">
          {/* Recipient and Address Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <User className="mr-2 w-5 h-5 text-indigo-600" />
                Recipient Information
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-600 font-medium">Recipient Name</p>
                  <p className="text-slate-900 font-semibold">
                    {order.recipient_name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 font-medium flex items-center">
                    <Phone className="mr-1 w-4 h-4" />
                    Recipient Phone
                  </p>
                  <p className="text-slate-900">
                    {order.address_phone || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 font-medium flex items-center">
                    <User className="mr-1 w-4 h-4" />
                    Customer Name
                  </p>
                  <p className="text-slate-900">{order.username || "N/A"}</p>
                </div>
                <div>
                  <p className="text-slate-600 font-medium flex items-center">
                    <Phone className="mr-1 w-4 h-4" />
                    Customer Phone
                  </p>
                  <p className="text-slate-900">{order.user_phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-slate-600 font-medium flex items-center">
                    <Mail className="mr-1 w-4 h-4" />
                    Customer Email
                  </p>
                  <p className="text-slate-900">{order.user_email || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <MapPin className="mr-2 w-5 h-5 text-indigo-600" />
                Address & Payment
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-600 font-medium">
                    Shipping Address
                  </p>
                  <p className="text-slate-900">
                    {order.address_line ? `${order.address_line}, ` : ""}
                    {order.ward ? `${order.ward}, ` : ""}
                    {order.district ? `${order.district}, ` : ""}
                    {order.city || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 font-medium flex items-center">
                    <DollarSign className="mr-1 w-4 h-4" />
                    Payment Method
                  </p>
                  <p className="text-slate-900 capitalize">
                    {order.payment_method
                      ? order.payment_method.replace(/_/g, " ")
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {order.note && (
              <div className="lg:col-span-2 bg-amber-100 p-6 rounded-xl border border-amber-300 shadow-sm">
                <h4 className="text-lg font-semibold text-amber-900 mb-2 flex items-center">
                  <AlertCircle className="mr-2 w-5 h-5" />
                  Special Note
                </h4>
                <p className="text-amber-800 italic">"{order.note}"</p>
              </div>
            )}
          </div>

          {/* Order Items List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-100 to-indigo-50 border-b border-slate-200">
              <h4 className="text-lg font-bold text-slate-800 flex items-center">
                <Package className="mr-2 w-5 h-5 text-indigo-600" />
                Items in Order
              </h4>
            </div>

            <div className="p-6">
              {order.orderItems && order.orderItems.length > 0 ? (
                <div className="space-y-4">
                  {order.orderItems.map((item, index) => (
                    <div
                      key={item.order_item_id}
                      className={`flex items-center p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all duration-200 ${
                        index !== order.orderItems.length - 1 ? "mb-4" : ""
                      }`}
                    >
                      <div className="flex-shrink-0 mr-6">
                        <img
                          src={item.variant_image || "/placeholder-image.jpg"}
                          alt={item.product_name}
                          className="w-20 h-20 object-cover rounded-lg shadow-sm border border-slate-200"
                          loading="lazy"
                        />
                      </div>

                      <div className="flex-grow">
                        <h5 className="font-semibold text-slate-800 text-lg mb-2">
                          {item.product_name || "N/A"}
                        </h5>

                        <div className="space-y-1 mb-3">
                          {(item.variant_size || item.variant_color) && (
                            <p className="text-sm text-slate-600 bg-slate-200 px-3 py-1 rounded-full inline-block">
                              {item.variant_size || ""}
                              {item.variant_size && item.variant_color
                                ? " • "
                                : ""}
                              {item.variant_color || ""}
                            </p>
                          )}
                          {item.product_discount && (
                            <p className="text-sm text-red-600 font-medium">
                              Discount: {item.product_discount}%
                            </p>
                          )}
                        </div>

                        <div className="flex items-center space-x-4 text-sm">
                          <p className="text-slate-600">
                            Quantity:{" "}
                            <span className="font-semibold text-slate-800">
                              {item.quantity || 1}
                            </span>
                          </p>
                          <div>
                            <p className="text-lg font-bold text-indigo-600">
                              {formatPrice(
                                calculateItemPrice(
                                  item.variant_price,
                                  item.product_discount,
                                  item.quantity
                                )
                              )}{" "}
                              $
                            </p>
                            {item.product_discount && (
                              <p className="text-sm text-slate-500 line-through">
                                {formatPrice(
                                  (parseFloat(item.variant_price) || 0) *
                                    (item.quantity || 1)
                                )}{" "}
                                $
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg">
                    No items in this order
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Total Price and Shipping Fee */}
          <div className="mt-8 bg-gradient-to-r from-emerald-100 to-emerald-50 p-6 rounded-xl border border-emerald-300 shadow-sm">
            <div className="flex justify-between items-center text-lg">
              <div className="space-y-2">
                <p className="text-slate-700">
                  Total Item Price:{" "}
                  <span className="font-bold text-slate-800">
                    {formatPrice(totalPrice)} $
                  </span>
                </p>
                <p className="text-slate-700">
                  Shipping Fee:{" "}
                  <span className="font-bold text-slate-800">
                    {formatPrice(order.shipping_fee)} $
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-700">
                  {formatPrice(
                    totalPrice + (parseFloat(order.shipping_fee) || 0)
                  )}{" "}
                  $
                </p>
                <p className="text-sm text-emerald-600">Total Payment</p>
              </div>
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={handleViewOrderDetail}
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <Eye className="mr-2 w-5 h-5" /> View Order Details
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center bg-red-50 p-8 rounded-2xl border border-red-200 shadow-lg">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-700 text-lg font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-6 py-12">
        {/* Header with Overview Information */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Order Management
              </h1>
              <p className="text-slate-600 text-lg">
                Track and manage all your orders
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-2xl shadow-lg p-4 border border-slate-200">
                <div className="text-2xl font-bold text-slate-900">
                  {filteredOrders.length}
                </div>
                <div className="text-slate-600">Current Orders</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-4 border border-slate-200">
                <div className="text-2xl font-bold text-blue-600">
                  {selectedOrders.length}
                </div>
                <div className="text-slate-600">Selected</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Section */}
        <div className="bg-white shadow-xl rounded-2xl p-8 mb-12 border border-slate-200">
          <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-6">
            <div className="w-full lg:flex-1">
              <SearchInput
                searchInput={searchInput}
                setSearchInput={handleSearchInputChange}
                onSearch={setSearchTerm}
              />
            </div>

            <div className="relative w-full lg:w-auto min-w-[200px]">
              <select
                className="block appearance-none w-full bg-white border border-slate-200 text-slate-700 py-3.5 px-4 pr-10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:border-slate-300 transition-all duration-200"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                {Object.keys(statusConfig).map((statusKey) => (
                  <option key={statusKey} value={statusKey}>
                    {statusConfig[statusKey].label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-600">
                <ChevronDown className="h-5 w-5" />
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full lg:w-auto">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="From Date"
                dateFormat="MM/dd/yyyy"
                className="w-full border border-slate-200 rounded-xl py-3.5 px-4 text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:border-slate-300 transition-all duration-200"
              />
              <span className="text-slate-400 font-medium">to</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="To Date"
                dateFormat="MM/dd/yyyy"
                className="w-full border border-slate-200 rounded-xl py-3.5 px-4 text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:border-slate-300 transition-all duration-200"
              />
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSelectAll}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-7
                  00 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  <CheckCircle className="mr-2 w-5 h-5" />
                  {selectedOrders.length === filteredOrders.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
                <div className="text-slate-600">
                  {selectedOrders.length > 0 && (
                    <span className="font-medium">{selectedOrders.length}</span>
                  )}{" "}
                  order(s) selected
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleUpdateStatus("processing")}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={selectedOrders.length === 0}
                >
                  <CheckCircle className="mr-2 w-5 h-5" />
                  Process Selected Orders
                </button>
                <button
                  onClick={handleDeleteSelected}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                  disabled={selectedOrders.length === 0}
                >
                  <AlertCircle className="mr-2 w-5 h-5" /> Delete Selected Orders
                </button>
                <button
                  onClick={handleExportData}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  <Download className="mr-2 w-5 h-5" /> Export Data (.csv)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Order List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-8">
            {filteredOrders.map((order, index) => (
              <OrderCard key={order.sub_order_id} order={order} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white shadow-xl rounded-2xl border border-slate-200">
            <Search className="w-16 h-16 text-slate-400 mx-auto mb-6" />
            <p className="text-slate-600 text-xl font-medium">
              No orders found matching your search criteria.
            </p>
          </div>
        )}

        {/* Pagination with Quantity Information */}
        {filteredOrders.length > 0 && pagination.totalPages > 1 && (
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="text-slate-600">
                Showing{" "}
                <span className="font-medium">{filteredOrders.length}</span> orders
                out of <span className="font-medium">{pagination.totalItems}</span> total
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage <= 1 || loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
                >
                  Previous
                </button>
                <span className="text-slate-800 text-lg font-semibold">
                  Page {pagination.currentPage} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={
                    pagination.currentPage >= pagination.totalPages || loading
                  }
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;