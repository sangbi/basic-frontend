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
  const response = await apiClient.get<
    ApiResponse<PageResponse<UserListResponse>>
  >("/user/search", {
    params: {
      page: payload.page,
      size: payload.size,
      "condition.userId": payload.condition?.userId,
    },
  });

  return response.data;
}

export async function infoUser(userId: string) {
  const response = await apiClient.get<ApiResponse<User>>(
    `/user/info/${userId}`,
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
  const response = await apiClient.put<ApiResponse<string>>(
    "/user/update",
    payload,
  );

  return response.data;
}

export async function deleteUser(userId: string) {
  const response = await apiClient.delete<ApiResponse<string>>(
    `/user/delete/${userId}`,
  );

  return response.data;
}
