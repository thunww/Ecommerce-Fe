const fakeOrders = [
    { id: 1, customer: "Nguyễn Văn A", total: 1200000, status: "Pending", date: "2025-03-07" },
    { id: 2, customer: "Trần Thị B", total: 850000, status: "Shipped", date: "2025-03-06" },
    { id: 3, customer: "Lê Văn C", total: 2300000, status: "Completed", date: "2025-03-05" },
  ];
  
  export const fetchOrders = async () => new Promise((resolve) => setTimeout(() => resolve([...fakeOrders]), 500));
  
  export const updateOrderStatus = async (orderId, newStatus) => new Promise((resolve) => {
    setTimeout(() => {
      const index = fakeOrders.findIndex(order => order.id === orderId);
      if (index !== -1) fakeOrders[index].status = newStatus;
      resolve(true);
    }, 300);
  });
  
  export const deleteOrder = async (orderId) => new Promise((resolve) => {
    setTimeout(() => {
      const index = fakeOrders.findIndex(order => order.id === orderId);
      if (index !== -1) fakeOrders.splice(index, 1);
      resolve(true);
    }, 300);
  });
  