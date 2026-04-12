"use client";

import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

type Props = {
  title?: string;
  children: ReactNode;
};

export function FormSection({ title, children }: Props) {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {title ? (
        <Typography variant="subtitle1" fontWeight={700}>
          {title}
        </Typography>
      ) : null}
      <Box display="flex" flexDirection="column" gap={2}>
        {children}
      </Box>
    </Box>
  );
}
