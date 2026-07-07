import axios from "axios";
import { authStorage } from "../utils/authStorage";

const LOG = (...args) => console.log("[NEXORA-API-CLIENT]", ...args);

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR — log every outgoing request
apiClient.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  LOG("──────────────────────────────────────");
  LOG(`REQUEST: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  LOG("pathname at request time:", window.location.pathname);
  LOG("Authorization header:", token ? `Bearer ${token.slice(0, 30)}...` : "MISSING — no token in localStorage");
  LOG("Full token length:", token?.length ?? "N/A");
  LOG("──────────────────────────────────────");

  return config;
});

// RESPONSE INTERCEPTOR — log every response including errors
apiClient.interceptors.response.use(
  (response) => {
    LOG(`RESPONSE OK: ${response.status} ${response.config?.url}`);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const responseBody = error.response?.data;
    const isCallbackRoute = window.location.pathname.includes("/auth/callback");

    LOG("──────────────────────────────────────");
    LOG(`❌ RESPONSE ERROR: ${status} ${url}`);
    LOG("pathname:", window.location.pathname);
    LOG("isCallbackRoute:", isCallbackRoute);
    LOG("Response body:", JSON.stringify(responseBody));
    LOG("Request Authorization header:", error.config?.headers?.Authorization
      ? `Bearer ${error.config.headers.Authorization.replace("Bearer ", "").slice(0, 30)}...`
      : "MISSING");
    LOG("──────────────────────────────────────");

    if (status === 401 && !isCallbackRoute) {
      LOG("⚠️ 401 detected on non-callback route — calling authStorage.clear() + dispatching nexora:auth-expired");
      console.trace("[NEXORA-API-CLIENT] 401 → authStorage.clear() invocation point");
      authStorage.clear();
      window.dispatchEvent(new Event("nexora:auth-expired"));
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong. Please try again.";

    return Promise.reject({
      status,
      data: responseBody,
      message,
    });
  },
);
