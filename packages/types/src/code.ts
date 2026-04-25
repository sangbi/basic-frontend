export interface CodeGroupResponse {
  id: number;
  groupCode: string;
  groupNm: string;
  description: string | null;
  status: string;
}

export interface CodeResponse {
  id: number;
  groupId: number;
  groupCode: string;
  code: string;
  codeNm: string;
  description: string | null;
  sortOrder: number;
  status: string;
  extraValue: string | null;
}

export interface CreateCodeGroupRequest {
  groupCode: string;
  groupNm: string;
  description: string;
  status: string;
}

export interface UpdateCodeGroupRequest {
  groupNm: string;
  description: string;
  status: string;
}

export interface CreateCodeRequest {
  groupId: number;
  code: string;
  codeNm: string;
  description: string;
  sortOrder: number;
  status: string;
  extraValue: string;
}

export interface UpdateCodeRequest {
  codeNm: string;
  description: string;
  sortOrder: number;
  status: string;
  extraValue: string;
}
