import type { TokenStorageAdapter } from "./types";

const ACCESS_TOKEN_KEY = "accessToken";

export const webTokenStorage: TokenStorageAdapter = {
  getAccessToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken(token: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  removeAccessToken() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  clear() {
    this.removeAccessToken();
  },
};
