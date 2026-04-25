import { apiClient } from "./client";
import type {
  ApiResponse,
  NoticeResponse,
  CreateNoticeRequest,
  UpdateNoticeRequest,
} from "../../types";

export async function getNotices() {
  const response =
    await apiClient.get<ApiResponse<NoticeResponse[]>>("/admin/notices");
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
