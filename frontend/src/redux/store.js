import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  devTools: import.meta.env.MODE === 'development',
});

export default store;
