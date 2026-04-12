"use client";

import { Box, Paper, Typography } from "@mui/material";
import { ReactNode } from "react";

type Props = {
  title?: string;
  children: ReactNode;
};

export function DetailCard({ title, children }: Props) {
  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      {title && (
        <Typography variant="h6" fontWeight={700} mb={2}>
          {title}
        </Typography>
      )}

      <Box display="flex" flexDirection="column" gap={2}>
        {children}
      </Box>
    </Paper>
  );
}
