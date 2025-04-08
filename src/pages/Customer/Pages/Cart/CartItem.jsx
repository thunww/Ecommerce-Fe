import React, { useState } from "react";
import { InputNumber, Button, Popconfirm, message, Tooltip } from "antd";
import { DeleteOutlined, HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import "./Cart.css";

const CartItem = ({ item }) => {
    console.log("Rendering CartItem with data:", item);

    const dispatch = useDispatch();
    const [isWishlist, setIsWishlist] = useState(false);
    const [quantity, setQuantity] = useState(item?.quantity || 1);

    if (!item) {
        console.error("No item data provided to CartItem");
        return (
            <div className="cart-item" style={{ justifyContent: 'center', padding: "20px" }}>
                <p>Không thể hiển thị thông tin sản phẩm</p>
            </div>
        );
    }

    const handleQuantityChange = (value) => {
        if (value < 1) {
            message.warning("Số lượng phải lớn hơn 0");
            return;
        }
        setQuantity(value);
        message.success("Đã cập nhật số lượng");
    };

    const handleRemove = () => {
        message.success("Đã xóa sản phẩm khỏi giỏ hàng");
    };

    const handleAddToWishlist = () => {
        setIsWishlist(true);
        message.success("Đã thêm vào danh sách yêu thích");
    };

    const handleRemoveFromWishlist = () => {
        setIsWishlist(false);
        message.success("Đã xóa khỏi danh sách yêu thích");
    };

    // Sử dụng các thuộc tính an toàn với fallback
    const productName = item.product_name || item.name || "Sản phẩm";
    const productImage = item.product_image || item.image || "https://placehold.co/600x400?text=No+Image";
    const productPrice = item.price || 0;
    const productVariant = item.variant_name || "";
    const productStock = item.stock || 10;
    const productOriginalPrice = item.original_price;
    const productId = item.cart_item_id || item.id || Date.now();

    return (
        <div className="cart-item">
            <div className="item-image">
                <img
                    src={productImage}
                    alt={productName}
                    title={productName}
                />
                <div className="item-actions">
                    <Tooltip title={isWishlist ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}>
                        <Button
                            type="text"
                            icon={isWishlist ? <HeartFilled style={{ color: "#ff4d4f" }} /> : <HeartOutlined />}
                            onClick={isWishlist ? handleRemoveFromWishlist : handleAddToWishlist}
                            aria-label={isWishlist ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                        />
                    </Tooltip>
                </div>
            </div>

            <div className="item-info">
                <h3>{productName}</h3>
                {productVariant && <p className="variant">Phân loại: {productVariant}</p>}
                <p className="price">{productPrice.toLocaleString("vi-VN")}đ</p>
                {productOriginalPrice && (
                    <div className="original-price">
                        {productOriginalPrice.toLocaleString("vi-VN")}đ
                    </div>
                )}
            </div>

            <div className="item-quantity">
                <InputNumber
                    min={1}
                    max={productStock}
                    value={quantity}
                    onChange={handleQuantityChange}
                    size="large"
                    id={`quantity-${productId}`}
                    name={`quantity-${productId}`}
                    aria-label="Số lượng sản phẩm"
                />
                <div className="stock-info">
                    Còn {productStock} sản phẩm
                </div>
            </div>

            <div className="item-total">
                <div className="total-price">
                    {(productPrice * quantity).toLocaleString("vi-VN")}đ
                </div>
                {productOriginalPrice && (
                    <div className="saved-amount">
                        Tiết kiệm:{" "}
                        {((productOriginalPrice - productPrice) * quantity).toLocaleString("vi-VN")}đ
                    </div>
                )}
            </div>

            <div className="item-actions">
                <Popconfirm
                    title="Bạn có chắc chắn muốn xóa sản phẩm này?"
                    onConfirm={handleRemove}
                    okText="Có"
                    cancelText="Không"
                >
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        className="remove-btn"
                        aria-label="Xóa sản phẩm"
                    >
                        Xóa
                    </Button>
                </Popconfirm>
            </div>
        </div>
    );
};

export default CartItem; 