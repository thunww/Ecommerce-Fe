import { FaTrash } from "react-icons/fa";

const OrderTable = ({ orders, onUpdateStatus, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-800 text-white text-left">
            <th className="p-3">ID</th>
            <th className="p-3">Customer</th>
            <th className="p-3">Total Amount</th>
            <th className="p-3">Status</th>
            <th className="p-3">Order Date</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr
              key={order.id}
              className={`text-gray-700 text-left ${
                index % 2 === 0 ? "bg-gray-100" : "bg-white"
              } hover:bg-gray-200 transition`}
            >
              <td className="p-3">{order.id}</td>
              <td className="p-3">{order.customer}</td>
              <td className="p-3 font-semibold">{order.total.toLocaleString()}đ</td>
              <td className="p-3">
                <select
                  value={order.status}
                  onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                  className="border p-2 rounded-md bg-white shadow-sm"
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Completed">Completed</option>
                </select>
              </td>
              <td className="p-3">{order.date}</td>
              <td className="p-3">
                <button
                  onClick={() => onDelete(order.id)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;