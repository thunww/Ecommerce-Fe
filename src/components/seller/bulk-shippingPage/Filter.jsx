const Filter = () => {
    return (
      <div className="p-4 border-b">
        {/* Hạn giao hàng */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-gray-500 font-medium">Hạn giao hàng</span>
          <button className="px-3 py-1 border text-red-500 border-red-500 rounded-full">
            Tất cả trạng thái (0)
          </button>
          <button className="px-3 py-1 border text-gray-600 rounded-full">
            Quá hạn giao hàng (0)
          </button>
          <button className="px-3 py-1 border text-gray-600 rounded-full">
            Trong vòng 24 tiếng (0)
          </button>
          <button className="px-3 py-1 border text-gray-600 rounded-full">
            Trên 24 tiếng (0)
          </button>
        </div>
  
        {/* Đơn vị vận chuyển */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-gray-500 font-medium">Đơn vị vận chuyển</span>
          <button className="px-3 py-1 border text-red-500 border-red-500 rounded-full">
            SPX Instant (0)
          </button>
          <button className="px-3 py-1 border text-gray-600 rounded-full">
            GrabExpress (0)
          </button>
          <button className="px-3 py-1 border text-gray-600 rounded-full">
            AhaMove (0)
          </button>
          <button className="px-3 py-1 border text-gray-600 rounded-full">
            beDelivery (0)
          </button>
          <button className="px-3 py-1 border text-gray-600 rounded-full">
            SPX Express (0)
          </button>
          <button className="px-3 py-1 border text-gray-600 rounded-full">
            Giao Hàng Nhanh (0)
          </button>
          <button className="px-3 py-1 border text-gray-600 rounded-full">
            Viettel Post (0)
          </button>
          <button className="px-3 py-1 border text-gray-600 rounded-full">
            Ninja Van (0)
          </button>
        </div>
  
        {/* Mở rộng bộ lọc */}
        <div className="mt-2 text-blue-500 cursor-pointer">Mở rộng bộ lọc ▼</div>
      </div>
    );
  };
  
  export default Filter;
  