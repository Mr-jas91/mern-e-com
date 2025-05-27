import api from "../../shared/interceptor";

const handleRequest = async (
  method,
  data = null,
  url = "/cart",
  config = {}
) => {
  try {
    const response = await api[method](
      url,
      data ? { ...data, ...config } : config // Spread data correctly
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

const CartServices = {
  // Add product to cart
  addToCart: (productId) => handleRequest("post", { productId }),

  // Get cart details
  getCart: () => handleRequest("get"),

  // Update quantity of product in cart
  updateCart: (arg) => handleRequest("put", arg),

  // Remove product from cart
  removeFromCart: (productId) => {
    return handleRequest("delete", undefined, `/cart/${productId}`); // Correct url and remove unnecessary data
  }
};

export default CartServices;
