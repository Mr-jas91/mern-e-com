import api from "../../shared/interceptor";

// Helper to handle response cleanly
const handleRequest = async (request) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

const ProductServices = {
  // Fetch all products (supports pagination/filters via query params if needed)
  getAllProducts: (queryParams) => 
    handleRequest(api.get(`/products`, { params: queryParams })),

  // Search products (Matches backend route /product/search)
  searchProducts: (query) => 
    handleRequest(api.get(`/product/search`, { params: { query } })),

  // Fetch a single product by its ID
  getProductById: (productId) => 
    handleRequest(api.get(`/product/${productId}`)),

  // Fetch products by category ID
  getProductsByCategory: (categoryId) => 
    handleRequest(api.get(`/products/category/${categoryId}`)),

  // Fetch all available categories
  getCategories: () => 
    handleRequest(api.get(`/products/categories`))
};

export default ProductServices;