export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export type LoginRequest = {
  userId: string;
  password: string;
};

export type AuthUser = {
  userId: string;
  loginId: string;
  name: string;
  role: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type RefreshTokenRequest = {
  refreshToken: string;
};

export type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
};

export type AuthState = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUser | null;
};

export type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;
};

export type MeResponse = {
  userId: string;
  role: string;
};

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
}

export interface PageRequest<T> {
  page: number;
  size: number;
  condition: T;
}
