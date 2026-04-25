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
  groupCode: string;
  groupNm: string;
  description: string;
  status: string;
  loading?: boolean;
  onChangeGroupCode: (value: string) => void;
  onChangeGroupNm: (value: string) => void;
  onChangeDescription: (value: string) => void;
  onChangeStatus: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};

export function CodeGroupFormDialog({
  open,
  mode,
  groupCode,
  groupNm,
  description,
  status,
  loading = false,
  onChangeGroupCode,
  onChangeGroupNm,
  onChangeDescription,
  onChangeStatus,
  onSubmit,
  onClose,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === "create" ? "코드 그룹 등록" : "코드 그룹 수정"}
      </DialogTitle>

      <DialogContent>
        <FormSection title="코드 그룹 정보">
          <FormTextField
            label="그룹 코드"
            value={groupCode}
            onChange={(e) => onChangeGroupCode(e.target.value)}
            disabled={mode === "edit"}
          />

          <FormTextField
            label="그룹명"
            value={groupNm}
            onChange={(e) => onChangeGroupNm(e.target.value)}
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
