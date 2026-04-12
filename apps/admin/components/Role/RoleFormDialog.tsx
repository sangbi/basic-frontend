"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { FormSection, FormSelectField, FormTextField } from "@repo/ui";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  roleCode: string;
  roleNm: string;
  description: string;
  status: string;
  loading?: boolean;
  onChangeRoleCode: (value: string) => void;
  onChangeRoleNm: (value: string) => void;
  onChangeDescription: (value: string) => void;
  onChangeStatus: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};

export function RoleFormDialog({
  open,
  mode,
  roleCode,
  roleNm,
  description,
  status,
  loading = false,
  onChangeRoleCode,
  onChangeRoleNm,
  onChangeDescription,
  onChangeStatus,
  onSubmit,
  onClose,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === "create" ? "역할 등록" : "역할 수정"}</DialogTitle>

      <DialogContent>
        <FormSection title="역할 정보">
          <FormTextField
            label="역할 코드"
            value={roleCode}
            onChange={(e) => onChangeRoleCode(e.target.value)}
            disabled={mode === "edit"}
          />

          <FormTextField
            label="역할명"
            value={roleNm}
            onChange={(e) => onChangeRoleNm(e.target.value)}
          />

          <FormTextField
            label="설명"
            value={description}
            onChange={(e) => onChangeDescription(e.target.value)}
          />

          <FormSelectField
            label="상태"
            value={status}
            onChange={(e) => onChangeStatus(e.target.value)}
            options={[
              { label: "ACTIVE", value: "ACTIVE" },
              { label: "INACTIVE", value: "INACTIVE" },
            ]}
          />
        </FormSection>
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
