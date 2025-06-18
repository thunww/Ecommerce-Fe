import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllShops, assignStatusToShop } from "../../redux/shopSlice";
import { assignRoleToUser } from "../../redux/adminSlice";
import {
  FaSearch,
  FaUserCheck,
  FaUsers,
  FaUserClock,
  FaStore,
  FaCheckCircle,
  FaChevronDown,
  FaFilter,
} from "react-icons/fa";
import Table from "../../components/common/Table";
import Swal from "sweetalert2";

const ManageShops = () => {
  const dispatch = useDispatch();
  const { shops = [], loading, error } = useSelector((state) => state.shops);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllShops());
  }, [dispatch]);

  const filteredShops =
    shops?.filter((shop) => {
      const matchesSearch = shop.shop_name
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || shop.status === statusFilter;
      return matchesSearch && matchesStatus;
    }) ?? [];

  // Status options for dropdown
  const statusOptions = [
    { value: "all", label: "All Shops", color: "gray", count: shops.length },
    {
      value: "active",
      label: "Active",
      color: "green",
      count: shops.filter((s) => s.status === "active").length,
    },
    {
      value: "inactive",
      label: "Inactive",
      color: "red",
      count: shops.filter((s) => s.status === "inactive").length,
    },
    {
      value: "suspended",
      label: "Suspended",
      color: "yellow",
      count: shops.filter((s) => s.status === "suspended").length,
    },
    {
      value: "pending",
      label: "Pending",
      color: "blue",
      count: shops.filter((s) => s.status === "pending").length,
    },
  ];

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      case "suspended":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pending":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCurrentStatusLabel = () => {
    const current = statusOptions.find(
      (option) => option.value === statusFilter
    );
    return current ? current.label : "All Shops";
  };

  const handleAssignStatusToShop = (shop) => {
    Swal.fire({
      title: "Assign Shop Status",
      html: `
        <div class="mb-3">
          <p class="text-gray-700 mb-2">Select the status for this shop:</p>
          <div class="flex flex-col gap-2">
            <label class="inline-flex items-center">
              <input type="radio" name="status" value="active" class="form-radio h-5 w-5 text-green-600" checked>
              <span class="ml-2 text-gray-700">Active</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" name="status" value="inactive" class="form-radio h-5 w-5 text-red-600">
              <span class="ml-2 text-gray-700">Inactive</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" name="status" value="suspended" class="form-radio h-5 w-5 text-yellow-600">
              <span class="ml-2 text-gray-700">Suspended</span>
            </label>
          </div>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm Status",
      cancelButtonText: "Cancel",
      background: "#fff",
      borderRadius: "10px",
      focusConfirm: false,
      preConfirm: () => {
        const selectedStatus = document.querySelector(
          'input[name="status"]:checked'
        )?.value;
        return { status: selectedStatus };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedStatus = result.value.status;

        dispatch(
          assignStatusToShop({ shopId: shop.shop_id, status: selectedStatus })
        )
          .unwrap()
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Status Updated!",
              text: `Shop status has been updated to ${selectedStatus.toUpperCase()}.`,
              confirmButtonColor: "#3085d6",
              timer: 2000,
              timerProgressBar: true,
            });

            // Bước 2: Nếu trạng thái là ACTIVE, cấp role cho chủ shop
            if (selectedStatus === "active") {
              dispatch(assignRoleToUser({ userId: shop.owner_id, roleId: 4 }))
                .unwrap()
                .then(() => {
                  Swal.fire({
                    icon: "success",
                    title: "Role Assigned!",
                    text: `User ${shop.username} has been granted the VENDOR role.`,
                    confirmButtonColor: "#3085d6",
                    timer: 2000,
                    timerProgressBar: true,
                  });
                })
                .catch((error) => {
                  Swal.fire({
                    icon: "error",
                    title: "Role Assignment Failed!",
                    text: error || "Failed to assign role.",
                    confirmButtonColor: "#d33",
                  });
                });
            }
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Update Failed!",
              text: error || "Failed to update shop status.",
              confirmButtonColor: "#d33",
            });
          });
      }
    });
  };

  if (loading) {
    return <p className="text-blue-500 text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  const columns = [
    { header: "ID", field: "shop_id" },
    {
      header: "Shop logo",
      field: "logo",
      render: (logo) => (
        <div className="flex justify-center">
          <img
            src={
              "https://static.vecteezy.com/system/resources/previews/007/410/289/original/online-shop-logo-design-vector.jpg" ||
              logo
            }
            alt="Logo"
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-md"
          />
        </div>
      ),
    },
    { header: "Shop Name", field: "shop_name" },
    {
      header: "Owner",
      field: "User",
      render: (shop) => {
        return shop?.username || "Unknown";
      },
    },
    { header: "Description", field: "description" },
    { header: "Total products", field: "total_products" },
    { header: "Followers", field: "followers" },
    {
      header: "Status",
      field: "status",
      render: (_, shop) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(
            shop.status
          )}`}
        >
          {shop.status || "Unknown"}
        </span>
      ),
    },
    {
      header: "Actions",
      field: "actions",
      render: (_, shop) => {
        return (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => handleAssignStatusToShop(shop)}
              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg shadow-md transition duration-200 hover:scale-105"
              title="Assign Status"
            >
              <FaStore />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-full mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
          <h2 className="text-2xl font-bold text-white">Shops Management</h2>
          <p className="text-blue-100 mt-1">Manage all registered shops</p>
        </div>

        <div className="p-6">
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search bar */}
            <div className="flex-1 flex items-center bg-gray-100 p-4 rounded-xl shadow-sm border border-gray-200">
              <FaSearch className="text-gray-500 mr-3" />
              <input
                type="text"
                placeholder="Search by shop name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-800 font-medium"
              />
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between bg-white border-2 border-gray-200 hover:border-blue-300 px-4 py-4 rounded-xl shadow-sm min-w-[200px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <div className="flex items-center">
                  <FaFilter className="text-gray-500 mr-2" />
                  <span className="text-gray-800 font-medium">
                    {getCurrentStatusLabel()}
                  </span>
                </div>
                <FaChevronDown
                  className={`text-gray-500 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setStatusFilter(option.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center justify-between ${
                        statusFilter === option.value
                          ? "bg-blue-50 border-r-2 border-blue-500"
                          : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <span
                          className={`w-3 h-3 rounded-full mr-3 ${
                            option.color === "green"
                              ? "bg-green-500"
                              : option.color === "red"
                              ? "bg-red-500"
                              : option.color === "yellow"
                              ? "bg-yellow-500"
                              : option.color === "blue"
                              ? "bg-blue-500"
                              : "bg-gray-500"
                          }`}
                        ></span>
                        <span className="font-medium text-gray-800">
                          {option.label}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          option.color === "green"
                            ? "bg-green-100 text-green-800"
                            : option.color === "red"
                            ? "bg-red-100 text-red-800"
                            : option.color === "yellow"
                            ? "bg-yellow-100 text-yellow-800"
                            : option.color === "blue"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {option.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-100">
              <div className="flex items-center mb-2">
                <FaUsers className="text-blue-500 text-xl mr-2" />
                <p className="text-blue-500 font-medium">Total Shops</p>
              </div>
              <p className="text-2xl font-bold">{shops.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl shadow-sm border border-green-100">
              <div className="flex items-center mb-2">
                <FaUserCheck className="text-green-500 text-xl mr-2" />
                <p className="text-green-500 font-medium">Active Shops</p>
              </div>
              <p className="text-2xl font-bold">
                {shops.filter((shop) => shop.status === "active").length}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-xl shadow-sm border border-red-100">
              <div className="flex items-center mb-2">
                <FaStore className="text-red-500 text-xl mr-2" />
                <p className="text-red-500 font-medium">Inactive Shops</p>
              </div>
              <p className="text-2xl font-bold">
                {shops.filter((shop) => shop.status === "inactive").length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl shadow-sm border border-yellow-100">
              <div className="flex items-center mb-2">
                <FaUserClock className="text-yellow-500 text-xl mr-2" />
                <p className="text-yellow-500 font-medium">Suspended Shops</p>
              </div>
              <p className="text-2xl font-bold">
                {shops.filter((shop) => shop.status === "suspended").length}
              </p>
            </div>
          </div>

          {/* Active Filter Display */}
          {statusFilter !== "all" && (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">Filtered by:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeColor(
                  statusFilter
                )}`}
              >
                {getCurrentStatusLabel()}
              </span>
              <button
                onClick={() => setStatusFilter("all")}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Clear filter
              </button>
            </div>
          )}

          {/* Results count */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredShops.length} of {shops.length} shops
            </p>
          </div>

          {/* Table Component */}
          <Table columns={columns} data={filteredShops} pageSize={10} />
        </div>
      </div>
    </div>
  );
};

export default ManageShops;
