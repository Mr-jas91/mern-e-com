import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const orderServices = {
  createOrder: async (orderItems, shippingAddress, orderPrice, accessToken) => {
    return await axios.post(
      `${API_URL}/createorder`,
      {
        orderItems,
        shippingAddress,
        orderPrice
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
  },
  getUserOrderHistory: async (accessToken) => {
    return await axios.get(`${API_URL}/myorders`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  },
  getOrderDetails: async (orderId, accessToken) => {
    return await axios.get(`${API_URL}/myorder/${orderId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }
};

export default orderServices;
