import { useEffect, useState } from "react";
import { fetchOrders, updateOrderStatus, deleteOrder } from "./Service/orderService";
import Table from "../../components/common/Table";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const handleDelete = async (id) => {
    try {
      const success = await deleteOrder(id);
      if (success) {
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const success = await updateOrderStatus(id, newStatus);
      if (success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === id ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const columns = [
    { header: "Order ID", field: "id" },
    { header: "Customer", field: "customer" },
    { 
      header: "Total", 
      field: "total", 
      render: (value) => `₫${value?.toLocaleString() || "0"}` 
    },
    {
      header: "Product Image",
      field: "productImage",
      render: (value) => (
        <img src={value} alt="Product" className="w-16 h-16 object-cover rounded-md" />
      ),
    },
    {
      header: "Status",
      field: "status",
      render: (value, row) => (
        <select
          className="border p-2 rounded-md"
          value={value}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Completed">Completed</option>
        </select>
      ),
    },
  ];
  
  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-5">Orders Management</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : (
        <Table columns={columns} data={orders} onDelete={handleDelete} pageSize={5} />
      )}
    </div>
  );
};

export default ManageOrders;
