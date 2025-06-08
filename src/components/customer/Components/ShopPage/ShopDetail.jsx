import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getShopById } from "../../../../redux/shopSlice"; // Import action từ shopSlice
import ShopHeader from "./ShopHeader";
import ProductList from "./ProductList";

const ShopDetail = () => {
  const { shopId } = useParams();
  const dispatch = useDispatch();
  const { selectedShop, loading, error } = useSelector((state) => state.shops);

  useEffect(() => {
    if (shopId) {
      dispatch(getShopById(shopId));
    }
  }, [dispatch, shopId]);

  if (loading) {
    return <div className="text-center p-4">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Lỗi: {error}</div>;
  }

  if (!selectedShop) {
    return (
      <div className="text-center p-4">Không tìm thấy thông tin cửa hàng</div>
    );
  }

  const {
    shop_id = "",
    shop_name = "Unknown Shop",
    description = "No description available",
    logo = "https://via.placeholder.com/100",
    banner = "https://via.placeholder.com/1200x200",
    rating = "0",
    followers = 0,
    total_products = 0,
    views = 0,
    address = "No address provided",
    status = "inactive",
    created_at = new Date().toISOString(),
    User = { username: "Unknown" },
    products = [],
  } = selectedShop;

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
        createdAt={created_at}
        status={status}
        username={User.username}
      />

      {/* Product List */}
      <ProductList products={products} />
    </div>
  );
};

export default ShopDetail;
