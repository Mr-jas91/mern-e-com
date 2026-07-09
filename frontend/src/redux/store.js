import { configureStore } from "@reduxjs/toolkit";
import { logger } from 'redux-logger';
import authReducer from "./reducers/authReducer.js";
import productReducer from "./reducers/productReducer.js";
import cartReducer from "./reducers/cartReducer.js";
import checkoutReducer from "./reducers/checkoutReducer.js";
import orderSlice from "./reducers/orderReducer.js";
import adminReducer from "./reducers/adminReducer.js";
import transactionReducer from "./reducers/transactionReducer.js"; // 💡 पाथ को बाकी रिड्यूसर्स की तरह सिंक कर दिया

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    orders: orderSlice,
    admin: adminReducer,
    transactions: transactionReducer
  },
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["auth/login/fulfilled", "auth/logout/fulfilled"],
        ignoredPaths: ["auth.payload.headers"]
      }
    });
    if (process.env.NODE_ENV === "development") {
      return middleware.concat(logger);
    }

    return middleware;
  },
  devTools: process.env.NODE_ENV !== "production"
});

export default store;