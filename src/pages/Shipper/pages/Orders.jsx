import { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const statusClasses = {
  "Chờ xác nhận": "bg-yellow-100 text-yellow-700",
  "Đang giao": "bg-blue-100 text-blue-700",
  "Đã hoàn thành": "bg-green-100 text-green-700",
  "Đã hủy": "bg-red-100 text-red-700"
};

const tabs = ["Tất cả", "Chờ xác nhận", "Đang giao", "Đã hoàn thành", "Đã hủy"];
const itemsPerPage = 10;

const sampleOrders = [
  { id: "ORD0012345", name: "Nguyễn Văn A", phone: "0912345678", price: 150000, date: "07/03/2025 10:30", address: "23 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh", status: "Chờ xác nhận" },
  { id: "ORD0012344", name: "Trần Thị B", phone: "0987654321", price: 200000, date: "07/03/2025 09:45", address: "45 Lê Lợi, Quận 3, TP. Hồ Chí Minh", status: "Đang giao" },
  { id: "ORD0012343", name: "Phạm Văn C", phone: "0909123456", price: 350000, date: "06/03/2025 16:20", address: "12 Trần Phú, Quận 5, TP. Hồ Chí Minh", status: "Đã hoàn thành" },
  { id: "ORD0012342", name: "Lê Thị D", phone: "0976543210", price: 120000, date: "06/03/2025 14:15", address: "78 Võ Văn Tần, Quận 10, TP. Hồ Chí Minh", status: "Đã hủy" }
];

export default function Orders() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersData] = useState(sampleOrders);

  const filteredOrders = ordersData
    .filter(order =>
      (activeTab === "Tất cả" || order.status === activeTab) &&
      (order.id.includes(search) || order.name.includes(search))
    )
    .sort((a, b) => (sortBy === "date" ? new Date(b.date) - new Date(a.date) : a.price - b.price));

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const displayedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {/* Tabs */}
      <div className="flex space-x-4 border-b pb-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-t-md ${activeTab === tab ? "border-b-2 border-orange-500 text-orange-500" : "text-gray-500"}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Search Bar & Filters */}
      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng..."
          className="p-2 border rounded flex-grow"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="p-2 border rounded" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">Ngày tạo</option>
          <option value="price">Giá trị</option>
        </select>
      </div>
      
      {/* Order Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Mã đơn</th>
            <th className="border p-2">Khách hàng</th>
            <th className="border p-2">Số điện thoại</th>
            <th className="border p-2">Giá trị</th>
            <th className="border p-2">Ngày tạo</th>
            <th className="border p-2">Địa chỉ</th>
            <th className="border p-2">Trạng thái</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {displayedOrders.map((order) => (
            <tr key={order.id} className="border">
              <td className="border p-2 text-blue-600 font-semibold">#{order.id}</td>
              <td className="border p-2">{order.name}</td>
              <td className="border p-2">{order.phone}</td>
              <td className="border p-2">{order.price.toLocaleString()}đ</td>
              <td className="border p-2">{order.date}</td>
              <td className="border p-2">{order.address}</td>
              <td className={`border p-2 rounded ${statusClasses[order.status]}`}>{order.status}</td>
              <td className="border p-2">
                <button className="bg-orange-500 text-white px-3 py-1 rounded">Chi tiết</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button 
          className="p-2 border rounded disabled:opacity-50" 
          onClick={() => setCurrentPage(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          <FaAngleLeft />
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button 
            key={index} 
            className={`px-3 py-1 border rounded ${currentPage === index + 1 ? "bg-orange-500 text-white" : ""}`} 
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button 
          className="p-2 border rounded disabled:opacity-50" 
          onClick={() => setCurrentPage(currentPage + 1)} 
          disabled={currentPage === totalPages}
        >
          <FaAngleRight />
        </button>
      </div>
    </div>
  );
}