import { apiClient } from "./client";
import type {
  ApiResponse,
  ResourceResponse,
  CreateResourceRequest,
  UpdateResourceRequest,
} from "../../types";

export async function getResources() {
  const response =
    await apiClient.get<ApiResponse<ResourceResponse[]>>("/admin/resources");
  return response.data;
}

export async function getResource(id: number) {
  const response = await apiClient.get<ApiResponse<ResourceResponse>>(
    `/admin/resources/${id}`,
  );
  return response.data;
}

export async function createResource(payload: CreateResourceRequest) {
  const response = await apiClient.post<ApiResponse<number>>(
    "/admin/resources",
    payload,
  );
  return response.data;
}

export async function updateResource(
  id: number,
  payload: UpdateResourceRequest,
) {
  const response = await apiClient.put<ApiResponse<string>>(
    `/admin/resources/${id}`,
    payload,
  );
  return response.data;
}
