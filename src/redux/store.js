import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import adminReducer from "./adminSlice";
import shopReducer from "./shopSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    shops: shopReducer,
  },
});

export default store; 
