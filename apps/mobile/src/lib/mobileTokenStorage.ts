import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "accessToken";

export const mobileTokenStorage = {
  async getAccessToken() {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },

  async setAccessToken(token: string) {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  },

  async removeAccessToken() {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  },

  async clear() {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  },

  async isLoggedIn() {
    const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    return !!token;
  },
};
