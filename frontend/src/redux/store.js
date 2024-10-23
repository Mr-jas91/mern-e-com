import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer.js";
import productReducer from "./reducers/productReducer.js";
import cartReducer from "./reducers/cartReducer.js";
import checkoutReducer from "./reducers/checkoutReducer.js";
import orderSlice from "./reducers/orderReducer.js";
const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    orders: orderSlice,
  },
  devTools: import.meta.env.DEV,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["auth/login/fulfilled", "auth/logout/fulfilled"],
        ignoredPaths: ["auth.payload.headers"],
      },
    }),
});

export default store;
