export interface AttachmentResponse {
  id: number;
  originalFileNm: string;
  contentType: string | null;
  fileSize: number;
  url: string;
}

export interface LinkAttachmentRequest {
  attachmentId: number;
  targetType: string;
  targetId: number;
  sortOrder: number;
}
