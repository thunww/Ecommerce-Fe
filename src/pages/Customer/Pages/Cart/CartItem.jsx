// CartItem.jsx (refactor theo UI mẫu: layout ngang, màu sắc nhãn, gọn gàng)
import React from "react";
import {
  InputNumber,
  Button,
  Popconfirm,
  Space,
  Select,
  Checkbox,
  Tag,
} from "antd";
import {
  DeleteOutlined,
  HeartOutlined,
  HeartFilled,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import "./Cart.css";

const { Option } = Select;

const CartItem = ({
  item,
  isSelected,
  selectedVariantId,
  onSelectItem,
  onSelectVariant,
  onQuantityChange,
  onRemoveItem,
  onToggleWishlist,
  isWishlist,
}) => {
  const variant = item.variant;
  const shop = item.product.shop;

  return (
    <div className="cart-item">
      <div className="cart-item-inner">
        <Checkbox
          className="cart-item-checkbox"
          checked={isSelected}
          onChange={(e) => onSelectItem(e.target.checked, item.cart_item_id)}
        />

        <div className="cart-item-img">
          <img
            src={
              variant?.image_url || "https://placehold.co/600x400?text=No+Image"
            }
            alt={item.product.product_name}
          />
        </div>

        <div className="cart-item-info">
          <h3 className="product-name">{item.product.product_name}</h3>

          <div className="variant-tags">
            {variant.attributes?.size && (
              <Tag color="blue">Size: {variant.attributes.size}</Tag>
            )}
            {variant.attributes?.color && (
              <Tag color="green">Màu: {variant.attributes.color}</Tag>
            )}
            {variant.attributes?.material && (
              <Tag color="purple">Chất liệu: {variant.attributes.material}</Tag>
            )}
          </div>

          <div className="shop-info">
            <img src={shop?.logo} alt={shop?.shop_name} className="shop-logo" />
            <span>{shop?.shop_name}</span>
          </div>

          <div className="variant-select">
            <Select
              value={selectedVariantId || variant.id}
              onChange={(value) => onSelectVariant(item.cart_item_id, value)}
              style={{ width: 220 }}
            >
              {item.product.variants?.map((v) => (
                <Option key={v.id} value={v.id}>
                  {v.attributes?.size} / {v.attributes?.color}
                </Option>
              ))}
            </Select>
          </div>

          <div className="cart-item-actions">
            <Space>
              <Button
                icon={<MinusOutlined />}
                onClick={() =>
                  onQuantityChange(item.cart_item_id, item.quantity - 1)
                }
                disabled={item.quantity <= 1}
              />
              <InputNumber
                min={1}
                max={variant?.stock || 99}
                value={item.quantity}
                onChange={(value) => onQuantityChange(item.cart_item_id, value)}
              />
              <Button
                icon={<PlusOutlined />}
                onClick={() =>
                  onQuantityChange(item.cart_item_id, item.quantity + 1)
                }
                disabled={item.quantity >= variant?.stock}
              />
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
                onClick={() => onRemoveItem(item.cart_item_id)}
              />
              <Button
                type="text"
                icon={
                  isWishlist ? (
                    <HeartFilled style={{ color: "#ff4d4f" }} />
                  ) : (
                    <HeartOutlined />
                  )
                }
                onClick={() => onToggleWishlist(item.cart_item_id)}
              />
            </Space>
          </div>

          <div className="cart-item-price">
            <span className="price">
              {parseFloat(item.total_price).toLocaleString("vi-VN")}₫
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
