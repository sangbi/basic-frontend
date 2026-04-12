"use client";

import { ReactNode } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { useAdminAuthGuard } from "@/features/auth/useAdminAuthGuard";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { loading, me } = useAdminAuthGuard({
    requiredRoles: ["ADMIN"],
    redirectTo: "/login",
  });

  if (loading) {
    return null;
  }

  return (
    <AdminShell userId={me?.userId} role={me?.role}>
      {children}
    </AdminShell>
  );
}
