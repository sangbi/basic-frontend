"use client";

import { useRef, useState } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";

export type UploadedAttachment = {
  id: number;
  originalFileNm: string;
  contentType: string | null;
  fileSize: number;
  url?: string;
};

export type UploadingFile = {
  name: string;
  progress: number;
};

export type UploadErrorItem = {
  name: string;
  message: string;
};

type Props = {
  files: UploadedAttachment[];
  uploadingFiles?: UploadingFile[];
  uploadErrors?: UploadErrorItem[];
  onSelectFiles: (files: File[]) => Promise<void>;
  onRemoveFile?: (fileId: number) => void;
  disabled?: boolean;
  maxCount?: number;
};

export function AttachmentUploader({
  files,
  uploadingFiles = [],
  uploadErrors = [],
  onSelectFiles,
  onRemoveFile,
  disabled = false,
  maxCount,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    await onSelectFiles(Array.from(fileList));
  };

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    await handleFiles(event.target.files);
    event.target.value = "";
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);

    if (disabled) return;
    await handleFiles(event.dataTransfer.files);
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Box
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) setDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragging(false);
        }}
        onDrop={handleDrop}
        sx={{
          border: "2px dashed",
          borderColor: dragging ? "primary.main" : "divider",
          bgcolor: dragging ? "action.hover" : "background.default",
          borderRadius: 2,
          p: 3,
          textAlign: "center",
          transition: "all 0.2s ease",
        }}
      >
        <Typography variant="body1" fontWeight={600} mb={1}>
          파일을 여기로 드래그하거나 선택하세요
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          여러 파일 업로드를 지원합니다.
          {typeof maxCount === "number" ? ` (최대 ${maxCount}개)` : ""}
        </Typography>

        <Button
          variant="outlined"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          파일 선택
        </Button>

        <input
          ref={inputRef}
          hidden
          type="file"
          multiple
          onChange={handleInputChange}
        />
      </Box>
      {uploadErrors.length > 0 ? (
        <Box mt={2}>
          <Typography
            variant="body2"
            fontWeight={600}
            color="error.main"
            mb={1}
          >
            업로드 실패
          </Typography>

          <List dense>
            {uploadErrors.map((item, index) => (
              <ListItem key={`${item.name}-${index}`}>
                <ListItemText
                  primary={item.name}
                  secondary={item.message}
                  primaryTypographyProps={{ color: "error.main" }}
                  secondaryTypographyProps={{ color: "error.main" }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      ) : null}

      <List dense sx={{ mt: 2 }}>
        {uploadingFiles.map((file) => (
          <ListItem key={`uploading-${file.name}`}>
            <ListItemText
              primary={`${file.name} 업로드 중`}
              secondary={`${file.progress}%`}
            />
          </ListItem>
        ))}

        {files.map((file) => (
          <ListItem
            key={file.id}
            secondaryAction={
              onRemoveFile ? (
                <Button
                  color="error"
                  size="small"
                  onClick={() => onRemoveFile(file.id)}
                >
                  제거
                </Button>
              ) : null
            }
          >
            <ListItemText
              primary={file.originalFileNm}
              secondary={`${file.contentType ?? "-"} / ${file.fileSize} bytes`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
