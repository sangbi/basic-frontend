import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { setTokenStorageAdapter } from "@repo/auth";
import { setupMobileInterceptors } from "@/src/lib/setupMobileInterceptors";

setTokenStorageAdapter({
  getAccessToken: () => {
    throw new Error("mobile uses async storage");
  },
  setAccessToken: () => {},
  removeAccessToken: () => {},
  clear: () => {},
});

export const unstable_settings = {
  anchor: "(tabs)",
};
setupMobileInterceptors();
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
