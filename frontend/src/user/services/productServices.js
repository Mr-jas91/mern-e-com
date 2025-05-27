import api from "../../shared/interceptor"

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
  getAllProducts: () => handleRequest(api.get(`/products`)),
  getProductById: (productId) =>
    handleRequest(api.get(`/product/${productId}`)),

  getProductsByCategory: (category) =>
    handleRequest(api.get(`/products/category/${category}`)),

  getCategories: () => handleRequest(api.get(`/products/categories`))
};

export default ProductServices;
