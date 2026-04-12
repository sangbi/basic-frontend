"use client";

import { ADMIN_MENU_ITEMS } from "@/features/navigation/menu";
import { Box, List, ListItemButton, ListItemText, Paper } from "@mui/material";
import { filterMenusByRole } from "@repo/auth";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  role?: string;
};

export function AdminSidebar({ role }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const HEADER_HEIGHT = 64;

  const menus = filterMenusByRole(ADMIN_MENU_ITEMS, role);

  return (
    <Paper
      elevation={0}
      square
      sx={{
        width: 240,
        height: "calc(100vh - " + `${HEADER_HEIGHT}` + "px)",
        borderRadius: 0,
        borderRight: "1px solid",
        borderColor: "divider",
        overflowY: "auto",
      }}
    >
      <Box py={2}>
        <List>
          {menus.map((menu) => (
            <ListItemButton
              key={menu.path}
              selected={pathname === menu.path}
              onClick={() => router.push(menu.path)}
            >
              <ListItemText primary={menu.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Paper>
  );
}
