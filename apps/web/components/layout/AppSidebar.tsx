"use client";

import { Box, List, ListItemButton, ListItemText, Paper } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { MENU_ITEMS } from "@/features/navigation/menu";

type Props = {
  role?: string;
};

export function AppSidebar({ role }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const HEADER_HEIGHT = 64;

  const menus = MENU_ITEMS.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true;
    if (!role) return false;
    return item.roles.includes(role);
  });

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
