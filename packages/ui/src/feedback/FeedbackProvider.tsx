"use client";

import { Alert, Snackbar } from "@mui/material";
import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import { LoadingOverlay } from "./LoadingOverlay";

type FeedbackSeverity = "success" | "error" | "info" | "warning";

type FeedbackContextValue = {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
  showLoading: () => void;
  hideLoading: () => void;
};

export const FeedbackContext = createContext<FeedbackContextValue | null>(null);

type SnackbarState = {
  open: boolean;
  message: string;
  severity: FeedbackSeverity;
};

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
  });

  const openSnackbar = useCallback(
    (severity: FeedbackSeverity, message: string) => {
      setSnackbar({
        open: true,
        severity,
        message,
      });
    },
    [],
  );

  const value = useMemo<FeedbackContextValue>(
    () => ({
      showSuccess: (message) => openSnackbar("success", message),
      showError: (message) => openSnackbar("error", message),
      showInfo: (message) => openSnackbar("info", message),
      showWarning: (message) => openSnackbar("warning", message),
      showLoading: () => setLoading(true),
      hideLoading: () => setLoading(false),
    }),
    [openSnackbar],
  );

  return (
    <FeedbackContext.Provider value={value}>
      {children}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((prev) => ({
              ...prev,
              open: false,
            }))
          }
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <LoadingOverlay open={loading} />
    </FeedbackContext.Provider>
  );
}
