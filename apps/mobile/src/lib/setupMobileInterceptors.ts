import { mobileApiClient } from "./mobileApiClient";
import { mobileTokenStorage } from "./mobileTokenStorage";
import type { ApiResponse, RefreshTokenResponse } from "@repo/types";

let initialized = false;
let isRefreshing = false;
let pendingQueue: ((token: string | null) => void)[] = [];

function processQueue(token: string | null) {
  pendingQueue.forEach((callback) => callback(token));
  pendingQueue = [];
}

export function setupMobileInterceptors() {
  if (initialized) return;
  initialized = true;

  mobileApiClient.interceptors.request.use(async (config) => {
    const accessToken = await mobileTokenStorage.getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });

  mobileApiClient.interceptors.response.use(
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
            resolve(mobileApiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response =
          await mobileApiClient.post<ApiResponse<RefreshTokenResponse>>(
            "/auth/refresh",
          );

        const newAccessToken = response.data.data.accessToken;

        await mobileTokenStorage.setAccessToken(newAccessToken);
        processQueue(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return mobileApiClient(originalRequest);
      } catch (refreshError) {
        await mobileTokenStorage.clear();
        processQueue(null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    },
  );
}
