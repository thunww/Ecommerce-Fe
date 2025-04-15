import cartApi from "../api/cartApi";
import { message } from "antd";

// Dữ liệu mẫu để đảm bảo luôn có dữ liệu hiển thị
const mockCartData = {
    items: [
        {
            id: 1,
            cart_item_id: 1,
            name: "Sản phẩm mẫu 1",
            product_name: "Sản phẩm mẫu 1",
            product_image: "https://placehold.co/600x400?text=SP1",
            variant_name: "Xanh / M",
            price: 150000,
            original_price: 200000,
            quantity: 2,
            stock: 10
        },
        {
            id: 2,
            cart_item_id: 2,
            name: "Sản phẩm mẫu 2",
            product_name: "Sản phẩm mẫu 2",
            product_image: "https://placehold.co/600x400?text=SP2",
            variant_name: "Đỏ / L",
            price: 250000,
            quantity: 1,
            stock: 5
        }
    ],
    shippingFee: 30000,
    discount: 50000
};

const cartService = {
    // Lấy thông tin giỏ hàng
    getCart: async () => {
        try {
            const response = await cartApi.getCart();
            console.log('API Response:', response);

            if (!response || !response.data) {
                throw new Error('Không có dữ liệu giỏ hàng');
            }

            const cartData = response.data;
            console.log('Cart Data:', cartData);

            // Xử lý và chuẩn hóa dữ liệu trả về từ backend
            if (cartData && cartData.items) {
                const processedItems = cartData.items.map(item => {
                    // Xử lý biến thể sản phẩm
                    let variantInfo = null;
                    if (item.variant_info) {
                        try {
                            variantInfo = typeof item.variant_info === 'string'
                                ? JSON.parse(item.variant_info)
                                : item.variant_info;
                        } catch (e) {
                            console.error('Lỗi khi parse variant_info:', e);
                        }
                    }

                    // Tạo tên biến thể
                    let variantName = '';
                    if (item.variant) {
                        const variantAttributes = [];
                        if (item.variant.size) variantAttributes.push(`Size: ${item.variant.size}`);
                        if (item.variant.color) variantAttributes.push(`Màu: ${item.variant.color}`);
                        if (item.variant.material) variantAttributes.push(`Chất liệu: ${item.variant.material}`);
                        variantName = variantAttributes.join(' | ');
                    } else if (variantInfo) {
                        const variantAttributes = [];
                        if (variantInfo.size) variantAttributes.push(`Size: ${variantInfo.size}`);
                        if (variantInfo.color) variantAttributes.push(`Màu: ${variantInfo.color}`);
                        if (variantInfo.material) variantAttributes.push(`Chất liệu: ${variantInfo.material}`);
                        variantName = variantAttributes.join(' | ');
                    }

                    // Xác định hình ảnh sản phẩm
                    let productImage = item.product_image;
                    if (!productImage && item.product) {
                        if (item.product.thumbnail) {
                            productImage = item.product.thumbnail;
                        } else if (item.product.images && item.product.images.length > 0) {
                            productImage = item.product.images[0].image_url;
                        }
                    }

                    return {
                        ...item,
                        product_name: item.product_name || (item.product ? item.product.name : "Sản phẩm"),
                        product_image: productImage || "https://placehold.co/600x400?text=No+Image",
                        variant_name: variantName || "Mặc định",
                        price: parseFloat(item.price || (item.product ? item.product.price : 0)),
                        original_price: item.original_price || (item.product && item.product.original_price ? parseFloat(item.product.original_price) : null),
                        shop_name: item.shop_name || (item.shop ? item.shop.name : ""),
                        stock: item.stock || (item.variant ? item.variant.stock : (item.product ? item.product.stock : 10))
                    };
                });

                return {
                    items: processedItems,
                    shippingFee: parseFloat(cartData.shippingFee || 0),
                    discount: parseFloat(cartData.discount || 0)
                };
            }

            return {
                items: [],
                shippingFee: 0,
                discount: 0
            };
        } catch (error) {
            console.error('Lỗi khi lấy giỏ hàng:', error);
            message.error('Không thể lấy thông tin giỏ hàng');
            throw error;
        }
    },

    // Thêm sản phẩm vào giỏ hàng
    addToCart: async (data) => {
        try {
            const response = await cartApi.addToCart(data);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);
            message.error('Không thể thêm sản phẩm vào giỏ hàng');
            throw error;
        }
    },

    // Cập nhật số lượng sản phẩm
    updateCartItem: async (cartItemId, quantity) => {
        try {
            const response = await cartApi.updateCartItem(cartItemId, quantity);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi cập nhật giỏ hàng:', error);
            message.error('Không thể cập nhật số lượng sản phẩm');
            throw error;
        }
    },

    // Xóa sản phẩm khỏi giỏ hàng
    removeFromCart: async (cartItemId) => {
        try {
            const response = await cartApi.removeFromCart(cartItemId);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi xóa khỏi giỏ hàng:', error);
            message.error('Không thể xóa sản phẩm khỏi giỏ hàng');
            throw error;
        }
    },

    // Xóa toàn bộ giỏ hàng
    clearCart: async () => {
        try {
            await cartApi.clearCart();
            message.success("Đã xóa giỏ hàng");
            return { items: [] };
        } catch (error) {
            console.error("Lỗi khi xóa giỏ hàng:", error);
            message.error("Lỗi khi xóa giỏ hàng");
            return { items: [] }; // Trả về giỏ hàng trống
        }
    },

    // Áp dụng mã giảm giá
    applyCoupon: async (code) => {
        try {
            const response = await cartApi.applyCoupon(code);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi áp dụng mã giảm giá:', error);
            message.error('Không thể áp dụng mã giảm giá');
            throw error;
        }
    },

    // Tính phí vận chuyển
    calculateShipping: async (address) => {
        try {
            const response = await cartApi.calculateShipping(address);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi tính phí vận chuyển:', error);
            message.error('Không thể tính phí vận chuyển');
            throw error;
        }
    }
};

export default cartService; 