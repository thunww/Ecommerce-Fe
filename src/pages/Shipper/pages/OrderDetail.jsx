import { useParams } from "react-router-dom";

const OrderDetail = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Order Detail</h2>
      <p>Order ID: {id}</p>
      <p>Customer Name: hii</p>
      <p>Address: 123 Main St</p>
      <button className="bg-green-600 text-white px-4 py-2 mt-4 rounded">Mark as Delivered</button>
    </div>
  );
};

export default OrderDetail;
