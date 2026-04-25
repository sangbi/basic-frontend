import { apiClient } from "./client";
import type {
  ApiResponse,
  CodeGroupResponse,
  CodeResponse,
  CreateCodeGroupRequest,
  UpdateCodeGroupRequest,
  CreateCodeRequest,
  UpdateCodeRequest,
} from "../../types";

export async function getCodeGroups() {
  const response = await apiClient.get<ApiResponse<CodeGroupResponse[]>>(
    "/admin/codes/groups",
  );
  return response.data;
}

export async function createCodeGroup(payload: CreateCodeGroupRequest) {
  const response = await apiClient.post<ApiResponse<string>>(
    "/admin/codes/groups",
    payload,
  );
  return response.data;
}

export async function updateCodeGroup(
  id: number,
  payload: UpdateCodeGroupRequest,
) {
  const response = await apiClient.put<ApiResponse<string>>(
    `/admin/codes/groups/${id}`,
    payload,
  );
  return response.data;
}

export async function getCodes() {
  const response =
    await apiClient.get<ApiResponse<CodeResponse[]>>("/admin/codes");
  return response.data;
}

export async function getCodesByGroupCode(groupCode: string) {
  const response = await apiClient.get<ApiResponse<CodeResponse[]>>(
    `/admin/codes/group/${groupCode}`,
  );
  return response.data;
}

export async function createCode(payload: CreateCodeRequest) {
  const response = await apiClient.post<ApiResponse<string>>(
    "/admin/codes",
    payload,
  );
  return response.data;
}

export async function updateCode(id: number, payload: UpdateCodeRequest) {
  const response = await apiClient.put<ApiResponse<string>>(
    `/admin/codes/${id}`,
    payload,
  );
  return response.data;
}
