"use client";

import { Box, Paper } from "@mui/material";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  actions?: ReactNode;
};

export function SearchPanel({ children, actions }: Props) {
  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box>{children}</Box>
        {actions ? (
          <Box display="flex" justifyContent="flex-end" gap={1}>
            {actions}
          </Box>
        ) : null}
      </Box>
    </Paper>
  );
}
