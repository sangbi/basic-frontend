"use client";

import { useRouter } from "next/navigation";
import { createUseAuthGuard, tokenStorage } from "@repo/auth";
import { getMe } from "@repo/api";

export function useAdminAuthGuard(options?: {
  requiredRoles?: ("USER" | "ADMIN")[];
  redirectTo?: string;
}) {
  const router = useRouter();

  const useGuard = createUseAuthGuard({
    getMe,
    routerReplace: (path) => router.replace(path),
    clearToken: () => tokenStorage.clear(),
  });

  return useGuard(options);
}
