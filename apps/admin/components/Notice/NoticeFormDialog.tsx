"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  AttachmentUploader,
  FormSection,
  FormSelectField,
  FormTextField,
  UploadedAttachment,
  UploadErrorItem,
  UploadingFile,
} from "@repo/ui";
import { RichTextEditor } from "@repo/ui/src/editor/RichTextEditor";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  title: string;
  content: string;
  noticeType: string;
  status: string;
  pinnedYn: string;
  attachments: UploadedAttachment[];
  loading?: boolean;
  uploadingFiles?: UploadingFile[];
  uploadErrors?: UploadErrorItem[];
  noticeTypeOptions: { label: string; value: string }[];
  onChangeTitle: (value: string) => void;
  onChangeContent: (value: string) => void;
  onChangeNoticeType: (value: string) => void;
  onChangeStatus: (value: string) => void;
  onChangePinnedYn: (value: string) => void;
  onUploadAttachments: (files: File[]) => Promise<void>;
  onRemoveAttachment: (fileId: number) => void;
  onAddImage?: () => Promise<string | null>;
  onSubmit: () => void;
  onClose: () => void;
};

export function NoticeFormDialog({
  open,
  mode,
  title,
  content,
  noticeType,
  status,
  pinnedYn,
  attachments,
  loading = false,
  uploadingFiles = [],
  uploadErrors = [],
  noticeTypeOptions = [],
  onChangeTitle,
  onChangeContent,
  onChangeNoticeType,
  onChangeStatus,
  onChangePinnedYn,
  onUploadAttachments,
  onRemoveAttachment,
  onSubmit,
  onClose,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === "create" ? "공지사항 등록" : "공지사항 수정"}
      </DialogTitle>

      <DialogContent>
        <FormSection title="공지사항 정보">
          <FormTextField
            label="제목"
            value={title}
            onChange={(e) => onChangeTitle(e.target.value)}
          />

          <RichTextEditor
            placeholder="내용을 입력해주세요"
            value={content}
            onChange={onChangeContent}
          />

          <FormSection title="첨부파일">
            <AttachmentUploader
              files={attachments}
              onSelectFiles={onUploadAttachments}
              onRemoveFile={onRemoveAttachment}
              disabled={loading}
              uploadingFiles={uploadingFiles}
              uploadErrors={uploadErrors}
            />
          </FormSection>

          <FormSelectField
            label="공지 유형"
            value={noticeType}
            onChange={(e) => onChangeNoticeType(e.target.value)}
            options={noticeTypeOptions}
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

          <FormSelectField
            label="상단 고정"
            value={pinnedYn}
            onChange={(e) => onChangePinnedYn(e.target.value)}
            options={[
              { label: "Y", value: "Y" },
              { label: "N", value: "N" },
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
