import axios from "axios";
import authService from "./authService";

let accessToken: string | null = null;
let isRefreshing = false;
let refreshQueue: (() => void)[] = [];

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",
  withCredentials: true,
});

// set initial token
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// request interceptor
api.interceptors.request.use(config => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// response interceptor
api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    // got 
    if (
      err.response?.status === 401 ||
      (err.response?.status === 403 &&
        !originalRequest._retry &&
        originalRequest.headers?.Authorization)
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const data = await authService.refreshToken();
          accessToken = data.accessToken;
          setAccessToken(accessToken);
          refreshQueue.forEach((cb) => cb());
          refreshQueue = [];
        } catch (e) {
          refreshQueue = [];
          throw e;
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        refreshQueue.push(async () => {
          try {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            const response = await api(originalRequest);
            resolve(response);
          } catch (err) {
            reject(err);
          }
        });
      });
      
    }

    return Promise.reject(err);
  }
);

export default api;
