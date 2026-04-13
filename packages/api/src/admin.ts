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
  AdminMenuResponse,
  CreateRoleRequest,
  UpdateRoleRequest,
  CreateMenuRequest,
  UpdateMenuRequest,
  MyMenuPermissionResponse,
  AdminMyMenuTreeResponse,
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

export async function getMyAdminMenus() {
  const response =
    await apiClient.get<ApiResponse<AdminMyMenuTreeResponse[]>>(
      "/admin/menus/me",
    );
  return response.data;
}

export async function getRole(id: number) {
  const response = await apiClient.get<ApiResponse<RoleResponse>>(
    `/admin/roles/${id}`,
  );
  return response.data;
}

export async function createRole(payload: CreateRoleRequest) {
  const response = await apiClient.post<ApiResponse<string>>(
    "/admin/roles",
    payload,
  );
  return response.data;
}

export async function updateRole(id: number, payload: UpdateRoleRequest) {
  const response = await apiClient.put<ApiResponse<string>>(
    `/admin/roles/${id}`,
    payload,
  );
  return response.data;
}

export async function getMenu(id: number) {
  const response = await apiClient.get<ApiResponse<MenuResponse>>(
    `/admin/menus/${id}`,
  );
  return response.data;
}

export async function createMenu(payload: CreateMenuRequest) {
  const response = await apiClient.post<ApiResponse<string>>(
    "/admin/menus",
    payload,
  );
  return response.data;
}

export async function updateMenu(id: number, payload: UpdateMenuRequest) {
  const response = await apiClient.put<ApiResponse<string>>(
    `/admin/menus/${id}`,
    payload,
  );
  return response.data;
}

export async function getMyMenuPermissions() {
  const response =
    await apiClient.get<ApiResponse<MyMenuPermissionResponse[]>>(
      `/admin/menu-roles/me`,
    );
  return response.data;
}
