export interface TokenStorageAdapter {
  getAccessToken(): string | null;
  setAccessToken(token: string): void;
  removeAccessToken(): void;
  clear(): void;
}
