import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartServices from "../../user/services/cartServices.js";

// --- Async Thunks ---
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (arg, { rejectWithValue }) => {
    try {
      return await cartServices.addToCart(arg);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCart = createAsyncThunk(
  "cart/getCart",
  async (_, { rejectWithValue }) => {
    try {
      return await cartServices.getCart();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async (arg, { rejectWithValue }) => {
    try {
      return await cartServices.updateQuantity(arg); // Renamed service method to updateQuantity if needed
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (arg, { rejectWithValue }) => {
    try {
      return await cartServices.removeFromCart(arg);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// --- Slice ---
const initialState = {
  cart: null, 
  loading: false,
  error: null,
  success: false
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.cart = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle all "Pending" states together
      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
        }
      )
      // Handle all "Rejected" states together
      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload?.message || action.payload || "Cart Error";
          state.success = false;
        }
      )
      // Handle "Fulfilled" states (They all return the updated Cart object)
      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") && action.type.endsWith("/fulfilled"),
        (state, action) => {
          state.loading = false;
          // Backend returns { success: true, data: { items: [], totalPrice: ... } }
          state.cart = action.payload?.data || action.payload;
          state.success = true;
          state.error = null;
        }
      );
  }
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
