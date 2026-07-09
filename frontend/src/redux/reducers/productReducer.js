import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ProductServices from "../../user/services/productService.js"; 

// --- 🛠️ स्मार्ट थंक इंजन (User APIs को छेड़े बिना Admin के undefined डेटा क्रैश को फिक्स करता है) ---
const createThunk = (type, serviceCall) =>
  createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {
      const response = await serviceCall(arg);
      
      // 💡 व्याख्या: आपके 'handleRequest' इंटरसेप्टर से पहले ही 'response.data' आ रहा है।
      // अगर रिस्पॉन्स में सीधे डेटा आ गया है, तो उसे सीधा भेजें, वरना 'response.data' भेजें।
      // इससे User API और Admin API दोनों का पेलोड परफेक्ट चलेगा।
      return response?.data !== undefined ? response.data : response; 
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  });

// ==========================================
// 👤 UNCHANGED: आपकी पुरानी User APIs (बिल्कुल पहले जैसी)
// ==========================================
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

// ==========================================
// 🔐 ADDED/UPDATED: Admin APIs की नई लॉजिक
// ==========================================
export const deleteProduct = createThunk(
  "products/delete",
  ProductServices.deleteProduct
);
export const addProduct = createThunk(
  "products/add",
  ProductServices.addProduct
);
// 🚀 नया एडमिन एक्शन: डैशबोर्ड पर एडमिन प्रोडक्ट्स फेच करने के लिए
export const getAdminProducts = createThunk(
  "products/getAdmin",
  ProductServices.getAdminProducts
);
// 🚀 नया एडमिन एक्शन: एडमिन कैटेगरी फेच करने के लिए (ProductServices.getCategory से मैप्ड)
export const fetchAdminCategories = createThunk(
  "products/fetchAdminCategories",
  ProductServices.getCategory
);

// --- 👤 UNCHANGED: आपका पुराना Initial State ---
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
      // ==========================================
      // 👤 UNCHANGED: आपके पुराने User Cases (No logic break)
      // ==========================================
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

      // ==========================================
      // 🔐 ADDED: नए एडमिन स्पेसिफिक केसेस
      // ==========================================
      // Get Admin Products (डैशबोर्ड ग्रिड को मुख्य प्रोडक्ट्स एरे से सिंक करता है)
      .addCase(getAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload?.products || action.payload || [];
      })
      // Fetch Admin Categories
      .addCase(fetchAdminCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload?.categories || action.payload || [];
      })
      // Add Product Success
      .addCase(addProduct.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      // --- ADMIN: Delete Product (आपका पुराना ओरिजिनल Optimistic UI लॉजिक) ---
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const deletedId = action.meta.arg;
        state.products = state.products.filter((p) => p._id !== deletedId);
      })

      // --- Matchers (आपका पुराना ओरिजिनल पेंडिंग/रिजेक्टेड हैंडलर) ---
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