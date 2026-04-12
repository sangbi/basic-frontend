import { UserRole } from "@repo/auth";

export type MenuItem = {
  label: string;
  path: string;
  roles?: UserRole[];
};

export const ADMIN_MENU_ITEMS: MenuItem[] = [
  {
    label: "대시보드",
    path: "/dashboard",
    roles: ["ADMIN"],
  },
  {
    label: "사용자 관리",
    path: "/dashboard/users",
    roles: ["ADMIN"],
  },
  {
    label: "로그인 이력",
    path: "/dashboard/login-histories",
    roles: ["ADMIN"],
  },
  {
    label: "활성 세션",
    path: "/dashboard/sessions",
    roles: ["ADMIN"],
  },
  {
    label: "활동 로그",
    path: "/dashboard/activity-logs",
    roles: ["ADMIN"],
  },
  {
    label: "역할 관리",
    path: "/dashboard/roles",
    roles: ["ADMIN"],
  },
  {
    label: "메뉴 관리",
    path: "/dashboard/menus",
    roles: ["ADMIN"],
  },
  {
    label: "메뉴 권한 관리",
    path: "/dashboard/menu-roles",
    roles: ["ADMIN"],
  },
];
