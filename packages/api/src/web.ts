import type {
  ApiResponse,
  AttachmentResponse,
  NoticeResponse,
  NoticeSearchCondition,
  PageRequest,
  PageResponse,
  ResourceResponse,
  ResourceSearchCondition,
  WebMenuResponse,
} from "../../types";
import { apiClient } from "./client";

export async function searchWebNotices(
  payload: PageRequest<NoticeSearchCondition>,
) {
  const response = await apiClient.get<
    ApiResponse<PageResponse<NoticeResponse>>
  >("/web/notices", {
    params: {
      page: payload.page,
      size: payload.size,
      title: payload.condition?.title || undefined,
    },
  });

  return response.data;
}

export async function getWebNotice(id: number) {
  const response = await apiClient.get<ApiResponse<NoticeResponse>>(
    `/web/notices/${id}`,
  );

  return response.data;
}

export async function searchWebResources(
  payload: PageRequest<ResourceSearchCondition>,
) {
  const response = await apiClient.get<
    ApiResponse<PageResponse<ResourceResponse>>
  >("/web/resources", {
    params: {
      page: payload.page,
      size: payload.size,
      title: payload.condition?.title || undefined,
    },
  });

  return response.data;
}

export async function getWebResource(id: number) {
  const response = await apiClient.get<ApiResponse<ResourceResponse>>(
    `/web/resources/${id}`,
  );

  return response.data;
}

export async function getWebAttachmentsByTarget(
  targetType: string,
  targetId: number,
) {
  const response = await apiClient.get<ApiResponse<AttachmentResponse[]>>(
    "/web/attachments/target",
    {
      params: { targetType, targetId },
    },
  );

  return response.data;
}

export async function getWebMenus() {
  const response =
    await apiClient.get<ApiResponse<WebMenuResponse[]>>("/web/menus");
  return response.data;
}
