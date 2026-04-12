import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  MeResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "../../types/src";
import { apiClient } from "./client";

export async function login(payload: LoginRequest) {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    "/auth/login",
    payload,
  );
  return response.data;
}

export async function refreshToken(payload: RefreshTokenRequest) {
  const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
    "/auth/refresh",
    payload,
  );
  return response.data;
}

export async function getMe() {
  const response = await apiClient.get<ApiResponse<MeResponse>>("/auth/me");
  return response.data;
}

export async function logout() {
  const response = await apiClient.post<ApiResponse<string>>("/auth/logout");
  return response.data;
}
