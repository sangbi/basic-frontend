import { apiClient } from "./client";
import type {
  ApiResponse,
  ResourceResponse,
  CreateResourceRequest,
  UpdateResourceRequest,
  PageRequest,
  ResourceSearchCondition,
} from "../../types";

export async function getResources(
  payload: PageRequest<ResourceSearchCondition>,
) {
  const response = await apiClient.get("/admin/resources", {
    params: {
      page: payload.page,
      size: payload.size,
      title: payload.condition?.title || undefined,
    },
  });
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
