
import { jwtDecode } from "jwt-decode";

export const isTokenExpired = () => {
   const token = localStorage.getItem("token")
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // current time in seconds
    return decoded.exp < currentTime;
  } catch (err) {
    return true; // If decoding fails, treat token as expired
  }
};
