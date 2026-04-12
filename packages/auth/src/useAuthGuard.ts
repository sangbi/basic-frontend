"use client";

import { useEffect, useState } from "react";
import { tokenStorage } from "./token";
import { hasRequiredRole, type UserRole } from "./roles";
import type { AuthGuardOptions } from "./guard";

type Me = {
  userId: string;
  role: string;
};

type Dependencies = {
  getMe: () => Promise<{ data: Me }>;
  routerReplace: (path: string) => void;
  clearToken?: () => void;
};

type Result = {
  loading: boolean;
  me: Me | null;
  authorized: boolean;
};

export function createUseAuthGuard(deps: Dependencies) {
  return function useAuthGuard(options: AuthGuardOptions = {}): Result {
    const { requiredRoles, redirectTo = "/login" } = options;

    const [loading, setLoading] = useState(true);
    const [me, setMe] = useState<Me | null>(null);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
      let mounted = true;

      const initialize = async () => {
        const accessToken = tokenStorage.getAccessToken();

        if (!accessToken) {
          deps.routerReplace(redirectTo);
          return;
        }

        try {
          const result = await deps.getMe();

          if (!mounted) return;

          const user = result.data;
          const passed = hasRequiredRole(
            user.role,
            requiredRoles as UserRole[] | undefined,
          );

          if (!passed) {
            deps.clearToken?.();
            deps.routerReplace(redirectTo);
            return;
          }

          setMe(user);
          setAuthorized(true);
        } catch (error) {
          console.error(error);
          deps.clearToken?.();
          if (!mounted) return;
          deps.routerReplace(redirectTo);
        } finally {
          if (!mounted) return;
          setLoading(false);
        }
      };

      initialize();

      return () => {
        mounted = false;
      };
    }, [redirectTo, JSON.stringify(requiredRoles)]);

    return {
      loading,
      me,
      authorized,
    };
  };
}
