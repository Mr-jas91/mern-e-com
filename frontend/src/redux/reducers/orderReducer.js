import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderServices from "../../shared/services/orderServices";
import {
  create_Order,
  get_Orders,
  order_Details,
  order_Cancel,
  admin_orders,
  admin_order_details,
  admin_delivery_status
} from "../utils/actionTypes";

// Initial state with user & admin sections separated
const initialState = {
  // User orders
  myorders: [],
  orderDetails: null,

  // Admin orders
  adminOrders: [],
  adminOrderDetails: null,

  // Common flags
  loading: false,
  success: false,
  error: null
};

// Helper: creates async thunk with proper error handling
const createAsyncAction = (type, serviceMethod) =>
  createAsyncThunk(type, async (payload, { rejectWithValue }) => {
    try {
      const response = await serviceMethod(payload);
      console.log(response);
      return { type, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  });

// USER THUNKS
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

// ADMIN THUNKS
export const getAdminOrders = createAsyncAction(
  admin_orders,
  orderServices.getAdminOrders
);
export const getAdminOrderDetails = createAsyncAction(
  admin_order_details,
  orderServices.getAdminOrderDetails
);
export const updateDeliveryStatus = createAsyncAction(
  admin_delivery_status,
  orderServices.updateDeliveryStatus
);
export const acceptOrderItemThunk = createAsyncAction(
  "admin_accept_order",
  orderServices.acceptOrderItem
);

// Common reducer handlers
const handlePending = (state) => {
  state.loading = true;
  state.error = null;
  state.success = false;
};

const handleFulfilled = (state, action) => {
  state.loading = false;
  state.success = true;
  state.error = null;

  const { type, data } = action.payload;

  switch (type) {
    // USER
    case create_Order:
      // Optional: add to myorders or show confirmation
      break;

    case get_Orders:
      state.myorders = data?.data?.orders || [];
      break;

    case order_Details:
    case order_Cancel:
      state.orderDetails = data?.data || null;
      break;

    // ADMIN
    case admin_orders:
      state.adminOrders = data?.data || [];
      break;

    case admin_order_details:
      state.adminOrderDetails = data?.data || null;
      break;

    case admin_delivery_status:
      // Optionally update adminOrderDetails or mark as delivered
      break;

    default:
      break;
  }
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.success = false;
  state.error = action.payload;
};

// Slice creation
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrderDetails: (state, action) => {
      state.orderDetails = action.payload;
    },
    resetOrderState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    const allThunks = [
      createOrder,
      getOrders,
      getOrderDetails,
      cancelOrder,
      getAdminOrders,
      getAdminOrderDetails,
      updateDeliveryStatus,
      acceptOrderItemThunk
    ];

    allThunks.forEach((thunkAction) => {
      builder
        .addCase(thunkAction.pending, handlePending)
        .addCase(thunkAction.fulfilled, handleFulfilled)
        .addCase(thunkAction.rejected, handleRejected);
    });
  }
});

// Export actions and reducer
export const { setOrderDetails, resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
