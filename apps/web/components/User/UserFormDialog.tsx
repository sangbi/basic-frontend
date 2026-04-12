"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { UserForm } from "./UserForm";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  userId: string;
  password: string;
  role: string;
  loading?: boolean;
  onChangeUserId: (value: string) => void;
  onChangePassword: (value: string) => void;
  onChangeRole: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};

export function UserFormDialog({
  open,
  mode,
  userId,
  password,
  role,
  loading = false,
  onChangeUserId,
  onChangePassword,
  onChangeRole,
  onSubmit,
  onClose,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === "create" ? "사용자 등록" : "사용자 수정"}
      </DialogTitle>

      <DialogContent>
        <UserForm
          mode={mode}
          userId={userId}
          password={password}
          role={role}
          onChangeUserId={onChangeUserId}
          onChangePassword={onChangePassword}
          onChangeRole={onChangeRole}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button variant="contained" onClick={onSubmit} disabled={loading}>
          {mode === "create" ? "등록" : "수정"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
