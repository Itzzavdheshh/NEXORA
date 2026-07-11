import axios from "axios";
import { authStorage } from "../utils/authStorage";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStorage.clear();
      window.dispatchEvent(new Event("nexora:auth-expired"));
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong. Please try again.";

    return Promise.reject({
      status: error.response?.status,
      data: error.response?.data,
      message,
    });
  },
);
