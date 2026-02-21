import api from "../interceptor";

/**
 * Create a new order.
 * @param {Object} orderData - The order details to be created.
 * @returns {Promise} - API response.
 */
const createOrder = async (orderData) => {
  return await api.post("/createorder", orderData);
};

/**
 * Get all orders of the logged-in user.
 * @returns {Promise} - API response with user's orders.
 */
const getMyOrders = async () => {
  return await api.get("/myorders");
};

/**
 * Get details of a specific user order.
 * @param {string} orderId - The ID of the order.
 * @returns {Promise} - API response with order details.
 */
const getOrderDetails = async (orderId) => {
  return await api.get(`/myorder/${orderId}`);
};

/**
 * Cancel a specific user order.
 * @param {string} orderId - The ID of the order to cancel.
 * @returns {Promise} - API response after cancellation.
 */
const cancelOrder = async (orderId) => {
  return await api.put(`/myorder/${orderId}`);
};

/**
 * Get all orders as an admin.
 * @returns {Promise} - API response with all orders.
 */
const getAdminOrders = async () => {
  return await api.get("/admin/orders");
};

/**
 * Get details of a specific order as an admin.
 * @param {string} orderId - The ID of the order.
 * @returns {Promise} - API response with order details.
 */
const getAdminOrderDetails = async (orderId) => {
  return await api.get(`/admin/order/${orderId}`);
};

/**
 * Update the delivery status of an order (admin only).
 * @param {string} orderId - The ID of the order.
 * @returns {Promise} - API response after status update.
 */
const updateDeliveryStatus = async (payload) => {
  console.log(payload);
  return await api.post(`/admin/updatedeliverystatus/`, payload);
};

const acceptOrderItem = async (orderId, itemIndex) => {
  return await api.put(`/admin/accept-order/${orderId}`, { itemIndex });
};

const recentOrders = async () => {
  return await api.get("/admin/recentOrders");
};
// Export all order-related services
const orderServices = {
  createOrder,
  getMyOrders,
  getOrderDetails,
  cancelOrder,
  getAdminOrders,
  getAdminOrderDetails,
  updateDeliveryStatus,
  recentOrders, 
  acceptOrderItem
};

export default orderServices;
