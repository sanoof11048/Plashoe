import axios from "axios";

const axiosAuth = axios.create({
  baseURL: import.meta.env.DEV
    ? "http://plashoe.runasp.net/api"
    : "/proxy"
});


axiosAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default axiosAuth;