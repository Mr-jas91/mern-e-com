import api from "../interceptor";

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
  },

  // Get all orders as an admin.
  getAdminOrders: async () => {
    const response = await api.get("/admin/orders");
    return response.data;
  },
  // Get details of a specific order as an admin.
  getAdminOrderDetails: async (orderId) => {
    const response = await api.get(`/admin/order/${orderId}`);
    return response.data
  },
  // Update Delivery Status
  updateDeliveryStatus: async (payload) => {
    const response = await api.post(`/admin/updatedeliverystatus/`, payload);
    return response.data
  },
  // Accept Order
  acceptOrderItem: async (payload) => {
    const response = await api.put(`/admin/accept-order/${payload.orderId}`, {itemId:payload.itemId});
    return response.data
  },
  // See recent Order
  recentOrders: async () => {
    const response = await api.get("/admin/recentOrders");
    return response.data
  }
};

export default orderServices;
