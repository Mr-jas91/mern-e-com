import api from "../../shared/interceptor.js";

const orderServices = {
  /**
   * Create a new order.
   * Endpoint: POST /createorder
   */
  createOrder: async (orderData) => {
    const response = await api.post("/createorder", orderData);
    return response.data;
  },

  /**
   * Get all orders of the logged-in user.
   * Endpoint: GET /myorders
   */
  getMyOrders: async () => {
    const response = await api.get("/myorders");
    return response.data;
  },

  /**
   * Get details of a specific order item.
   * Endpoint: GET /myorder/:orderId/:orderItemId
   */
  getOrderDetails: async (orderId, orderItemId) => {
    const response = await api.get(`/myorder/${orderId}/${orderItemId}`);
    return response.data;
  },

  /**
   * Cancel a specific order item.
   * Endpoint: PUT /myorder/:orderId/:orderItemId
   */
  cancelOrder: async (orderId, orderItemId) => {
    const response = await api.put(`/myorder/${orderId}/${orderItemId}`);
    return response.data;
  }
};

export default orderServices;