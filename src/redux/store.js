import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import adminReducer from "./adminSlice";
import shopReducer from "./shopSlice";
import productReducer from "./productSilce";

import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";


import reviewReducer from "./reviewsSilce";

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    shops: shopReducer,
    products: productReducer,

    cart: cartReducer,
    wishlist: wishlistReducer,

    reviews: reviewReducer,

  },
});

export default store;
