import axios from "axios";

const API_URL = "http://localhost:5000/api";

const ProductServices = {
  getAllProducts: async () => {
    return await axios.get(`${API_URL}/products`);
  },
  getProductById: async (productId) => {
    return await axios.get(`${API_URL}/product/${productId}`);
  },
  getProductByCategory: async (category) => {
    return await axios.get(`${API_URL}/products/category/${category}`);
  },
  getCategory: async () => {
    return await axios.get(`${API_URL}/products/categories`);
  },
};

export default ProductServices;
