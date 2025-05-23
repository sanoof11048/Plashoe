

// import axios from "axios";

// const axiosAuth = axios.create({
//   baseURL: "http://plashoe.runasp.net/api"
// });

// axiosAuth.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
// export default axiosAuth;

import axios from "axios";

const axiosAuth = axios.create({
  baseURL: "/api/proxy"
});

axiosAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosAuth;


// >>>>>>> 8ba31eefe9bb0b3b77c489ebabe5fde817c4117c
