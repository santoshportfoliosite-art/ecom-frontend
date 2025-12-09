import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Attach admin token automatically (if exists)
instance.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("admin_token");
  if (adminToken) config.headers.Authorization = `Bearer ${adminToken}`;
  return config;
});

export default instance;
