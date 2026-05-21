"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import {
  downloadAttachmentFile,
  getWebAttachmentsByTarget,
  getWebNotice,
  handleApiError,
  viewAttachmentFile,
} from "@repo/api";
import type { AttachmentResponse, NoticeResponse } from "@repo/types";
import { AttachmentList, RichTextViewer, useFeedback } from "@repo/ui";

export default function WebNoticeDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { showError } = useFeedback();

  const [notice, setNotice] = useState<NoticeResponse | null>(null);
  const [attachments, setAttachments] = useState<AttachmentResponse[]>([]);

  const loadedRef = useRef(false);
  useEffect(() => {
    if (!params.id) return;
    if (loadedRef.current) return;

    loadedRef.current = true;

    const load = async () => {
      const id = Number(params.id);

      const [noticeResult, attachmentResult] = await Promise.all([
        getWebNotice(id),
        getWebAttachmentsByTarget("NOTICE", id),
      ]);

      setNotice(noticeResult.data);
      setAttachments(attachmentResult.data);
    };

    load();
  }, [params.id]);

  if (!notice) return null;

  const handleDownload = async (attachmentId: number) => {
    try {
      const { blob, fileName } = await downloadAttachmentFile(attachmentId);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      handleApiError(error, {
        showError,
        fallbackMessage: "첨부파일 다운로드에 실패했습니다.",
      });
    }
  };

  const handlePreviewImage = async (attachmentId: number) => {
    const blob = await viewAttachmentFile(attachmentId);
    return URL.createObjectURL(blob);
  };

  return (
    <Box maxWidth={960} mx="auto" py={4}>
      <Button
        variant="outlined"
        onClick={() => router.push("/dashboard/notices")}
      >
        목록
      </Button>

      <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              {notice.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              {notice.noticeType} · 조회수 {notice.viewCnt} · {notice.createdAt}
            </Typography>
          </Box>

          <Divider />

          <RichTextViewer html={notice.content} />

          <Divider />

          <Box>
            <Typography variant="subtitle1" fontWeight={700} mb={1}>
              첨부파일
            </Typography>

            {attachments.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                첨부파일이 없습니다.
              </Typography>
            ) : (
              <AttachmentList
                files={attachments}
                onDownload={handleDownload}
                onPreviewImage={handlePreviewImage}
              />
            )}
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
