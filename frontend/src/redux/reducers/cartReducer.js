import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartServices from "../../user/services/cartServices.js";
import {
  add_ToCart,
  get_Cart,
  update_Cart,
  remove_FromCart
} from "../utils/actionTypes.js";

// Utility to create async thunks
const createAsyncAction = (type, serviceMethod) =>
  createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {
      const response = await serviceMethod(arg);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  });

// Async actions
export const addToCart = createAsyncAction(add_ToCart, cartServices.addToCart);
export const getCart = createAsyncAction(get_Cart, cartServices.getCart);
export const updateCart = createAsyncAction(
  update_Cart,
  cartServices.updateCart
);
export const removeFromCart = createAsyncAction(
  remove_FromCart,
  cartServices.removeFromCart
);

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
  notification: null
};

// State handlers
const handlePending = (state) => {
  state.loading = true;
  state.error = null;
};

const handleFulfilled = (state, action) => {
  state.loading = false;
  state.cartItems = action.payload?.data || action.payload;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
      state.totalPrice = 0;
    },
    resetCartNotification: (state) => {
      state.notification = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, handlePending)
      .addCase(addToCart.fulfilled, handleFulfilled)
      .addCase(addToCart.rejected, handleRejected)
      .addCase(getCart.pending, handlePending)
      .addCase(getCart.fulfilled, handleFulfilled)
      .addCase(getCart.rejected, handleRejected)
      .addCase(updateCart.pending, handlePending)
      .addCase(updateCart.fulfilled, handleFulfilled)
      .addCase(updateCart.rejected, handleRejected)
      .addCase(removeFromCart.pending, handlePending)
      .addCase(removeFromCart.fulfilled, handleFulfilled)
      .addCase(removeFromCart.rejected, handleRejected);
  }
});

export const { clearCart, resetCartNotification } = cartSlice.actions;
export default cartSlice.reducer;
