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
} from "react-icons/fa";
import Table from "../../components/common/Table";
import Swal from "sweetalert2";

const ManageShops = () => {
  const dispatch = useDispatch();
  const { shops = [], loading, error } = useSelector((state) => state.shops);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAllShops());
  }, [dispatch]);

  const filteredShops =
    shops?.filter((shop) => {
      return shop.shop_name?.toLowerCase().includes(search.toLowerCase());
    }) ?? [];

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
    ,
    { header: "Description", field: "description" },
    { header: "Total products", field: "total_products" },
    { header: "Followers", field: "followers" },
    {
      header: "Status",
      field: "status",
      render: (status) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            status === "active"
              ? "bg-green-100 text-green-800"
              : status === "inactive"
              ? "bg-red-300 text-red-500"
              : status === "suspended"
              ? "bg-yellow-300 text-yellow-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {status}
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
          {/* Search bar */}
          <div className="flex items-center bg-gray-100 p-4 rounded-xl mb-6 shadow-sm border border-gray-200">
            <FaSearch className="text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Search by shop name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-800 font-medium"
            />
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                {shops.filter((shops) => shops.status === "active").length}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl shadow-sm border border-purple-100">
              <div className="flex items-center mb-2">
                <FaUserClock className="text-purple-500 text-xl mr-2" />
                <p className="text-purple-500 font-medium">Suspended Users</p>
              </div>
              <p className="text-2xl font-bold">
                {shops.filter((shops) => shops.status === "suspended").length}
              </p>
            </div>
          </div>

          {/* Table Component */}
          <Table columns={columns} data={filteredShops} pageSize={10} />
        </div>
      </div>
    </div>
  );
};

export default ManageShops;
