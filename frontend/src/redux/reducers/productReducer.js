import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ProductServices from "../../user/services/productService.js"; 

// --- Thunks ---
const createThunk = (type, serviceCall) =>
  createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {
      const response = await serviceCall(arg);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  });

export const fetchAllProducts = createThunk(
  "products/fetchAll",
  ProductServices.getAllProducts
);
export const fetchProductById = createThunk(
  "products/fetchOne",
  ProductServices.getProductById
);
export const fetchProductsByCategory = createThunk(
  "products/fetchByCategory",
  ProductServices.getProductsByCategory
);
export const fetchCategories = createThunk(
  "products/fetchCategories",
  ProductServices.getCategories
);
export const searchProducts = createThunk(
  "products/search",
  ProductServices.searchProducts
);

// Admin Thunks (Assuming they share the same slice)
export const deleteProduct = createThunk(
  "products/delete",
  ProductServices.deleteProduct
);
export const addProduct = createThunk(
  "products/add",
  ProductServices.addProduct
);

// --- Slice ---
const initialState = {
  products: [],
  singleProduct: null,
  categories: [],
  loading: false,
  error: null,
  success: false
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductErrors: (state) => {
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload?.products || action.payload || [];
      })

      // Fetch One
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleProduct = action.payload;
      })

      // Search & Category Filter (Updates main list)
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload || [];
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload || [];
      })

      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload || [];
      })

      // --- ADMIN: Delete Product (Optimistic UI Update) ---
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Remove the deleted item from the list instantly
        // Assuming action.meta.arg contains the deleted ID if payload doesn't return it
        const deletedId = action.meta.arg;
        state.products = state.products.filter((p) => p._id !== deletedId);
      })

      // --- Matchers ---
      .addMatcher(
        (action) =>
          action.type.startsWith("products/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("products/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload?.message || action.payload || "Product Error";
        }
      );
  }
});

export const { clearProductErrors } = productSlice.actions;
export default productSlice.reducer;
