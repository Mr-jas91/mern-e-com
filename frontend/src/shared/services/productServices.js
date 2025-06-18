import api from "../interceptor";

// ✅ Handles API requests and centralizes error handling
const handleRequest = async (request) => {
  try {
    const response = await request; // Await API call
    return response.data; // Return response data
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data || error.message; // Throw error for caller to handle
  }
};

// ✅ Service object that contains all product-related API calls
const ProductServices = {
  // ========================
  // 🔐 Admin APIs
  // ========================

  // Add a new product (admin only)
  addProduct: (product) =>
    handleRequest(api.post("/admin/addproduct", product)),

  // Fetch all products for admin dashboard
  getAdminProducts: () => handleRequest(api.get("/admin/products")),

  // Update product details by ID (admin)
  updateProduct: ({ id, formData }) =>
    handleRequest(api.post(`/admin/product/${id}`, formData)),
  // Delete Product

  deleteProduct: (id) => handleRequest(api.delete(`/admin/product/${id}`)),
  
  // Add a new category (admin)
  addCategory: (cat) => handleRequest(api.post("/admin/newcategory", cat)),

  // Fetch all categories (admin)
  getCategory: () => handleRequest(api.get("/admin/category")),

  // ========================
  // 👤 User APIs
  // ========================

  // Fetch all public products (for users)
  getAllProducts: () => handleRequest(api.get(`/products`)),

  // Fetch a single product by its ID (for product detail page)
  getProductById: (productId) =>
    handleRequest(api.get(`/product/${productId}`)),

  // Fetch products by category slug or name
  getProductsByCategory: (category) =>
    handleRequest(api.get(`/products/category/${category}`)),

  // Fetch available categories (for filters, dropdowns, etc.)
  getCategories: () => handleRequest(api.get(`/products/categories`))
};

export default ProductServices;
