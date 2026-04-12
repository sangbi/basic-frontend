"use client";

import { Box, Typography } from "@mui/material";

type Props = {
  label: string;
  value?: string | number;
};

export function InfoRow({ label, value }: Props) {
  return (
    <Box display="flex">
      <Box width={140}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Box>

      <Box flex={1}>
        <Typography variant="body1">{value ?? "-"}</Typography>
      </Box>
    </Box>
  );
}
