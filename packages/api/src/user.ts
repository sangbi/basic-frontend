import { apiClient } from "./client";
import type {
  ApiResponse,
  PageRequest,
  PageResponse,
  User,
  UserCreateCondition,
  UserListResponse,
  UserSearchCondition,
  UserUpdateCondition,
} from "../../types";

export async function searchUsers(payload: PageRequest<UserSearchCondition>) {
  const response = await apiClient.post<
    ApiResponse<PageResponse<UserListResponse>>
  >("/user/search", payload);

  return response.data;
}

export async function infoUser(payload: { userId: string }) {
  const response = await apiClient.post<ApiResponse<User>>(
    "/user/info",
    payload,
  );

  return response.data;
}

export async function createUser(payload: UserCreateCondition) {
  const response = await apiClient.post<ApiResponse<string>>(
    "/auth/register",
    payload,
  );

  return response.data;
}

export async function updateUser(payload: UserUpdateCondition) {
  const response = await apiClient.post<ApiResponse<string>>(
    "/user/update",
    payload,
  );

  return response.data;
}

export async function deleteUser(payload: { userId: string }) {
  const response = await apiClient.post<ApiResponse<string>>(
    "/user/delete",
    payload,
  );

  return response.data;
}
