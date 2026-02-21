import { configureStore } from "@reduxjs/toolkit";
import logger from 'redux-logger';
import authReducer from "./reducers/authReducer.js";
import productReducer from "./reducers/productReducer.js";
import cartReducer from "./reducers/cartReducer.js";
import checkoutReducer from "./reducers/checkoutReducer.js";
import orderSlice from "./reducers/orderReducer.js";
import adminReducer from "./reducers/adminReducer.js";
import transectionReducer from "./reducers/transectionReducer.js";
const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    orders: orderSlice,
    admin: adminReducer,
    transections: transectionReducer
  },
  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["auth/login/fulfilled", "auth/logout/fulfilled"],
        ignoredPaths: ["auth.payload.headers"]
      }
    }).concat(logger)
});

export default store;
