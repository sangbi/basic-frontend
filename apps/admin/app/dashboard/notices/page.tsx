"use client";

import { NoticeFormDialog } from "@/components/Notice/NoticeFormDialog";
import { usePermission } from "@/features/permission/usePermission";
import { Box } from "@mui/material";
import {
  createNotice,
  deleteAttachmentFromTarget,
  getAttachmentsByTarget,
  getNotice,
  getNotices,
  handleApiError,
  linkAttachment,
  updateNotice,
  uploadAttachment,
} from "@repo/api";
import type { AttachmentResponse, NoticeResponse } from "@repo/types";
import {
  AppButton,
  DataTable,
  type DataTableColumn,
  PageHeader,
  resolveUploadErrorMessage,
  UploadErrorItem,
  UploadingFile,
  useFeedback,
  validateUploadFile,
} from "@repo/ui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [attachments, setAttachments] = useState<AttachmentResponse[]>([]);
  const [newAttachmentIds, setNewAttachmentIds] = useState<number[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [uploadErrors, setUploadErrors] = useState<UploadErrorItem[]>([]);

  const { canCreate, canUpdate } = usePermission("/dashboard/notices");
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
    setNewAttachmentIds([]);
    setUploadingFiles([]);
  };

  const openCreateDialog = () => {
    resetForm();
    setFormMode("create");
    setFormOpen(true);
  };

  const openEditDialog = async (id: number) => {
    showLoading();
    try {
      const [noticeResult, attachmentResult] = await Promise.all([
        getNotice(id),
        getAttachmentsByTarget("NOTICE", id),
      ]);
      const notice = noticeResult.data;

      setSelectedId(notice.id);
      setTitle(notice.title);
      setContent(notice.content);
      setNoticeType(notice.noticeType);
      setStatus(notice.status);
      setPinnedYn(notice.pinnedYn);
      setAttachments(attachmentResult.data);
      setNewAttachmentIds([]);

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
      } else if (formMode === "edit" && selectedId != null) {
        await updateNotice(selectedId, payload);

        for (let i = 0; i < newAttachmentIds.length; i += 1) {
          await linkAttachment({
            attachmentId: newAttachmentIds[i],
            targetType: "NOTICE",
            targetId: selectedId,
            sortOrder: i,
          });
        }

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

  const MAX_NOTICE_ATTACHMENTS = 5;
  // 파일업로드 핸들러
  const handleUploadAttachments = async (files: File[]) => {
    const remainCount = MAX_NOTICE_ATTACHMENTS - attachments.length;

    if (remainCount <= 0) {
      showError(`첨부파일은 최대 ${MAX_NOTICE_ATTACHMENTS}개까지 가능합니다.`);
      return;
    }

    const targetFiles = files.slice(0, remainCount);

    const invalid = targetFiles
      .map((file) => ({ file, result: validateUploadFile(file) }))
      .filter((item) => !item.result.valid);

    if (invalid.length > 0) {
      setUploadErrors(
        invalid.map((item) => ({
          name: item.file.name,
          message: item.result.message,
        })),
      );

      const validFiles = targetFiles.filter(
        (file) => validateUploadFile(file).valid,
      );

      if (validFiles.length === 0) {
        return;
      }

      await uploadFiles(validFiles);
      return;
    }

    setUploadErrors([]);
    await uploadFiles(targetFiles);
  };

  const uploadFiles = async (targetFiles: File[]) => {
    setUploadingFiles(
      targetFiles.map((file) => ({ name: file.name, progress: 0 })),
    );

    const uploaded: AttachmentResponse[] = [];
    const failed: UploadErrorItem[] = [];

    for (const file of targetFiles) {
      try {
        const result = await uploadAttachment(file, (progress) => {
          setUploadingFiles((prev) =>
            prev.map((item) =>
              item.name === file.name ? { ...item, progress } : item,
            ),
          );
        });

        uploaded.push(result.data);
      } catch (error) {
        failed.push({
          name: file.name,
          message: resolveUploadErrorMessage(error, "업로드에 실패했습니다."),
        });
      }
    }

    if (uploaded.length > 0) {
      setAttachments((prev) => [...prev, ...uploaded]);
      setNewAttachmentIds((prev) => [
        ...prev,
        ...uploaded.map((file) => file.id),
      ]);
    }

    setUploadErrors((prev) => [...prev, ...failed]);
    setUploadingFiles([]);

    if (uploaded.length > 0 && failed.length === 0) {
      showSuccess("첨부파일 업로드가 완료되었습니다.");
    } else if (uploaded.length > 0 && failed.length > 0) {
      showSuccess(
        `일부 파일 업로드가 완료되었습니다. (${uploaded.length}건 성공, ${failed.length}건 실패)`,
      );
    } else if (uploaded.length === 0 && failed.length > 0) {
      showError("첨부파일 업로드에 실패했습니다.");
    }
  };

  // 파일제거 핸들러
  const handleRemoveAttachment = async (fileId: number) => {
    try {
      if (formMode === "edit" && selectedId != null) {
        await deleteAttachmentFromTarget({
          attachmentId: fileId,
          targetType: "NOTICE",
          targetId: selectedId,
        });
      }

      setAttachments((prev) => prev.filter((file) => file.id !== fileId));
      setNewAttachmentIds((prev) => prev.filter((id) => id !== fileId));
    } catch (error) {
      handleApiError(error, {
        showError,
        fallbackMessage: "첨부파일 삭제에 실패했습니다.",
      });
    }
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
          {canUpdate ? (
            <AppButton onClick={() => openEditDialog(row.id)}>수정</AppButton>
          ) : null}
        </Box>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="공지사항 관리"
        description={`전체 ${rows.length}건`}
        actions={
          canCreate ? (
            <AppButton onClick={openCreateDialog}>등록</AppButton>
          ) : null
        }
      />

      <DataTable
        rows={rows}
        columns={columns}
        loading={loading}
        emptyMessage="공지사항 데이터가 없습니다."
      />

      <NoticeFormDialog
        open={formOpen}
        mode={formMode}
        title={title}
        content={content}
        noticeType={noticeType}
        status={status}
        pinnedYn={pinnedYn}
        attachments={attachments}
        uploadingFiles={uploadingFiles}
        uploadErrors={uploadErrors}
        onChangeTitle={setTitle}
        onChangeContent={setContent}
        onChangeNoticeType={setNoticeType}
        onChangeStatus={setStatus}
        onChangePinnedYn={setPinnedYn}
        onUploadAttachments={handleUploadAttachments}
        onRemoveAttachment={handleRemoveAttachment}
        onSubmit={handleSubmit}
        onClose={() => {
          setFormOpen(false);
          resetForm();
        }}
      />
    </>
  );
}
