import api from "../interceptor";
export const transection = {
  getTransection: async () => await api.get("/admin/transection")
};
