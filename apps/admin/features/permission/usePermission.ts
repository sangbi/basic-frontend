"use client";

import { usePermissionContext } from "./PermissionProvider";

export function usePermission(path: string) {
  const context = usePermissionContext();

  return {
    loading: context.loading,
    permission: context.getPermission(path),
    canRead: context.canRead(path),
    canCreate: context.canCreate(path),
    canUpdate: context.canUpdate(path),
    canDelete: context.canDelete(path),
  };
}
