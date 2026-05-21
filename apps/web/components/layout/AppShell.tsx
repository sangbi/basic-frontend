"use client";

import { Box } from "@mui/material";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function AppShell({ children }: Props) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f7f8fa" }}>
      {/* <AppHeader userId={userId} role={role} /> */}

      <Box sx={{ display: "flex", height: "calc(100vh - 64px)" }}>
        {/* <AppSidebar role={role} /> */}

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
