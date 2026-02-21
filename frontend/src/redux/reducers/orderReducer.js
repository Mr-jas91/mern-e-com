import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderServices from "../../user/services/orderService.js"; 

// --- Async Thunks ---
const createThunk = (type, serviceCall) =>
  createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {
      const response = await serviceCall(arg);
      return response.data; // Return just the data object
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  });

// User Actions
export const createOrder = createThunk(
  "orders/createOrder",
  orderServices.createOrder
);
export const getMyOrders = createThunk(
  "orders/getMyOrders",
  orderServices.getMyOrders
);
export const getOrderDetails = createThunk("orders/getOrderDetails", (args) =>
  orderServices.getOrderDetails(args.id, args.itemId)
);
export const cancelOrder = createThunk("orders/cancelOrder", (args) =>
  orderServices.cancelOrder(args.id, args.itemId)
);

// Admin Actions
// Note: Ensure you have adminServices or these methods exist in your orderServices
export const getAdminOrders = createThunk(
  "orders/getAdminOrders",
  orderServices.getAdminOrders
);
export const getAdminOrderDetails = createThunk(
  "orders/getAdminOrderDetails",
  orderServices.getAdminOrderDetails
);
export const updateDeliveryStatus = createThunk(
  "orders/updateDeliveryStatus",
  orderServices.updateDeliveryStatus
);

// --- Slice ---
const initialState = {
  myOrders: [],
  currentOrder: null, // For details view
  adminOrders: [],
  recentOrders: [],
  loading: false,
  error: null,
  success: false,
  orderCreated: false // Specific flag for redirecting after checkout
};

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
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderCreated = true; // Trigger for redirect
        // Optionally append to myOrders if needed immediately
      })

      // 2. Get My Orders
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload?.orders || action.payload || [];
      })

      // 3. Get Details / Cancel Order (Updates current view)
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Update the specific order in the list if it exists
        if (state.currentOrder) state.currentOrder = action.payload;
      })

      // 4. Admin Cases
      .addCase(getAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.adminOrders = action.payload || [];
      })

      // --- Matchers for Loading/Error ---
      .addMatcher(
        (action) =>
          action.type.startsWith("orders/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("orders/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload?.message || action.payload || "Order Error";
        }
      );
  }
});

export const { resetOrderFlags } = orderSlice.actions;
export default orderSlice.reducer;
