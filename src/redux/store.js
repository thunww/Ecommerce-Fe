import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import adminReducer from "./adminSlice";
import shopReducer from "./shopSlice";
import productReducer from "./productSilce";
import shipperReducer from "./shipperSlice";
import userReducer from "./userSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import reviewReducer from "./reviewsSilce";
import categoryReducer from "./categorySlice";
import orderReducer from "./orderSlice";
import addressReducer from "./addressSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    shipper: shipperReducer,
    user: userReducer,
    shops: shopReducer,
    products: productReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    reviews: reviewReducer,
    categories: categoryReducer,
    orders: orderReducer,
    addresses: addressReducer,
  },
});

export default store;
