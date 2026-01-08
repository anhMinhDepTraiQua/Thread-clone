// src/utils/axiosClient.js (hoặc httpRequest.js)
import axios from "axios";
import { navigationService } from "./navigation";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://threads.f8team.dev";

const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// REQUEST INTERCEPTOR
axiosClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => {
    if (error) return p.reject(error);
    p.resolve(token);
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalConfig = error.config;

    // Token expired → refresh
    if (error.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        const refresh = getRefreshToken();
        try {
          const res = await axios.post(`${BASE_URL}/api/auth/refresh-token`, {
            refresh_token: refresh,
          });

          const { access_token, accessToken } = res.data.data || res.data;
          const newToken = access_token || accessToken;

          localStorage.setItem("accessToken", newToken);

          processQueue(null, newToken);
          isRefreshing = false;

          originalConfig.headers.Authorization = `Bearer ${newToken}`;
          return axiosClient(originalConfig);
        } catch (err) {
          processQueue(err, null);
          isRefreshing = false;

          localStorage.clear();
          navigationService.navigateToLogin();
          return Promise.reject(err);
        }
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });
    }

    return Promise.reject(error);
  }
);

// ✅ CẬP NHẬT: Thêm tham số config cho tất cả methods
export const httpRequest = {
  get: (url, params, config) => axiosClient.get(url, { params, ...config }),
  post: (url, body, config) => axiosClient.post(url, body, config), // ← Thêm config
  put: (url, body, config) => axiosClient.put(url, body, config),   // ← Thêm config
  delete: (url, config) => axiosClient.delete(url, config),          // ← Thêm config
};

export default axiosClient;