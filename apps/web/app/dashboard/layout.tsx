"use client";

import { ReactNode } from "react";
import { useAppAuthGuard } from "@/features/auth/useAppAuthGuard";
import { AppShell } from "@/components/layout/AppShell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { loading, me } = useAppAuthGuard({
    requiredRoles: ["USER", "ADMIN"],
    redirectTo: "/login",
  });

  if (loading) {
    return null;
  }

  return (
    <AppShell userId={me?.userId} role={me?.role}>
      {children}
    </AppShell>
  );
}
