import { Star, ShoppingCart, Heart, Truck, ShieldCheck } from "lucide-react";

const ProductDetail = () => {
  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Hình ảnh sản phẩm */}
      <div className="border rounded-lg p-4 flex justify-center">
        <img
          src="#"
          alt="Product"
          className="w-full max-w-md object-cover"
        />
      </div>
      
      {/* Thông tin sản phẩm */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Tên sản phẩm Shopee
        </h1>
        <div className="flex items-center gap-2 text-yellow-500">
          {[...Array(5)].map((_, index) => (
            <Star key={index} size={20} fill="currentColor" />
          ))}
          <span className="text-gray-600 text-sm">(1.2k đánh giá)</span>
        </div>
        
        <p className="text-red-500 text-3xl font-semibold my-3">₫299.000</p>
        
        <div className="flex items-center gap-4 text-gray-600 text-sm">
          <div className="flex items-center gap-1">
            <Truck size={18} /> Miễn phí vận chuyển
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck size={18} /> Đảm bảo Shopee
          </div>
        </div>
        
        <div className="flex gap-4 mt-6">
          <button className="bg-red-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow hover:bg-red-600">
            <ShoppingCart size={20} /> Thêm vào giỏ hàng
          </button>
          <button className="border border-gray-300 px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100">
            <Heart size={20} className="text-red-500" /> Yêu thích
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;