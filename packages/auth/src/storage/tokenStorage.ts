import type { TokenStorageAdapter } from "./types";
import { webTokenStorage } from "./webTokenStorage";

let adapter: TokenStorageAdapter = webTokenStorage;

export function setTokenStorageAdapter(nextAdapter: TokenStorageAdapter) {
  adapter = nextAdapter;
}

export const tokenStorage = {
  getAccessToken() {
    return adapter.getAccessToken();
  },

  setAccessToken(token: string) {
    adapter.setAccessToken(token);
  },

  removeAccessToken() {
    adapter.removeAccessToken();
  },

  clear() {
    adapter.clear();
  },

  isLoggedIn() {
    return !!adapter.getAccessToken();
  },
};
