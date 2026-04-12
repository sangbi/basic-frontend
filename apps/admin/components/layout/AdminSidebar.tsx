"use client";
"use client";

import { useEffect, useState } from "react";
import { Box, List, ListItemButton, ListItemText, Paper } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { getAdminMenus } from "@repo/api";
import type { AdminMenuResponse } from "@repo/types";

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [menus, setMenus] = useState<AdminMenuResponse[]>([]);
  const HEADER_HEIGHT = 64;

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getAdminMenus();
        setMenus(result.data);
      } catch (error) {
        console.error(error);
      }
    };

    load();
  }, []);

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
              key={menu.id}
              selected={pathname === menu.menuPath}
              onClick={() => {
                if (menu.menuPath) {
                  router.push(menu.menuPath);
                }
              }}
            >
              <ListItemText primary={menu.menuNm} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Paper>
  );
}
