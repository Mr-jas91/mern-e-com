import api from "../../shared/interceptor";

const createOrder = async (orderData) => {
  return await api.post("/createorder", orderData);
};

const getMyOrders = async () => {
  return await api.get("/myorders");
};

const getOrderDetails = async (orderId) => {
  return await api.get(`/myorder/${orderId}`);
};
const cancelOrder = async (orderId) => {
  return await api.put(`/myorder/${orderId}`);
};
const orderServices = {
  createOrder,
  getMyOrders,
  getOrderDetails,
  cancelOrder
};

export default orderServices;
