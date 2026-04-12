"use client";

import { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

type Props = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, description, actions }: Props) {
  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"flex-start"}
      gap={2}
      mb={3}
    >
      <Box display={"flex"} flexDirection={"row"} gap={1} alignItems={"center"}>
        <Typography variant="h4" fontWeight={700}>
          {title}
        </Typography>
        {description ? (
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {description}
          </Typography>
        ) : null}
      </Box>

      {actions ? <Box>{actions}</Box> : null}
    </Box>
  );
}
