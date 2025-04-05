import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import adminReducer from "./adminSlice";
import shopReducer from "./shopSlice";
import productReducer from "./productSilce";
const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    shops: shopReducer,
    products: productReducer,
  },
});

export default store;