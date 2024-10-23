import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartServices from "../../user/services/cartServices.js";

// Add to cart
export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ productId, accessToken }, { rejectWithValue }) => {
    try {
      const response = await cartServices.addToCart(productId, accessToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.data || "Failed to add item to cart"
      );
    }
  }
);

// Get cart
export const getCart = createAsyncThunk(
  "cart/get",
  async (accessToken, { rejectWithValue }) => {
    try {
      const response = await cartServices.getCart(accessToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.data || "Failed to fetch cart"
      );
    }
  }
);

// Update Cart
export const updateCart = createAsyncThunk(
  "cart/update",
  async ({ productId, action, accessToken }, { rejectWithValue }) => {
    try {
      const response = await cartServices.updateCart(
        productId,
        action,
        accessToken
      );
      return response.data; // Ensure consistent response structure
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.data || "Failed to update cart"
      );
    }
  }
);

// Remove from cart
export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async ({ productId, accessToken }, { rejectWithValue }) => {
    try {
      const response = await cartServices.removeFromCart(
        productId,
        accessToken
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.data || "Failed to remove item from cart"
      );
    }
  }
);

// Clear the cart
export const clearCart = () => (dispatch) => {
  dispatch({
    type: "cart/clearCartItem"
  });
};
// reset notification
export const resetCartNotification = () => (dispatch) => {
  dispatch({
    type: "cart/resetNotification"
  });
};
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    totalPrice: 0,
    loading: false,
    updateLoading: false,
    deleteLoading: false,
    addCartSuccess: false,
    addCartError: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.addCartSuccess = false;
        state.addCartError = false;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.addCartSuccess = true;
        state.loading = false;
        state.cartItems = action.payload?.data?.items;
        state.totalPrice = action.payload?.data?.totalPrice;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.addCartError = true;
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload?.data?.items;
        state.totalPrice = action.payload?.data?.totalPrice;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCart.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.cartItems = action.payload?.data?.items;
        state.totalPrice = action.payload?.data?.totalPrice;
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.loading = false;
        state.cartItems = action.payload.data.items;
        state.totalPrice = action.payload.data.totalPrice;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.deleteLoading = false;
        state.loading = false;
        state.error = action.payload;
      })
      .addCase("cart/clearCartItem", (state) => {
        state.cartItems = [];
        state.totalPrice = 0;
      })
      .addCase("cart/resetNotification", (state) => {
        state.addCartSuccess = false;
        state.addCartError = false;
      });
  }
});

export default cartSlice.reducer;
