
import axiosClient from "./axiosClient";

const couponApi = {
    // Kiểm tra mã giảm giá
    validateCoupon: (code) => {
        const url = `/coupons/validate/${code}`;
        return axiosClient.post(url);
    },

    // Áp dụng mã giảm giá vào giỏ hàng
    applyCoupon: (code, cart_id) => {
        const url = "/coupons/apply";
        return axiosClient.post(url, { code, cart_id });
    },

    // Xóa mã giảm giá khỏi giỏ hàng
    removeCoupon: () => {
        const url = `/coupons/remove`; // ✅ chuẩn theo backend
        return axiosClient.post(url);  // ✅ dùng POST
    }
    ,

    // Lấy danh sách mã giảm giá có thể sử dụng
    getAvailableCoupons: () => {
        const url = "/coupons/valid-for-cart";
        return axiosClient.get(url);
    },
    getAllCoupons: () => {
        const url = "/coupons";
        return axiosClient.get(url);
    }

};

export default couponApi; 