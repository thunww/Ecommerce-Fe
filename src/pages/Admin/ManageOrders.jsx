import { useEffect, useState } from "react";
import { fetchOrders, updateOrderStatus, deleteOrder } from "./Service/orderService";
import OrderTable from "../../components/admin/OrderTable";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    const getOrders = async () => {
      setLoading(true);
      const data = await fetchOrders();
      setOrders(data);
      setLoading(false);
    };
    getOrders();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    await updateOrderStatus(id, newStatus);
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleDelete = async (id) => {
    await deleteOrder(id);
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
  };

  const filteredOrders = orders.filter(order =>
    (search === "" || order.customer.toLowerCase().includes(search.toLowerCase()) || order.id.toString().includes(search)) &&
    (filterStatus === "" || order.status === filterStatus)
  );

  if (loading) return <p>Loading order list...</p>;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-5">Orders Management</h2>
      
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search by Order ID or Customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-md w-1/3"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      
      <OrderTable orders={filteredOrders} onUpdateStatus={handleUpdateStatus} onDelete={handleDelete} />
    </div>
  );
};

export default ManageOrders;
