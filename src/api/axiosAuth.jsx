import axios from "axios";

const axiosAuth = axios.create({
  baseURL: "/api"
});

axiosAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default axiosAuth;