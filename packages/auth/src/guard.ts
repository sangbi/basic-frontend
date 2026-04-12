import { UserRole } from "./roles";

export type AuthGuardOptions = {
  requiredRoles?: UserRole[];
  redirectTo?: string;
};
