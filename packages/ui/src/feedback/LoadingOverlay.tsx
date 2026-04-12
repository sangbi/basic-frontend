"use client";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

type Props = {
  open: boolean;
};

export function LoadingOverlay({ open }: Props) {
  return (
    <Backdrop
      open={open}
      sx={(theme) => ({
        color: "#fff",
        zIndex: theme.zIndex.drawer + 200,
      })}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
