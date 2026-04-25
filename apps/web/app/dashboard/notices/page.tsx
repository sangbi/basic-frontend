"use client";

import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import {
  AppButton,
  DataTable,
  type DataTableColumn,
  PageHeader,
  UploadedAttachment,
  useFeedback,
} from "@repo/ui";
import {
  createNotice,
  getNotice,
  getNotices,
  handleApiError,
  linkAttachment,
  updateNotice,
  uploadAttachment,
} from "@repo/api";
import type { NoticeResponse } from "@repo/types";
import { useRouter } from "next/navigation";

export default function NoticesPage() {
  const router = useRouter();
  const [rows, setRows] = useState<NoticeResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [noticeType, setNoticeType] = useState("GENERAL");
  const [status, setStatus] = useState("ACTIVE");
  const [pinnedYn, setPinnedYn] = useState("N");
  const [attachments, setAttachments] = useState<UploadedAttachment[]>([]);

  const { showError, showSuccess, showLoading, hideLoading } = useFeedback();

  const load = async () => {
    setLoading(true);
    try {
      const result = await getNotices();
      setRows(result.data);
    } catch (error) {
      handleApiError(error, {
        showError,
        fallbackMessage: "공지사항 목록 조회에 실패했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setSelectedId(null);
    setTitle("");
    setContent("");
    setNoticeType("GENERAL");
    setStatus("ACTIVE");
    setPinnedYn("N");
    setAttachments([]);
  };

  const openCreateDialog = () => {
    resetForm();
    setFormMode("create");
    setFormOpen(true);
  };

  const openEditDialog = async (id: number) => {
    showLoading();
    try {
      const result = await getNotice(id);
      const notice = result.data;

      setSelectedId(notice.id);
      setTitle(notice.title);
      setContent(notice.content);
      setNoticeType(notice.noticeType);
      setStatus(notice.status);
      setPinnedYn(notice.pinnedYn);

      setFormMode("edit");
      setFormOpen(true);
    } catch (error) {
      handleApiError(error, {
        showError,
        fallbackMessage: "공지사항 상세 조회에 실패했습니다.",
      });
    } finally {
      hideLoading();
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      showError("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      showError("내용을 입력해주세요.");
      return;
    }

    showLoading();
    try {
      const payload = {
        title,
        content,
        noticeType,
        status,
        pinnedYn,
      };

      if (formMode === "create") {
        const result = await createNotice(payload);
        const noticeId = result.data;

        for (let i = 0; i < attachments.length; i += 1) {
          await linkAttachment({
            attachmentId: attachments[i].id,
            targetType: "NOTICE",
            targetId: noticeId,
            sortOrder: i,
          });
        }

        showSuccess("공지사항이 등록되었습니다.");
      } else if (selectedId != null) {
        await updateNotice(selectedId, payload);
        showSuccess("공지사항이 수정되었습니다.");
      }

      setFormOpen(false);
      resetForm();
      await load();
    } catch (error) {
      handleApiError(error, {
        showError,
        fallbackMessage:
          formMode === "create"
            ? "공지사항 등록에 실패했습니다."
            : "공지사항 수정에 실패했습니다.",
      });
    } finally {
      hideLoading();
    }
  };

  // 파일업로드 핸들러
  const handleUploadAttachment = async (file: File) => {
    const result = await uploadAttachment(file);
    setAttachments((prev) => [...prev, result.data]);
  };

  // 파일제거 핸들러
  const handleRemoveAttachment = (fileId: number) => {
    setAttachments((prev) => prev.filter((file) => file.id !== fileId));
  };

  const columns: DataTableColumn<NoticeResponse>[] = [
    { key: "id", header: "ID", render: (row) => row.id },
    { key: "title", header: "제목", render: (row) => row.title },
    { key: "noticeType", header: "유형", render: (row) => row.noticeType },
    { key: "status", header: "상태", render: (row) => row.status },
    { key: "pinnedYn", header: "상단 고정", render: (row) => row.pinnedYn },
    { key: "viewCnt", header: "조회수", render: (row) => row.viewCnt },
    { key: "createdAt", header: "등록일시", render: (row) => row.createdAt },
    {
      key: "action",
      header: "액션",
      render: (row) => (
        <Box display="flex" gap={1}>
          <AppButton
            onClick={() => router.push(`/dashboard/notices/${row.id}`)}
          >
            상세
          </AppButton>
        </Box>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="공지사항 관리" description={`전체 ${rows.length}건`} />

      <DataTable
        rows={rows}
        columns={columns}
        loading={loading}
        emptyMessage="공지사항 데이터가 없습니다."
      />
    </>
  );
}
