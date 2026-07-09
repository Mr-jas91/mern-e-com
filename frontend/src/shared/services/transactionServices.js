import api from "../interceptor";
export const transaction = {
  getTransaction: async () => await api.get("/admin/transactions"),
  updatePaymentStatus: async (payload) => await api.put(`/admin/transaction/${payload.transactionId}`, { paymentMethod: payload.paymentMethod, paymentStatus: payload.paymentStatus})
};
