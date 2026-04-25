import { apiClient } from "./client";
import type {
  ApiResponse,
  AttachmentResponse,
  LinkAttachmentRequest,
} from "../../types";

export async function uploadAttachment(
  file: File,
  onProgress?: (percent: number) => void,
) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<ApiResponse<AttachmentResponse>>(
    "/admin/attachments/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (event) => {
        if (!event.total || !onProgress) return;
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      },
    },
  );

  return response.data;
}

export async function linkAttachment(payload: LinkAttachmentRequest) {
  const response = await apiClient.post<ApiResponse<string>>(
    "/admin/attachments/link",
    payload,
  );
  return response.data;
}

export async function getAttachmentsByTarget(
  targetType: string,
  targetId: number,
) {
  const response = await apiClient.get<ApiResponse<AttachmentResponse[]>>(
    "/admin/attachments/target",
    {
      params: { targetType, targetId },
    },
  );

  return response.data;
}

export async function unlinkAttachment(payload: {
  attachmentId: number;
  targetType: string;
  targetId: number;
}) {
  const response = await apiClient.delete<ApiResponse<string>>(
    "/admin/attachments/unlink",
    {
      params: {
        attachmentId: payload.attachmentId,
        targetType: payload.targetType,
        targetId: payload.targetId,
      },
    },
  );
  return response.data;
}

export async function downloadAttachmentFile(id: number) {
  const response = await apiClient.get(`/admin/attachments/${id}/download`, {
    responseType: "blob",
  });

  const contentDisposition = response.headers["content-disposition"];
  let fileName = `attachment-${id}`;

  if (contentDisposition) {
    const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
    const normalMatch = contentDisposition.match(/filename="?([^"]+)"?/i);

    if (utf8Match?.[1]) {
      fileName = decodeURIComponent(utf8Match[1]);
    } else if (normalMatch?.[1]) {
      fileName = normalMatch[1];
    }
  }

  return {
    blob: response.data as Blob,
    fileName,
  };
}

export async function viewAttachmentFile(id: number) {
  const response = await apiClient.get(`/admin/attachments/${id}/view`, {
    responseType: "blob",
  });

  return response.data as Blob;
}

export async function deleteAttachmentFromTarget(payload: {
  attachmentId: number;
  targetType: string;
  targetId: number;
}) {
  const response = await apiClient.delete<ApiResponse<string>>(
    "/admin/attachments/delete",
    {
      params: {
        attachmentId: payload.attachmentId,
        targetType: payload.targetType,
        targetId: payload.targetId,
      },
    },
  );

  return response.data;
}
