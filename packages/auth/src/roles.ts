export type UserRole = "USER" | "ADMIN";

export function hasRequiredRole(
  userRole: string | undefined,
  requiredRoles?: UserRole[],
) {
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  if (!userRole) {
    return false;
  }

  return requiredRoles.includes(userRole as UserRole);
}

export function filterMenusByRole<T extends { roles?: UserRole[] }>(
  menus: T[],
  userRole?: string,
) {
  return menus.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true;
    if (!userRole) return false;
    return item.roles.includes(userRole as UserRole);
  });
}
