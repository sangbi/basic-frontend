"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMyMenuPermissions } from "@repo/api";
import type { MyMenuPermissionResponse } from "@repo/types";

type PermissionContextValue = {
  loading: boolean;
  permissions: MyMenuPermissionResponse[];
  getPermission: (path: string) => MyMenuPermissionResponse | undefined;
  canRead: (path: string) => boolean;
  canCreate: (path: string) => boolean;
  canUpdate: (path: string) => boolean;
  canDelete: (path: string) => boolean;
};

const PermissionContext = createContext<PermissionContextValue | null>(null);

export function PermissionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [permissions, setPermissions] = useState<MyMenuPermissionResponse[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await getMyMenuPermissions();
        setPermissions(result.data);
      } catch (error) {
        console.error(error);
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const permissionMap = useMemo(() => {
    const map = new Map<string, MyMenuPermissionResponse>();

    permissions.forEach((row) => {
      if (row.menuPath) {
        map.set(row.menuPath, row);
      }

      if (row.apiPath) {
        map.set(row.apiPath, row);
      }
    });

    return map;
  }, [permissions]);

  const value = useMemo<PermissionContextValue>(() => {
    const getPermission = (path: string) => permissionMap.get(path);

    return {
      loading,
      permissions,
      getPermission,
      canRead: (path: string) => getPermission(path)?.canRead === "Y",
      canCreate: (path: string) => getPermission(path)?.canCreate === "Y",
      canUpdate: (path: string) => getPermission(path)?.canUpdate === "Y",
      canDelete: (path: string) => getPermission(path)?.canDelete === "Y",
    };
  }, [loading, permissions, permissionMap]);

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissionContext() {
  const context = useContext(PermissionContext);

  if (!context) {
    throw new Error(
      "usePermissionContext must be used within PermissionProvider",
    );
  }

  return context;
}
