"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { setupInterceptors } from "@repo/api";
import { appTheme } from "@repo/theme";
import { FeedbackProvider } from "@repo/ui";
import { ReactNode } from "react";

import { setTokenStorageAdapter, webTokenStorage } from "@repo/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
