import axios from "axios";
const API_URL = import.meta.env.API_URL;

const CartServices = {
  // Add product to cart
  addToCart: async (productId, accessToken) => {
    return await axios.post(
      `${API_URL}/cart`,
      { productId },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },

  // Get cart details
  getCart: async (accessToken) => {
    const res = await axios.get(`${API_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // console.log(res)
    return res;
  },

  // Update quantity of product in cart
  updateCart: async (productId, action, accessToken) => {
    return await axios.put(
      `${API_URL}/cart`,
      { productId, action },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },

  // Remove product from cart
  removeFromCart: async (productId, accessToken) => {
    return await axios.delete(`${API_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: { productId }, 
    });
  },
};

export default CartServices;
