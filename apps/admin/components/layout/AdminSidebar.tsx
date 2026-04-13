"use client";

import { useEffect, useState } from "react";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Box,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import type { AdminMyMenuTreeResponse } from "@repo/types";
import { getMyAdminMenus } from "@repo/api";

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [menus, setMenus] = useState<AdminMyMenuTreeResponse[]>([]);
  const [openMap, setOpenMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getMyAdminMenus();
        setMenus(result.data);
      } catch (error) {
        console.error(error);
      }
    };

    load();
  }, []);

  const toggleOpen = (id: number) => {
    setOpenMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderMenu = (menu: AdminMyMenuTreeResponse, depth = 0) => {
    const hasChildren = menu.children && menu.children.length > 0;
    const open = openMap[menu.id] ?? false;

    return (
      <Box key={menu.id}>
        <ListItemButton
          selected={!!menu.menuPath && pathname === menu.menuPath}
          onClick={() => {
            if (hasChildren) {
              toggleOpen(menu.id);
              return;
            }

            if (menu.menuPath) {
              router.push(menu.menuPath);
            }
          }}
          sx={{ pl: 2 + depth * 2 }}
        >
          <ListItemText primary={menu.menuNm} />
          {hasChildren ? open ? <ExpandLess /> : <ExpandMore /> : null}
        </ListItemButton>

        {hasChildren ? (
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List disablePadding>
              {menu.children.map((child) => renderMenu(child, depth + 1))}
            </List>
          </Collapse>
        ) : null}
      </Box>
    );
  };

  return (
    <Paper
      elevation={0}
      square
      sx={{
        width: 260,
        height: "calc(100vh - 64px)",
        borderRadius: 0,
        borderRight: "1px solid",
        borderColor: "divider",
        overflowY: "auto",
      }}
    >
      <Box py={2}>
        <List>{menus.map((menu) => renderMenu(menu))}</List>
      </Box>
    </Paper>
  );
}
