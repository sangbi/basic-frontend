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
  menuNm: string;
  menuPath: string;
  apiPath: string;
  parentId: string;
  sortOrder: string;
  icon: string;
  visibleYn: string;
  status: string;
  loading?: boolean;
  onChangeMenuNm: (value: string) => void;
  onChangeMenuPath: (value: string) => void;
  onChangeApiPath: (value: string) => void;
  onChangeParentId: (value: string) => void;
  onChangeSortOrder: (value: string) => void;
  onChangeIcon: (value: string) => void;
  onChangeVisibleYn: (value: string) => void;
  onChangeStatus: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};

export function MenuFormDialog({
  open,
  mode,
  menuNm,
  menuPath,
  apiPath,
  parentId,
  sortOrder,
  icon,
  visibleYn,
  status,
  loading = false,
  onChangeMenuNm,
  onChangeMenuPath,
  onChangeApiPath,
  onChangeParentId,
  onChangeSortOrder,
  onChangeIcon,
  onChangeVisibleYn,
  onChangeStatus,
  onSubmit,
  onClose,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === "create" ? "메뉴 등록" : "메뉴 수정"}</DialogTitle>

      <DialogContent>
        <FormSection title="메뉴 정보">
          <FormTextField
            label="메뉴명"
            value={menuNm}
            onChange={(e) => onChangeMenuNm(e.target.value)}
          />

          <FormTextField
            label="경로"
            value={menuPath}
            onChange={(e) => onChangeMenuPath(e.target.value)}
          />

          <FormTextField
            label="API 경로"
            value={apiPath}
            onChange={(e) => onChangeApiPath(e.target.value)}
          />

          <FormTextField
            label="상위 메뉴 ID"
            value={parentId}
            onChange={(e) => onChangeParentId(e.target.value)}
            helperText="없으면 비워두세요."
          />

          <FormTextField
            label="정렬 순서"
            value={sortOrder}
            onChange={(e) => onChangeSortOrder(e.target.value)}
          />

          <FormTextField
            label="아이콘"
            value={icon}
            onChange={(e) => onChangeIcon(e.target.value)}
          />

          <FormSelectField
            label="노출 여부"
            value={visibleYn}
            onChange={(e) => onChangeVisibleYn(e.target.value)}
            options={[
              { label: "Y", value: "Y" },
              { label: "N", value: "N" },
            ]}
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
