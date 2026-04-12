"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { appTheme } from "@repo/theme";
import { ReactNode } from "react";
import { setupInterceptors } from "@repo/api";
import { FeedbackProvider } from "@repo/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setTokenStorageAdapter, webTokenStorage } from "@repo/auth";

setupInterceptors();
setTokenStorageAdapter(webTokenStorage);

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <FeedbackProvider>{children}</FeedbackProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
