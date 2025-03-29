import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../../redux/productSilce";
import { fetchAllShops } from "../../redux/shopSlice";
import Swal from "sweetalert2";
import { FaSearch, FaBoxes, FaTag, FaShoppingCart } from "react-icons/fa";
import Table from "../../components/common/Table";

const ManageProducts = () => {
  const dispatch = useDispatch();
  const {
    products = [],
    loading,
    error,
  } = useSelector((state) => state.products);
  const [search, setSearch] = useState("");
  const { shops = [] } = useSelector((state) => state.shops);

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchAllShops());
  }, [dispatch]);

  const filteredProducts =
    products?.filter((product) =>
      product.product_name?.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

  if (loading) {
    return <p className="text-blue-500 text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  const columns = [
    { header: "ID", field: "product_id" },
    {
      header: "Product Image",
      field: "image",
      render: (image) => (
        <div className="flex justify-center">
          <img
            src={
              "https://th.bing.com/th/id/OIP.G_W3gQt1J0wtOMWzPkhH4QHaHa?rs=1&pid=ImgDetMain" ||
              image
            }
            alt="Product"
            className="w-12 h-12 rounded object-cover border border-gray-300 shadow-sm"
          />
        </div>
      ),
    },
    { header: "Product Name", field: "product_name" },
    {
      header: "Shop",
      field: "shop_id",
      render: (shop_id) => {
        const shop = shops.find((s) => s.shop_id === shop_id);
        return shop ? shop.shop_name : "Unknown";
      },
    },
    {
      header: "Category",
      field: "Category",
      render: (product) => {
        return product?.category_name || "Unknown";
      },
    },
    { header: "Price", field: "price" },
    { header: "Stock", field: "stock" },
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
              : status === "pending"
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
      render: (_, product) => (
        <div className="flex items-center justify-center space-x-2">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg shadow-md transition duration-200 hover:scale-105"
            title="Edit Product"
            onClick={() =>
              Swal.fire("Edit Product", `Edit ${product.product_name}`, "info")
            }
          >
            <FaTag />
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-md transition duration-200 hover:scale-105"
            title="Delete Product"
            onClick={() =>
              Swal.fire(
                "Delete Product",
                `Delete ${product.product_name}?`,
                "warning"
              )
            }
          >
            <FaShoppingCart />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-full mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 p-4">
          <h2 className="text-2xl font-bold text-white">Products Management</h2>
          <p className="text-green-100 mt-1">Manage all listed products</p>
        </div>

        <div className="p-6">
          {/* Search bar */}
          <div className="flex items-center bg-gray-100 p-4 rounded-xl mb-6 shadow-sm border border-gray-200">
            <FaSearch className="text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Search by product name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-800 font-medium"
            />
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-100">
              <div className="flex items-center mb-2">
                <FaBoxes className="text-blue-500 text-xl mr-2" />
                <p className="text-blue-500 font-medium">Total Products</p>
              </div>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl shadow-sm border border-green-100">
              <div className="flex items-center mb-2">
                <FaTag className="text-green-500 text-xl mr-2" />
                <p className="text-green-500 font-medium">Available Products</p>
              </div>
              <p className="text-2xl font-bold">
                {products.filter((p) => p.stock > 0).length}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-xl shadow-sm border border-red-100">
              <div className="flex items-center mb-2">
                <FaShoppingCart className="text-red-500 text-xl mr-2" />
                <p className="text-red-500 font-medium">Pending Product</p>
              </div>
              <p className="text-2xl font-bold">
                {products.filter((p) => p.status === "pending").length}
              </p>
            </div>
          </div>

          {/* Table Component */}
          <Table columns={columns} data={filteredProducts} pageSize={10} />
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
