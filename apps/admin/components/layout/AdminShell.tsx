"use client";

import { Box } from "@mui/material";
import { ReactNode } from "react";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";

type Props = {
  children: ReactNode;
  userId?: string;
  role?: string;
};

export function AdminShell({ children, userId, role }: Props) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f7f8fa" }}>
      <AdminHeader userId={userId} role={role} />

      <Box sx={{ display: "flex", height: "calc(100vh - 64px)" }}>
        <AdminSidebar />

        <Box
          sx={{
            flex: 1,
            p: 3,
            overflowY: "auto",
            minWidth: 0,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
