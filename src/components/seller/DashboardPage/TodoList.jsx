import React, { useState, useEffect } from "react";
import { getAllOrders } from "../../../services/vendorService";

const ToDoList = () => {
  const [toProcess, setToProcess] = useState(0);
  const [processing, setProcessing] = useState(0);
  const [shipped, setShipped] = useState(0);
  const [cancelled, setCancelled] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrders();
        const orders = response.orders; // API trả về `orders`, cần lấy mảng này

        setToProcess(orders.filter(order => order.status === "pending").length);
        setProcessing(orders.filter(order => order.status === "processing").length);
        setShipped(orders.filter(order => order.status === "shipped").length);
        setCancelled(orders.filter(order => order.status === "cancelled").length);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="font-bold text-lg">To-Do List</h2>
      <div className="grid grid-cols-4 text-center">
        <div>
          <p className="text-blue-500 text-2xl font-bold">{toProcess}</p>
          <p>Orders Pending</p>
        </div>
        <div>
          <p className="text-blue-500 text-2xl font-bold">{processing}</p>
          <p>Orders Processing</p>
        </div>
        <div>
          <p className="text-blue-500 text-2xl font-bold">{shipped}</p>
          <p>Orders Shipped</p>
        </div>
        <div>
          <p className="text-blue-500 text-2xl font-bold">{cancelled}</p>
          <p>Orders Cancelled</p>
        </div>
      </div>
    </div>
  );
};

export default ToDoList;
