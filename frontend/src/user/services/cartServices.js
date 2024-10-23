import axios from "axios";
const API_URI = "http://localhost:5000/api";

const CartServices = {
  // Add product to cart
  addToCart: async (productId, accessToken) => {
    return await axios.post(
      `${API_URI}/cart`,
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
    const res = await axios.get(`${API_URI}/cart`, {
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
      `${API_URI}/cart`,
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
    return await axios.delete(`${API_URI}/cart`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: { productId }, 
    });
  },
};

export default CartServices;
