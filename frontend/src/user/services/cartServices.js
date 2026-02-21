import api from "../../shared/interceptor";

const handleRequest = async (method, url, data = null) => {
  try {
    const response = await api[method](url, data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

const CartServices = {
  // Add product to cart
  // Endpoint: POST /cart
  addToCart: (productId) => 
    handleRequest("post", "/cart", { productId }),

  // Get cart details
  // Endpoint: GET /cart
  getCart: () => 
    handleRequest("get", "/cart"),

  // Update quantity of product in cart
  // Endpoint: PUT /cart
  updateQuantity: (payload) => 
    handleRequest("put", "/cart", payload),

  // Remove product from cart
  // Endpoint: DELETE /cart/:_id
  removeFromCart: (itemId) => 
    handleRequest("delete", `/cart/${itemId}`)
};

export default CartServices;