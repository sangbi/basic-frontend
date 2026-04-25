import { UserRole } from "@repo/auth";

export type MenuItem = {
  label: string;
  path: string;
  roles?: UserRole[];
};

export const MENU_ITEMS: MenuItem[] = [
  {
    label: "대시보드",
    path: "/dashboard",
    roles: ["USER", "ADMIN"],
  },
  {
    label: "사용자 관리",
    path: "/dashboard/users",
    roles: ["ADMIN"],
  },
  {
    label: "공지사항",
    path: "/dashboard/notices",
    roles: ["USER", "ADMIN"],
  },
  {
    label: "자료실",
    path: "/dashboard/resources",
    roles: ["USER", "ADMIN"],
  },
];
