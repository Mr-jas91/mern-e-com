import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderServices from "../../user/services/orderServices";
import {
  create_Order,
  get_Orders,
  order_Details,
  order_Cancel
} from "../utils/actionTypes";

// Initial state
const initialState = {
  myorders: [],
  orderDetails: [],
  error: null,
  loading: false,
  success: false
};

// Helper function to create async actions
const createAsyncAction = (type, serviceMethod) =>
  createAsyncThunk(type, async (payload, { rejectWithValue }) => {
    try {
      const response = await serviceMethod(payload);
      return { type, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  });

// Async actions for orders
export const createOrder = createAsyncAction(
  create_Order,
  orderServices.createOrder
);
export const getOrders = createAsyncAction(
  get_Orders,
  orderServices.getMyOrders
);
export const getOrderDetails = createAsyncAction(
  order_Details,
  orderServices.getOrderDetails
);
export const cancelOrder = createAsyncAction(
  order_Cancel,
  orderServices.cancelOrder
);
// Handle different states of async actions
const handlePending = (state) => {
  state.loading = true;
  state.error = null;
};

const handleFulfilled = (state, action) => {
  state.loading = false;
  state.error = null;
  const { type, data } = action.payload;
  if (type === create_Order) {
    state.success = true;
  } else if (type === get_Orders) {
    state.success = true;
    state.myorders = data?.data?.orders;
  } else if (type === order_Details) {
    state.success = true;
    state.orderDetails = data?.data;
  } else if (type === order_Cancel) {
    state.success = true;
    state.orderDetails = data?.data;
  }
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
  state.success = false;
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrderDetails: (state, action) => {
      state.orderDetails = action.payload;
    }
  },
  extraReducers: (builder) => {
    [createOrder, getOrders, getOrderDetails].forEach((action) => {
      builder
        .addCase(action.pending, handlePending)
        .addCase(action.fulfilled, handleFulfilled)
        .addCase(action.rejected, handleRejected);
    });
  }
});

export const { setOrderDetails } = orderSlice.actions;
export default orderSlice.reducer;
