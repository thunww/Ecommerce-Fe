import React, { useState, useEffect } from "react";
import { getAllOrders } from "../../../services/vendorService";

const ToDoList = () => {
  const [toProcess, setToProcess] = useState(0);
  const [processed, setProcessed] = useState(0);
  const [returnRequests, setReturnRequests] = useState(0);
  const [restrictedProducts, setRestrictedProducts] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getAllOrders();
      setToProcess(orders.filter(order => order.status === "pending").length);
      setProcessed(orders.filter(order => order.status === "processed").length);
      setReturnRequests(orders.filter(order => order.status === "return_requested").length);
      setRestrictedProducts(orders.filter(order => order.status === "restricted").length);
    };

    fetchOrders();
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="font-bold text-lg">To-Do List</h2>
      <div className="grid grid-cols-4 text-center">
        <div>
          <p className="text-blue-500 text-2xl font-bold">{toProcess}</p>
          <p>Orders to Process</p>
        </div>
        <div>
          <p className="text-blue-500 text-2xl font-bold">{processed}</p>
          <p>Processed</p>
        </div>
        <div>
          <p className="text-blue-500 text-2xl font-bold">{returnRequests}</p>
          <p>Return Requests</p>
        </div>
        <div>
          <p className="text-blue-500 text-2xl font-bold">{restrictedProducts}</p>
          <p>Restricted Products</p>
        </div>
      </div>
    </div>
  );
};

export default ToDoList;
