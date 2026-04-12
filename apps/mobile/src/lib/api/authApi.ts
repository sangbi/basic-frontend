import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  MeResponse,
} from "@repo/types";
import { mobileApiClient } from "../mobileApiClient";

export async function mobileLogin(payload: LoginRequest) {
  const response = await mobileApiClient.post<ApiResponse<LoginResponse>>(
    "/auth/login",
    payload,
  );
  return response.data;
}

export async function mobileGetMe() {
  const response =
    await mobileApiClient.get<ApiResponse<MeResponse>>("/auth/me");
  return response.data;
}

export async function mobileLogout() {
  const response =
    await mobileApiClient.post<ApiResponse<string>>("/auth/logout");
  return response.data;
}
