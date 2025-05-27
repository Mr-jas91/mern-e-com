import api from "../../shared/interceptor";
import { setAdminToken, setRefreshToken } from "../../shared/token";

const AdminServices = {
  register: async (formData) => {
    const res = await api.post("/admin/register", formData);
    const { accessToken, refreshToken } = res.data?.data;
    setAdminToken(accessToken);
    setRefreshToken(refreshToken);
    return res;
  },
  login: async (formData) => {
    const res = await api.post("/admin/login", formData);
    const { accessToken, refreshToken } = res.data?.data;
    setAdminToken(accessToken);
    setRefreshToken(refreshToken);
    return res;
  },
  logout: async () => {
    return await api.get("/admin/logout");
  },
  getCurrentAdmin: async () => {
    const res = await api.get("/admin/auth");
    const { accessToken, refreshToken } = res.data?.data;
    setAdminToken(accessToken);
    setRefreshToken(refreshToken);
    return res;
  },
  adminProfile: async () => {
    return await api.get("/admin/profile");
  }
};

export default AdminServices;
