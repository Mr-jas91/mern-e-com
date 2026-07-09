import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderServices from "../../shared/services/orderServices.js";


const createOrderThunk = (type, serviceCall) =>
  createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {

      const response = typeof serviceCall === "function" && serviceCall.length !== 1
        ? await serviceCall(arg)
        : await serviceCall(arg);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  });

// --- User Actions ---
export const createOrder = createOrderThunk("orders/createOrder", orderServices.createOrder);
export const getMyOrders = createOrderThunk("orders/getMyOrders", orderServices.getMyOrders);


export const getOrderDetails = createAsyncThunk(
  "orders/getOrderDetails",
  async ({ orderId, itemId }, { rejectWithValue }) => {
    try {
      const response = await orderServices.getOrderDetails(orderId, itemId);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async ({ orderId, itemId }, { rejectWithValue }) => {
    try {
      const response = await orderServices.cancelOrder(orderId, itemId);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// --- Admin Actions ---
export const getAdminOrders = createOrderThunk("orders/getAdminOrders", orderServices.getAdminOrders);
export const getAdminOrderDetails = createOrderThunk("orders/getAdminOrderDetails", orderServices.getAdminOrderDetails);
export const updateDeliveryStatus = createOrderThunk("orders/updateDeliveryStatus", orderServices.updateDeliveryStatus);
export const acceptOrderItem = createOrderThunk("orders/acceptOrder", orderServices.acceptOrderItem);
export const recentOrders = createOrderThunk("orders/recentOrders", orderServices.recentOrders);

// --- Initial State ---
const initialState = {
  myOrders: [],
  currentOrder: null,
  adminOrders: [],
  adminOrderDetails:[],
  recentOrders: [],
  loading: false,
  error: null,
  success: false,
  orderCreated: false
};

// --- Slice ---
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetOrderFlags: (state) => {
      state.success = false;
      state.orderCreated = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 1. Create Order
      .addCase(createOrder.fulfilled, (state) => {
        state.loading = false;
        state.orderCreated = true;
      })

      // 2. Get My Orders
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload?.orders || action.payload || [];
      })

      // 3. Get Details
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload?.order || action.payload;
      })


      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updatedOrder = action.payload?.order || action.payload;


        if (state.currentOrder && state.currentOrder._id === updatedOrder?._id) {
          state.currentOrder = updatedOrder;
        }

        const index = state.myOrders.findIndex((o) => o._id === updatedOrder?._id);
        if (index !== -1) {
          state.myOrders[index] = updatedOrder;
        }
      })

      // 5. Admin Cases 
      .addCase(getAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.adminOrders = action.payload?.orders || action.payload || [];
      })
      .addCase(getAdminOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.adminOrderDetails = action.payload?.order || action.payload;
      })
      .addCase(recentOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.recentOrders = action.payload?.orders || action.payload || [];
      })

      .addCase(updateDeliveryStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updated = action.payload?.order || action.payload;
        const idx = state.adminOrders.findIndex((o) => o._id === updated?._id);
        if (idx !== -1) state.adminOrders[idx] = updated;
      })
      .addCase(acceptOrderItem.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updated = action.payload?.order || action.payload;
        const idx = state.adminOrders.findIndex((o) => o._id === updated?._id);
        if (idx !== -1) state.adminOrders[idx] = updated;
      })

      // --- Matchers for Loading/Error 
      .addMatcher(
        (action) => action.type.startsWith("orders/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("orders/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || action.payload || "Order Action Failed";
        }
      );
  }
});

export const { resetOrderFlags } = orderSlice.actions;
export default orderSlice.reducer;