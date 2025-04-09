import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import adminReducer from "./adminSlice";
import shipperReducer from "./shipperSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    shipper: shipperReducer,
  },
});

export default store;