export interface User {
  id: number;
  userId: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  userNm: string;
  email: string;
  lastLoginAt: Date;
  roleId: number;
  roleCode: string;
}
export interface UserSearchCondition {
  userId: string;
}

export interface UserListResponse {
  id: number;
  userId: string;
  roleId: number;
  roleCode: string;
  status: string;
}

export interface UserCreateCondition {
  userId: string;
  password: string;
  roleId: number;
  userNm: string;
  email: string;
}

export interface UserUpdateCondition {
  roleId: number;
  userId: string;
}
