import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import orderServices from "../../user/services/orderServices.js";
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (
    { orderItems, shippingAddress, orderPrice, accessToken },
    { rejectWithValue }
  ) => {
    try {
      const response = await orderServices.createOrder(
        orderItems,
        shippingAddress,
        orderPrice,
        accessToken
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// get all orders
export const getOrders = createAsyncThunk(
  "orders/getOrders",
  async (accessToken, { rejectWithValue }) => {
    try {
      const response = await orderServices.getUserOrderHistory(accessToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// get Order details
export const getOrderDetails = createAsyncThunk(
  "orders/getOrderDetails",
  async ({ orderId, accessToken }, { rejectWithValue }) => {
    try {
      const response = await orderServices.getOrderDetails(
        orderId,
        accessToken
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    myorders: [],
    orderDetails: [],
    error: null,
    loading: false,
    success: false
  },
  reducers: {
    setOrderDetails: (state, action) => {
      state.orderDetails = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.myorders = state.myorders
          ? [...state.myorders, action.payload?.data?.order]
          : [action.payload?.data?.order];
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myorders = action.payload?.data?.order;
        state.error = null;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload.data;
        state.error = null;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});
export const { setOrderDetails } = orderSlice.actions;
export default orderSlice.reducer;
