import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ProductServices from "../../user/services/productServices.js";
import {
  fetchAllProducts as fetchProducts,
  fetchProduct,
  fetchByCategory
} from "../utils/actionTypes.js";

// Reusable async action creator
const createAsyncAction = (type, serviceMethod) => {
  return createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {
      const response = await serviceMethod(arg);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  });
};

// Define async actions
export const fetchAllProducts = createAsyncAction(
  fetchProducts,
  ProductServices.getAllProducts
);

export const fetchProductById = createAsyncAction(
  fetchProduct,
  ProductServices.getProductById
);

export const fetchProductsByCategory = createAsyncAction(
  fetchByCategory,
  ProductServices.getProductByCategory
);

export const fetchCategories = createAsyncAction(
  "products/fetchCategories",
  ProductServices.getCategory
);

// Initial state
const initialState = {
  products: [],
  singleProduct: null,
  categories: [],
  loading: false,
  error: null
};

// Centralized state handlers
const handlePending = (state) => {
  state.loading = true;
  state.error = null;
};

const handleFulfilled = (state, action, key) => {
  state.loading = false;
  state[key] = action.payload?.data || action.payload;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

// Create slice with reusable reducers
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, handlePending)
      .addCase(fetchAllProducts.fulfilled, (state, action) =>
        handleFulfilled(state, action, "products")
      )
      .addCase(fetchAllProducts.rejected, handleRejected)

      .addCase(fetchProductById.pending, handlePending)
      .addCase(fetchProductById.fulfilled, (state, action) =>
        handleFulfilled(state, action, "singleProduct")
      )
      .addCase(fetchProductById.rejected, handleRejected)

      .addCase(fetchProductsByCategory.pending, handlePending)
      .addCase(fetchProductsByCategory.fulfilled, (state, action) =>
        handleFulfilled(state, action, "products")
      )
      .addCase(fetchProductsByCategory.rejected, handleRejected)

      .addCase(fetchCategories.pending, handlePending)
      .addCase(fetchCategories.fulfilled, (state, action) =>
        handleFulfilled(state, action, "categories")
      )
      .addCase(fetchCategories.rejected, handleRejected);
  }
});

export default productSlice.reducer;
