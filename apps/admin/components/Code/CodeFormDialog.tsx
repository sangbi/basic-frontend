"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { FormSection, FormSelectField, FormTextField } from "@repo/ui";

type Option = {
  label: string;
  value: string;
};

type Props = {
  open: boolean;
  mode: "create" | "edit";
  groupId: string;
  code: string;
  codeNm: string;
  description: string;
  sortOrder: string;
  status: string;
  extraValue: string;
  groupOptions: Option[];
  loading?: boolean;
  onChangeGroupId: (value: string) => void;
  onChangeCode: (value: string) => void;
  onChangeCodeNm: (value: string) => void;
  onChangeDescription: (value: string) => void;
  onChangeSortOrder: (value: string) => void;
  onChangeStatus: (value: string) => void;
  onChangeExtraValue: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};

export function CodeFormDialog({
  open,
  mode,
  groupId,
  code,
  codeNm,
  description,
  sortOrder,
  status,
  extraValue,
  groupOptions,
  loading = false,
  onChangeGroupId,
  onChangeCode,
  onChangeCodeNm,
  onChangeDescription,
  onChangeSortOrder,
  onChangeStatus,
  onChangeExtraValue,
  onSubmit,
  onClose,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === "create" ? "코드 등록" : "코드 수정"}</DialogTitle>

      <DialogContent>
        <FormSection title="코드 정보">
          <FormSelectField
            label="코드 그룹"
            value={groupId}
            onChange={(e) => onChangeGroupId(e.target.value)}
            options={groupOptions}
            disabled={mode === "edit"}
          />

          <FormTextField
            label="코드"
            value={code}
            onChange={(e) => onChangeCode(e.target.value)}
            disabled={mode === "edit"}
          />

          <FormTextField
            label="코드명"
            value={codeNm}
            onChange={(e) => onChangeCodeNm(e.target.value)}
          />

          <FormTextField
            label="설명"
            value={description}
            onChange={(e) => onChangeDescription(e.target.value)}
          />

          <FormTextField
            label="정렬 순서"
            value={sortOrder}
            onChange={(e) => onChangeSortOrder(e.target.value)}
          />

          <FormTextField
            label="추가값"
            value={extraValue}
            onChange={(e) => onChangeExtraValue(e.target.value)}
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
