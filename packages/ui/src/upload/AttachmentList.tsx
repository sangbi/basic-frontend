"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import type { AttachmentResponse } from "../../../types";
import {
  formatFileSize,
  isExcelFile,
  isImageFile,
  isPdfFile,
  isWordFile,
  isZipFile,
} from "./fileUtils";

type Props = {
  files: AttachmentResponse[];
  onDownload: (id: number) => Promise<void> | void;
  onPreviewImage?: (id: number) => Promise<string>;
  onDelete?: (id: number) => Promise<void> | void;
};

function FileTypeIcon({
  contentType,
  fileName,
}: {
  contentType: string | null;
  fileName: string;
}) {
  if (isImageFile(contentType)) return <ImageOutlinedIcon />;
  if (isPdfFile(contentType, fileName)) return <PictureAsPdfOutlinedIcon />;
  if (isExcelFile(contentType, fileName)) return <TableChartOutlinedIcon />;
  if (isWordFile(contentType, fileName)) return <DescriptionOutlinedIcon />;
  if (isZipFile(contentType, fileName)) return <ArchiveOutlinedIcon />;
  return <InsertDriveFileOutlinedIcon />;
}

export function AttachmentList({
  files,
  onDownload,
  onPreviewImage,
  onDelete,
}: Props) {
  const [previewMap, setPreviewMap] = useState<Record<number, string>>({});

  useEffect(() => {
    let mounted = true;

    const loadPreviews = async () => {
      if (!onPreviewImage) return;

      for (const file of files) {
        if (!isImageFile(file.contentType)) continue;
        if (previewMap[file.id]) continue;

        try {
          const url = await onPreviewImage(file.id);
          if (!mounted) return;
          setPreviewMap((prev) => ({ ...prev, [file.id]: url }));
        } catch (error) {
          console.error(error);
        }
      }
    };

    loadPreviews();

    return () => {
      mounted = false;
      Object.values(previewMap).forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [files, onPreviewImage]);

  if (files.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        첨부파일이 없습니다.
      </Typography>
    );
  }

  return (
    <Stack spacing={1.5}>
      {files.map((file) => {
        const imagePreview = previewMap[file.id];

        return (
          <Card key={file.id} variant="outlined">
            <CardContent sx={{ py: 2 }}>
              <Box display="flex" gap={2} alignItems="center">
                <Box
                  width={72}
                  height={72}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  border="1px solid"
                  borderColor="divider"
                  borderRadius={2}
                  overflow="hidden"
                  flexShrink={0}
                  bgcolor="background.default"
                >
                  {isImageFile(file.contentType) && imagePreview ? (
                    <img
                      src={imagePreview}
                      alt={file.originalFileNm}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <FileTypeIcon
                      contentType={file.contentType}
                      fileName={file.originalFileNm}
                    />
                  )}
                </Box>

                <Box flex={1} minWidth={0}>
                  <Typography variant="body1" fontWeight={600} noWrap>
                    {file.originalFileNm}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {file.contentType ?? "-"} / {formatFileSize(file.fileSize)}
                  </Typography>
                </Box>

                <Box display="flex" gap={1} flexShrink={0}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => onDownload(file.id)}
                  >
                    다운로드
                  </Button>

                  {onDelete ? (
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={() => onDelete(file.id)}
                    >
                      삭제
                    </Button>
                  ) : null}
                </Box>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}
