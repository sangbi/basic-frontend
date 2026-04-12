export interface LoginHistoryResponse {
  id: number;
  userId: string;
  loginResult: string;
  loginAt: string;
  logoutAt: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  failReason: string | null;
  sessionKey: string | null;
}

export interface UserSessionResponse {
  id: number;
  userId: string;
  sessionKey: string;
  ipAddress: string | null;
  userAgent: string | null;
  loginAt: string;
  lastAccessAt: string;
  logoutAt: string | null;
  status: string;
  expiresAt: string | null;
}

export interface ActivityLogResponse {
  id: number;
  userId: string | null;
  actionType: string;
  httpMethod: string | null;
  requestUri: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  responseCode: string | null;
  requestBodySummary: string | null;
  createdAt: string;
}

export interface AdminDashboardSummaryResponse {
  todayLoginSuccessCount: number;
  todayLoginFailCount: number;
  activeSessionCount: number;
  todayActivityLogCount: number;
}

export interface RoleResponse {
  id: number;
  roleCode: string;
  roleNm: string;
  description: string | null;
  status: string;
}

export interface MenuResponse {
  id: number;
  menuNm: string;
  menuPath: string | null;
  apiPath: string | null;
  parentId: number | null;
  sortOrder: number;
  icon: string | null;
  visibleYn: string;
  status: string;
}

export interface MenuRoleResponse {
  id: number;
  menuId: number;
  menuNm: string;
  roleId: number;
  roleCode: string;
  canRead: string;
  canCreate: string;
  canUpdate: string;
  canDelete: string;
}

export interface UpdateMenuRoleRequest {
  canRead: string;
  canCreate: string;
  canUpdate: string;
  canDelete: string;
}

export interface AdminMenuResponse {
  id: number;
  menuNm: string;
  menuPath: string;
  parentId: string;
  sortOrder: string;
  icon: string;
}

export interface CreateRoleRequest {
  roleCode: string;
  roleNm: string;
  description: string;
  status: string;
}

export interface UpdateRoleRequest {
  roleNm: string;
  description: string;
  status: string;
}

export interface CreateMenuRequest {
  menuNm: string;
  menuPath: string;
  apiPath: string;
  parentId: number | null;
  sortOrder: number;
  icon: string;
  visibleYn: string;
  status: string;
}

export interface UpdateMenuRequest {
  menuNm: string;
  menuPath: string;
  apiPath: string;
  parentId: number | null;
  sortOrder: number;
  icon: string;
  visibleYn: string;
  status: string;
}
