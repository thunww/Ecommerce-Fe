import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import adminReducer from "./adminSlice";
import shopReducer from "./shopSlice";
import productReducer from "./productSilce";
<<<<<<< HEAD
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";

=======
import reviewReducer from "./reviewsSilce";
>>>>>>> main
const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    shops: shopReducer,
    products: productReducer,
<<<<<<< HEAD
    cart: cartReducer,
    wishlist: wishlistReducer,
=======
    reviews: reviewReducer,
>>>>>>> main
  },
});

export default store;
