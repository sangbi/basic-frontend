export interface User {
  id: number;
  userId: string;
  role: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}
export interface UserSearchCondition {
  userId: string;
  role: string;
}

export interface UserListResponse {
  id: number;
  userId: string;
  role: string;
}

export interface UserCreateCondition {
  userId: string;
  password: string;
}

export interface UserUpdateCondition {
  role: string;
  userId: string;
}
