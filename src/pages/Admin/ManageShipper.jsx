import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllShippers, updateShipperStatus } from "../../redux/shipperSlice";
import Swal from "sweetalert2";
import {
  FaSearch,
  FaUserCheck,
  FaUsers,
  FaUserClock,
  FaStore,
  FaShippingFast,
} from "react-icons/fa";
import Table from "../../components/common/Table";

const ManageShippers = () => {
  const dispatch = useDispatch();
  const {
    shippers = [],
    loading,
    error,
  } = useSelector((state) => state.shipper);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getAllShippers());
  }, [dispatch]);

  const filteredShippers = shippers?.filter((s) =>
    s.users?.username?.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdateShipperStatus = (shipper) => {
    Swal.fire({
      title: "Update Shipper Status",
      html: `
        <div className="flex flex-col gap-2">
          <label class="flex items-center gap-2">
            <input type="radio" name="status" value="active" ${
              shipper.status === "active" ? "checked" : ""
            } class="form-radio text-blue-500" /> 
            <span>Active</span>
          </label>
          <label class="flex items-center gap-2">
            <input type="radio" name="status" value="inactive" ${
              shipper.status === "inactive" ? "checked" : ""
            } class="form-radio text-blue-500" /> 
            <span>inactive</span>
          </label>
          <label class="flex items-center gap-2">
            <input type="radio" name="status" value="banned" ${
              shipper.status === "banned" ? "checked" : ""
            } class="form-radio text-blue-500" /> 
            <span>Banned</span>
          </label>
        </div>
      `,
      preConfirm: () => {
        const status = document.querySelector(
          'input[name="status"]:checked'
        )?.value;
        return { status };
      },
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Update",
    }).then((result) => {
      if (result.isConfirmed && result.value.status) {
        dispatch(
          updateShipperStatus({
            shipperId: shipper.shipper_id,
            status: result.value.status, // Truyền status vào body
          })
        )
          .unwrap()
          .then(() => {
            Swal.fire({
              title: "Success!",
              text: "Shipper status updated",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
            dispatch(getAllShippers());
          })
          .catch((err) => {
            Swal.fire("Error", err || "Something went wrong", "error");
          });
      }
    });
  };

  const columns = [
    { header: "ID", field: "shipper_id", className: "w-16 text-center" },
    {
      header: "Avatar",
      field: "users.profile_picture",
      render: (_, shipper) => (
        <img
          src={
            shipper.users?.profile_picture ||
            "https://img.freepik.com/premium-photo/delivery-man-concept-online-order-tracking-delivery-home-officeillustration_837518-5752.jpg"
          }
          alt={shipper.users?.username || "Shipper"}
          className="w-12 h-12 rounded-full object-cover mx-auto"
        />
      ),
      className: "w-20 text-center",
    },
    {
      header: "Username",
      field: "users.username",
      render: (_, shipper) => (
        <span className="font-medium text-gray-800">
          {shipper.users?.username || "N/A"}
        </span>
      ),
    },
    {
      header: "Phone",
      field: "phone",
      render: (phone) => <span className="text-gray-600">{phone}</span>,
    },
    {
      header: "Vehicle",
      field: "vehicle_type",
      render: (vehicle) => (
        <span className="capitalize text-gray-600">{vehicle}</span>
      ),
    },
    {
      header: "License Plate",
      field: "license_plate",
      render: (plate) => <span className="text-gray-600">{plate}</span>,
    },
    {
      header: "Status",
      field: "status",
      render: (status) => (
        <span
          className={`inline-flex px-3 py-1 rounded-full text-sm font-medium capitalize ${
            status === "active"
              ? "bg-green-100 text-green-700"
              : status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : status === "banned"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {status}
        </span>
      ),
      className: "text-center",
    },
    {
      header: "Actions",
      field: "actions",
      render: (_, shipper) => (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => handleUpdateShipperStatus(shipper)}
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg shadow-md transition duration-200 hover:scale-105"
            title="Assign Status"
          >
            <FaShippingFast />
          </button>
        </div>
      ),
      className: "text-center",
    },
  ];

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  if (error)
    return (
      <p className="text-red-500 text-center p-6 bg-red-50 rounded-lg m-6">
        {error}
      </p>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-full mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-600 p-6">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Shippers Management
          </h2>
          <p className="text-blue-100 mt-2 text-sm">
            View and manage all registered shippers efficiently
          </p>
        </div>

        <div className="p-6">
          <div className="relative flex items-center bg-gray-100 p-3 rounded-xl mb-6 shadow-sm">
            <FaSearch className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search by shipper username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-100">
              <div className="flex items-center mb-2">
                <FaUsers className="text-blue-500 text-xl mr-2" />
                <p className="text-blue-500 font-medium">Total Shippers</p>
              </div>
              <p className="text-2xl font-bold">{shippers.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl shadow-sm border border-green-100">
              <div className="flex items-center mb-2">
                <FaUserCheck className="text-green-500 text-xl mr-2" />
                <p className="text-green-500 font-medium">Active Shippers</p>
              </div>
              <p className="text-2xl font-bold">
                {
                  shippers.filter((shippers) => shippers.status === "active")
                    .length
                }
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl shadow-sm border border-purple-100">
              <div className="flex items-center mb-2">
                <FaUserClock className="text-purple-500 text-xl mr-2" />
                <p className="text-purple-500 font-medium">
                  Suspended Shippers
                </p>
              </div>
              <p className="text-2xl font-bold">
                {
                  shippers.filter((shippers) => shippers.status === "suspended")
                    .length
                }
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table columns={columns} data={filteredShippers} pageSize={10} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageShippers;
