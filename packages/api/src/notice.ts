import { apiClient } from "./client";
import type {
  ApiResponse,
  NoticeResponse,
  CreateNoticeRequest,
  UpdateNoticeRequest,
  PageRequest,
  NoticeSearchCondition,
} from "../../types";

export async function getNotices(payload: PageRequest<NoticeSearchCondition>) {
  const response = await apiClient.get("/admin/notices", {
    params: {
      page: payload.page,
      size: payload.size,
      title: payload.condition?.title || undefined,
    },
  });
  return response.data;
}

export async function getNotice(id: number) {
  const response = await apiClient.get<ApiResponse<NoticeResponse>>(
    `/admin/notices/${id}`,
  );
  return response.data;
}

export async function createNotice(payload: CreateNoticeRequest) {
  const response = await apiClient.post<ApiResponse<number>>(
    "/admin/notices",
    payload,
  );
  return response.data;
}

export async function updateNotice(id: number, payload: UpdateNoticeRequest) {
  const response = await apiClient.put<ApiResponse<string>>(
    `/admin/notices/${id}`,
    payload,
  );
  return response.data;
}

export async function deleteNotice(id: number) {
  const response = await apiClient.delete<ApiResponse<string>>(
    `/admin/notices/${id}`,
  );

  return response.data;
}
