"use client";

import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { logout } from "@repo/api";
import { tokenStorage } from "@repo/auth";
import { useRouter } from "next/navigation";

type Props = {
  userId?: string;
  role?: string;
};

export function AdminHeader({ userId, role }: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    } finally {
      tokenStorage.clear();
      router.replace("/login");
    }
  };

  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" fontWeight={700}>
          Admin Console
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2">
            {userId ? `${userId} (${role})` : "게스트"}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            로그아웃
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
