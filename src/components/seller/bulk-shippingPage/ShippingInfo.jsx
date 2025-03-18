const ShippingInfo = () => {
    return (
      <div className="p-4 border rounded-lg bg-white">
        <h2 className="text-lg font-semibold">Chọn ngày giao hàng loạt</h2>
        <p className="text-gray-500 text-sm">0 parcels selected</p>
  
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-md font-medium">Pickup</h3>
          <p className="text-gray-700">Phạm Minh Tuấn 84818638154</p>
          <p className="text-red-500 text-sm">Đến Lấy Hàng</p>
          <p className="text-gray-500 text-sm">
            20a Đường Số 16, Phường Phước Long A, TP. Thủ Đức, TP. Hồ Chí Minh
          </p>
        </div>
  
        <button className="mt-4 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600">
          Yêu cầu đơn vị vận chuyển đến lấy hàng
        </button>
      </div>
    );
  };
  
  export default ShippingInfo;
  