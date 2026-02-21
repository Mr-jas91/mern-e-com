import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { transection } from "../../shared/services/transectionServices";
import { get_transection } from "../utils/actionTypes";

const createAsyncAction = (type, serviceFunction) => {
  return createAsyncThunk(type, async (_, { rejectedWithValue }) => {
    try {
      const res = await serviceFunction();
      // console.log(res.data);
      return res.data;
    } catch (error) {
      return rejectedWithValue(error.response?.data || error.message);
    }
  });
};

export const getTransection = createAsyncAction(
  get_transection,
  transection.getTransection
);

const initialState = {
  transections: [],
  loading: false,
  success: false,
  error: null
};

const handlePending = (state, action) => {
  state.loading = true;
  state.success = false;
  state.error = null;
};
const handleFulfilled = (state, action) => {
  state.loading = false;
  state.success = true;
  state.error = null;
  state.transections = action.payload?.data;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.success = false;
  state.error = action.payload?.data;
};

const transectionSlice = createSlice({
  name: "transections",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTransection.pending, handlePending)
      .addCase(getTransection.fulfilled, handleFulfilled)
      .addCase(getTransection.rejected, handleRejected);
  }
});

export default transectionSlice.reducer;
