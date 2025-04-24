import { ChevronDown } from "lucide-react"; // Dùng ChevronDown thay vì ChevronUpDown

const ParcelList = () => {
  return (
    <div className="p-4">
      {/* Tiêu đề */}
      <h2 className="text-lg font-semibold">0 Kiện hàng</h2>

      {/* Bộ lọc sắp xếp */}
      <div className="flex justify-between items-center mt-4">
        <div></div>
        <button className="flex items-center gap-1 border px-3 py-1 text-sm rounded-md hover:bg-gray-100">
          Sắp xếp theo: Hạn gửi hàng (Xa - Gần nhất)
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <div className="border mt-4 rounded-lg">
        <div className="p-4 grid grid-cols-6 bg-gray-100 text-gray-500 text-sm font-medium">
          <span className="text-left">Sản Phẩm</span>
          <span className="text-left">Mã đơn hàng</span>
          <span className="text-left">Người mua</span>
          <span className="text-left">Đơn vị vận chuyển</span>
          <span className="text-left">Thời gian xác nhận đặt đơn</span>
          <span className="text-left">Trạng thái Đơn hàng</span>
        </div>
        <div className="p-6 text-center text-gray-400">Không có dữ liệu</div>
      </div>
    </div>
  );
};

export default ParcelList;
