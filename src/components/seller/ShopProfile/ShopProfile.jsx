import React, { useEffect, useState } from "react";
import ShopHeader from "../../../components/customer/Components/ShopPage/ShopHeader";
import ProductList from "../../../components/customer/Components/ShopPage/ProductList";
import shopApi from "../../../api/VendorAPI/shopApi";

const ShopProfile = () => {
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch thông tin shop của người dùng đang đăng nhập
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
        const response = await shopApi.getMyShopDetails();

        if (response.data.success) {
          setShopData(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy thông tin shop"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return <div className="text-center p-4 text-red-500">Lỗi: {error}</div>;
  }

  // Nếu không có dữ liệu shop
  if (!shopData) {
    return <div className="text-center p-4">Không tìm thấy thông tin shop</div>;
  }

  const {
    shop_id,
    shop_name,
    description,
    logo,
    banner,
    rating,
    followers,
    total_products,
    views,
    address,
    status,
    created_at,
    User,
    products,
    total_reviews,
    total_revenue,
    order_stats,
  } = shopData;

  return (
    <div className="shop-detail container mx-auto p-4">
      {/* Shop Header */}
      <ShopHeader
        shopId={shop_id}
        shopName={shop_name}
        description={description}
        logo={logo}
        banner={banner}
        rating={rating}
        followers={followers}
        totalProducts={total_products}
        views={views}
        address={address}
        status={status}
        createdAt={created_at}
        username={User.username}
      />

      {/* Thông tin chi tiết shop */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-2xl font-bold mb-4">Thông tin chi tiết</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800">Doanh thu</h3>
            <p className="text-2xl font-bold text-blue-600">
              {parseFloat(total_revenue).toLocaleString("vi-VN")} VNĐ
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800">Đánh giá</h3>
            <p className="text-2xl font-bold text-green-600">{rating} / 5</p>
            <p className="text-sm text-green-600">({total_reviews} đánh giá)</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-800">Sản phẩm</h3>
            <p className="text-2xl font-bold text-purple-600">
              {total_products}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800">Đơn hàng</h3>
            <div className="space-y-1">
              <p className="text-sm">
                Đang chờ:{" "}
                <span className="font-bold">{order_stats?.pending || 0}</span>
              </p>
              <p className="text-sm">
                Đang xử lý:{" "}
                <span className="font-bold">
                  {order_stats?.processing || 0}
                </span>
              </p>
              <p className="text-sm">
                Đang giao:{" "}
                <span className="font-bold">{order_stats?.shipped || 0}</span>
              </p>
              <p className="text-sm">
                Hoàn thành:{" "}
                <span className="font-bold">{order_stats?.delivered || 0}</span>
              </p>
              <p className="text-sm">
                Đã hủy:{" "}
                <span className="font-bold">{order_stats?.cancelled || 0}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product List */}
      <ProductList products={products} />
    </div>
  );
};

export default ShopProfile;
