import { apiClient } from "./client";
import {
  type ApiResponse,
  type LoginHistoryResponse,
  type UserSessionResponse,
  type ActivityLogResponse,
  AdminDashboardSummaryResponse,
  RoleResponse,
  MenuResponse,
  MenuRoleResponse,
  UpdateMenuRoleRequest,
} from "../../types";

export async function getLoginHistories() {
  const response = await apiClient.get<ApiResponse<LoginHistoryResponse[]>>(
    "/admin/login-histories",
  );
  return response.data;
}

export async function getActiveSessions() {
  const response = await apiClient.get<ApiResponse<UserSessionResponse[]>>(
    "/admin/sessions/active",
  );
  return response.data;
}

export async function getActivityLogs() {
  const response = await apiClient.get<ApiResponse<ActivityLogResponse[]>>(
    "/admin/activity-logs",
  );
  return response.data;
}

export async function getAdminDashboardSummary() {
  const response = await apiClient.get<
    ApiResponse<AdminDashboardSummaryResponse>
  >("/admin/dashboard/summary");
  return response.data;
}

export async function getRoles() {
  const response =
    await apiClient.get<ApiResponse<RoleResponse[]>>("/admin/roles");
  return response.data;
}

export async function getMenus() {
  const response =
    await apiClient.get<ApiResponse<MenuResponse[]>>("/admin/menus");
  return response.data;
}

export async function getMenuRoles() {
  const response =
    await apiClient.get<ApiResponse<MenuRoleResponse[]>>("/admin/menu-roles");
  return response.data;
}

export async function updateMenuRole(
  id: number,
  payload: UpdateMenuRoleRequest,
) {
  const response = await apiClient.put<ApiResponse<string>>(
    `/admin/menu-roles/${id}`,
    payload,
  );
  return response.data;
}
