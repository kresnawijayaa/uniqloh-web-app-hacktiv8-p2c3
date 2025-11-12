import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Vite
  // kalau proyekmu Vue CLI: process.env.VUE_APP_API_URL
});

// auto-attach token kalau ada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
