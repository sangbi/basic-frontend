export interface ResourceSearchCondition {
  title?: string;
}

export interface ResourceResponse {
  id: number;
  title: string;
  content: string;
  status: string;
  pinnedYn: string;
  viewCnt: number;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
}

export interface CreateResourceRequest {
  title: string;
  content: string;
  status: string;
  pinnedYn: string;
}

export interface UpdateResourceRequest {
  title: string;
  content: string;
  status: string;
  pinnedYn: string;
}
