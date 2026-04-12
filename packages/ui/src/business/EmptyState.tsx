"use client";

import { Box, Typography } from "@mui/material";

type Props = {
  message?: string;
};

export function EmptyState({ message = "데이터가 없습니다." }: Props) {
  return (
    <Box
      py={6}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
