import axios from "axios";
import { getToken, removeToken } from "../utils/auth";

const api = axios.create({
    baseURL: "https://expense-tracker-api.alternatesites.com"
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    if (status === 401 && !url?.includes("/auth/login") && !url?.includes("/auth/register") && !url?.includes("/auth/forgot-password") && !url?.includes("/auth/reset-password")) {
      removeToken();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;