// src/utils/axiosClient.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://threads.f8team.dev";

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
  (error) => Promise.reject(error),
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
          const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {
            refresh_token: refresh,
          });

          const { accessToken } = res.data.data;
          localStorage.setItem("accessToken", accessToken);

          processQueue(null, accessToken);
          isRefreshing = false;

          originalConfig.headers.Authorization = `Bearer ${accessToken}`;
          return axiosClient(originalConfig);
        } catch (err) {
          processQueue(err, null);
          isRefreshing = false;

          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(err);
        }
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });
    }

    // For other errors, return the full error object so we can access error.response.data
    // Don't just return a string message
    return Promise.reject(error);
  },
);

export const httpRequest = {
  get: (url, params) => axiosClient.get(url, { params }),
  post: (url, body) => axiosClient.post(url, body),
  put: (url, body) => axiosClient.put(url, body),
  delete: (url) => axiosClient.delete(url),
};

export default axiosClient;