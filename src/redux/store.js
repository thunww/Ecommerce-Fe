import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import adminReducer from "./adminSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
  },
});

export default store;
