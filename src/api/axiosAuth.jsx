// src/api/axiosAuth.js
import axios from "axios";

const axiosAuth = axios.create({
  baseURL: "http://plashoe.runasp.net/api"
});

// Automatically add token to every request
axiosAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosAuth;
