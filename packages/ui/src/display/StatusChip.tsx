"use client";

import Chip from "@mui/material/Chip";

type Props = {
  value: string;
};

export function StatusChip({ value }: Props) {
  let color: "default" | "success" | "error" | "warning" = "default";

  if (value === "ACTIVE") color = "success";
  if (value === "INACTIVE") color = "default";
  if (value === "DELETED") color = "error";

  return <Chip label={value} color={color} size="small" />;
}
