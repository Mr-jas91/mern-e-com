import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ProductServices from "../../shared/services/productServices.js";
import {
  fetchAllProducts as fetchProducts,
  fetchProduct,
  fetchByCategory,
  add_Product,
  add_Category,
  AdminProducts,
  updateProduct,
  delete_Product
} from "../utils/actionTypes.js";

// ✅ Utility function to create async thunk actions with consistent error handling
const createAsyncAction = (type, serviceMethod) => {
  return createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {
      const response = await serviceMethod(arg); // Call API service method
      return response.data; // Return the data on success
    } catch (error) {
      // Return a rejected value with error message or data
      return rejectWithValue(error.response?.data || error.message);
    }
  });
};

// ✅ Category-related async thunk action
export const addCategory = createAsyncAction(
  add_Category,
  ProductServices.addCategory
);

// ✅ Product-related async thunk actions
export const addProduct = createAsyncAction(
  add_Product,
  ProductServices.addProduct
);

export const getAdminProducts = createAsyncAction(
  AdminProducts,
  ProductServices.getAdminProducts
);

export const updateProductDetails = createAsyncAction(
  updateProduct,
  ProductServices.updateProduct
);
export const deleteProduct = createAsyncAction(
  delete_Product,
  ProductServices.deleteProduct
);

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
  "products/fetchCategories", // Hardcoded action type
  ProductServices.getCategory
);

// ✅ Initial state for the product slice
const initialState = {
  products: [], // List of all or filtered products
  singleProduct: null, // For viewing/editing a specific product
  categories: [], // List of product categories
  loading: false, // Loading state for async actions
  error: null, // Error message from failed actions
  success: false // Tracks if the last operation was successful
};

// ✅ Handle async action pending state
const handlePending = (state) => {
  state.loading = true;
  state.error = null;
  state.success = false;
};

// ✅ Handle async action fulfilled state and update specified key
const handleFulfilled = (state, action, key) => {
  state.loading = false;
  state.success = true;
  state[key] = action.payload?.data || action.payload;
};

// ✅ Handle async action rejected state
const handleRejected = (state, action) => {
  state.loading = false;
  state.success = false;
  state.error = action.payload;
};

// Create slice with reusable reducers
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add Category (no state update, just mark loading/success)
      .addCase(addCategory.pending, handlePending)
      .addCase(addCategory.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        // No category list update — we expect caller to fetchCategories again if needed
      })
      .addCase(addCategory.rejected, handleRejected)

      // Add Product (no update to product list here)
      .addCase(addProduct.pending, handlePending)
      .addCase(addProduct.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        // No update to products list — caller must dispatch fetchAllProducts manually
      })
      .addCase(addProduct.rejected, handleRejected)

      // Update Product (only update matching product if already present)
      .addCase(updateProductDetails.pending, handlePending)
      .addCase(updateProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updated = action.payload?.data || action.payload;
        const index = state.products.findIndex((p) => p._id === updated._id);
        if (index !== -1) {
          state.products[index] = updated;
        }
      })
      .addCase(updateProductDetails.rejected, handleRejected)

      // Delete Product
      .addCase(deleteProduct.pending, handlePending)
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteProduct.rejected, handleRejected)
      // Fetch admin products
      .addCase(getAdminProducts.pending, handlePending)
      .addCase(getAdminProducts.fulfilled, (state, action) =>
        handleFulfilled(state, action, "products")
      )
      .addCase(getAdminProducts.rejected, handleRejected)

      // Fetch All Products
      .addCase(fetchAllProducts.pending, handlePending)
      .addCase(fetchAllProducts.fulfilled, (state, action) =>
        handleFulfilled(state, action, "products")
      )
      .addCase(fetchAllProducts.rejected, handleRejected)

      // Fetch Product by ID
      .addCase(fetchProductById.pending, handlePending)
      .addCase(fetchProductById.fulfilled, (state, action) =>
        handleFulfilled(state, action, "singleProduct")
      )
      .addCase(fetchProductById.rejected, handleRejected)

      // Fetch Products by Category
      .addCase(fetchProductsByCategory.pending, handlePending)
      .addCase(fetchProductsByCategory.fulfilled, (state, action) =>
        handleFulfilled(state, action, "products")
      )
      .addCase(fetchProductsByCategory.rejected, handleRejected)

      // Fetch Categories
      .addCase(fetchCategories.pending, handlePending)
      .addCase(fetchCategories.fulfilled, (state, action) =>
        handleFulfilled(state, action, "categories")
      )
      .addCase(fetchCategories.rejected, handleRejected);
  }
});

export default productSlice.reducer;
