"use client";

import { useEffect, useState } from "react";
import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import {
  getResource,
  getAttachmentsByTarget,
  handleApiError,
  downloadAttachmentFile,
  viewAttachmentFile,
} from "@repo/api";
import type { ResourceResponse, AttachmentResponse } from "@repo/types";
import {
  AttachmentList,
  PageHeader,
  RichTextViewer,
  useFeedback,
} from "@repo/ui";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export default function ResourceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { showError } = useFeedback();

  const [resource, setResource] = useState<ResourceResponse | null>(null);
  const [attachments, setAttachments] = useState<AttachmentResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!params.id) return;

      setLoading(true);
      try {
        const [resourceResult, attachmentResult] = await Promise.all([
          getResource(Number(params.id)),
          getAttachmentsByTarget("RESOURCE", Number(params.id)),
        ]);

        setResource(resourceResult.data);
        setAttachments(attachmentResult.data);
      } catch (error) {
        handleApiError(error, {
          showError,
          fallbackMessage: "자료실 상세 조회에 실패했습니다.",
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [params.id, showError]);

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
    <>
      <PageHeader
        title="자료실 상세"
        description={resource?.title ?? ""}
        actions={
          <Button
            variant="outlined"
            onClick={() => router.push("/dashboard/resources")}
          >
            목록
          </Button>
        }
      />

      {loading ? <Typography>불러오는 중...</Typography> : null}

      {resource ? (
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {resource.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                상태: {resource.status} / 상단고정: {resource.pinnedYn}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                작성일시: {resource.createdAt}
              </Typography>
            </Box>

            <Divider />

            <RichTextViewer html={resource.content} />

            <Divider />

            <Box>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                첨부파일
              </Typography>
              <AttachmentList
                files={attachments}
                onDownload={handleDownload}
                onPreviewImage={handlePreviewImage}
              />
            </Box>
          </Stack>
        </Paper>
      ) : null}
    </>
  );
}
