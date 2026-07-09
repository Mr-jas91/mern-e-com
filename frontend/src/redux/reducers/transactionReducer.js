// redux/reducers/transactionReducer.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { transaction } from "../../shared/services/transactionServices";
import { get_transaction, updateTransactionStatus as updateStatusType } from "../utils/actionTypes";

// 🚀 फिक्स: थंक फैक्ट्री में 'arg' पास किया ताकि थंक इन्वोक करते समय पेलोड आगे सर्विस तक जा सके
const createAsyncAction = (type, serviceFunction) => {
  return createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {
      const res = await serviceFunction(arg); // ⚡ पेलोड को यहाँ फॉरवर्ड किया
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  });
};

export const getTransaction = createAsyncAction(
  get_transaction,
  transaction.getTransaction
);

// 🚀 फिक्स: सही एक्शन टाइप टोकन के साथ एक्स्ट्रैक्टेड थंक रजिस्टर किया
export const updateTransactionStatus = createAsyncAction(
  updateStatusType, 
  transaction.updatePaymentStatus
);

const initialState = {
  transactions: [],
  loading: false,
  success: false,
  error: null
};

const handlePending = (state) => {
  state.loading = true;
  state.success = false;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.success = false;
  state.error = action.payload || "Something went wrong";
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Transactions Lifecycle
      .addCase(getTransaction.pending, handlePending)
      .addCase(getTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.transactions = action.payload?.data || action.payload || [];
      })
      .addCase(getTransaction.rejected, handleRejected)

      // ⚡ फिक्स: Update Transaction Lifecycle केसेस को हैंडल किया
      .addCase(updateTransactionStatus.pending, handlePending)
      .addCase(updateTransactionStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        
        // जो ट्रांजैक्शन अपडेट हुआ है उसे म्यूटेट किए बिना तुरंत स्टेट एरे में रिप्लेस करें
        const updatedData = action.payload?.data || action.payload;
        if (updatedData && updatedData._id) {
          state.transactions = state.transactions.map((t) => 
            t._id === updatedData._id ? updatedData : t
          );
        }
      })
      .addCase(updateTransactionStatus.rejected, handleRejected);
  }
});

export default transactionSlice.reducer;