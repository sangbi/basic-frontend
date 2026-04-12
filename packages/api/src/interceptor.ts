import { apiClient } from "./client";
import { tokenStorage } from "../../auth";
import type { ApiResponse, RefreshTokenResponse } from "../../types";

let initialized = false;
let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

function processQueue(token: string | null) {
  pendingQueue.forEach((callback) => callback(token));
  pendingQueue = [];
}

export function setupInterceptors() {
  if (initialized) return;
  initialized = true;

  apiClient.interceptors.request.use((config) => {
    const accessToken = tokenStorage.getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (!error.response) {
        return Promise.reject(error);
      }

      if (error.response.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push((newAccessToken) => {
            if (!newAccessToken) {
              reject(error);
              return;
            }

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response =
          await apiClient.post<ApiResponse<RefreshTokenResponse>>(
            "/auth/refresh",
          );

        const newAccessToken = response.data.data.accessToken;

        tokenStorage.setAccessToken(newAccessToken);
        processQueue(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        tokenStorage.clear();
        processQueue(null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    },
  );
}
