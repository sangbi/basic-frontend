"use client";

import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material";

export function AppButton(props: ButtonProps) {
  return <Button variant="contained" {...props} />;
}
