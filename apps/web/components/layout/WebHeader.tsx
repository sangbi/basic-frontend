"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Divider,
  MenuItem,
  MenuList,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { getWebMenus, logout } from "@repo/api";
import type { WebMenuResponse } from "@repo/types";
import { tokenStorage } from "@repo/auth";
import { useRouter } from "next/navigation";

type Props = {
  userId?: string;
};

export function WebHeader({ userId }: Props) {
  const router = useRouter();
  const [menus, setMenus] = useState<WebMenuResponse[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    getWebMenus().then((result) => setMenus(result.data));
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    } finally {
      tokenStorage.clear();
      router.replace("/");
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="default"
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Toolbar
        sx={{
          maxWidth: 1200,
          width: "100%",
          mx: "auto",
          minHeight: 64,
          display: "flex",
          justifyContent: "space-between",
          gap: 4,
        }}
      >
        <Typography
          component={Link}
          href="/"
          variant="h6"
          fontWeight={800}
          sx={{
            textDecoration: "none",
            color: "text.primary",
            display: "inline-flex",
            alignItems: "center",
            letterSpacing: "-0.02em",
            flexShrink: 0,
          }}
        >
          Basic
        </Typography>

        <Box
          component="nav"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            flex: 1,
          }}
        >
          {menus.map((menu) => {
            const hasChildren = menu.children.length > 0;

            return (
              <Box
                key={menu.id}
                sx={{ position: "relative" }}
                onMouseEnter={() => setHoveredId(menu.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Button
                  component={menu.menuPath ? Link : "button"}
                  href={menu.menuPath || undefined}
                  color="inherit"
                  disableRipple
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: 600,
                    color: "text.secondary",
                    "&:hover": {
                      bgcolor: "action.hover",
                      color: "text.primary",
                    },
                  }}
                >
                  {menu.menuNm}
                </Button>

                {hasChildren && hoveredId === menu.id && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      pt: 1,
                      zIndex: 20,
                    }}
                  >
                    <Paper
                      elevation={8}
                      sx={{
                        minWidth: 200,
                        borderRadius: 2,
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <MenuList dense sx={{ py: 0.75 }}>
                        {menu.children.map((child) => (
                          <MenuItem
                            key={child.id}
                            component={Link}
                            href={child.menuPath ?? "#"}
                            sx={{
                              mx: 0.75,
                              my: 0.25,
                              borderRadius: 1.5,
                              fontSize: 14,
                              fontWeight: 500,
                              color: "text.secondary",
                              "&:hover": {
                                bgcolor: "action.hover",
                                color: "text.primary",
                              },
                            }}
                          >
                            {child.menuNm}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Paper>
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexShrink: 0,
          }}
        >
          {userId && (
            <>
              <Typography variant="body2" color="text.secondary">
                {userId}
              </Typography>

              <Divider orientation="vertical" flexItem />

              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                로그아웃
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
