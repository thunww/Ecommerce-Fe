import axiosClient from "./axiosClient";

const wishlistApi = {
    getWishlist: () => {
        const url = "/wishlist";
        return axiosClient.get(url);
    },

    addToWishlist: (productId) => {
        const url = `/wishlist/${productId}`;
        return axiosClient.post(url);
    },

    removeFromWishlist: (productId) => {
        const url = `/wishlist/${productId}`;
        return axiosClient.delete(url);
    },
};

export default wishlistApi; 