"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { setupInterceptors } from "@repo/api";
import { appTheme } from "@repo/theme";
import { FeedbackProvider } from "@repo/ui";
import { ReactNode } from "react";

import { setTokenStorageAdapter, webTokenStorage } from "@repo/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WebHeader } from "@/components/layout/WebHeader";
import { useAppAuthGuard } from "@/features/auth/useAppAuthGuard";

setupInterceptors();
setTokenStorageAdapter(webTokenStorage);

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  const { me } = useAppAuthGuard({
    requiredRoles: ["USER", "ADMIN"],
    redirectTo: "/",
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <WebHeader userId={me?.userId} />
        <FeedbackProvider>{children}</FeedbackProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
