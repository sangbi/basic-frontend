export interface NoticeSearchCondition {
  title?: string;
}

export interface NoticeResponse {
  id: number;
  title: string;
  content: string;
  noticeType: string;
  status: string;
  pinnedYn: string;
  viewCnt: number;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
}

export interface CreateNoticeRequest {
  title: string;
  content: string;
  noticeType: string;
  status: string;
  pinnedYn: string;
}

export interface UpdateNoticeRequest {
  title: string;
  content: string;
  noticeType: string;
  status: string;
  pinnedYn: string;
}
