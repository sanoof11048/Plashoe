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
  baseURL: "/api/proxy?path=" // Make sure it's pointing to the correct serverless route
});

// Request interceptor to add authorization header
axiosAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");  // Retrieve token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("Token added to request headers:", config.headers.Authorization);
  return config;
});

export default axiosAuth;


