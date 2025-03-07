import { useEffect, useState } from "react";
import { fetchOrders,updateOrderStatus,deleteOrder  } from "../Service/orderService";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Đang tải danh sách đơn hàng...</p>;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-5">Orders Management</h2>
      <OrderTable orders={orders} onUpdateStatus={handleUpdateStatus} onDelete={handleDelete} />
    </div>
  );
};

export default ManageOrders;
