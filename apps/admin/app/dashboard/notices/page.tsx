"use client";

import { NoticeFormDialog } from "@/components/Notice/NoticeFormDialog";
import { CODE_GROUPS } from "@/features/code/codeGroups";
import { useCodes } from "@/features/code/useCodes";
import { usePermission } from "@/features/permission/usePermission";
import { queryKeys } from "@/src/lib/queryKeys";
import { Box, Pagination, TextField } from "@mui/material";
import {
  createNotice,
  deleteAttachmentFromTarget,
  deleteNotice,
  getAttachmentsByTarget,
  getNotice,
  getNotices,
  handleApiError,
  linkAttachment,
  updateNotice,
  uploadAttachment,
} from "@repo/api";
import type {
  AttachmentResponse,
  NoticeResponse,
  NoticeSearchCondition,
  PageRequest,
} from "@repo/types";
import {
  AppButton,
  DataTable,
  type DataTableColumn,
  PageHeader,
  resolveUploadErrorMessage,
  SearchPanel,
  UploadErrorItem,
  UploadingFile,
  useFeedback,
  validateUploadFile,
} from "@repo/ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NoticesPage() {
  const router = useRouter();
  const [loading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTitle, setSearchTitle] = useState("");
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
  const [searchParam, setSearchParam] = useState<
    PageRequest<NoticeSearchCondition>
  >({
    page,
    size: 10,
    condition: {
      title: searchTitle,
    },
  });
  const queryClient = useQueryClient();
  const search = useQuery({
    queryKey: queryKeys.notices(searchParam),
    queryFn: () => getNotices(searchParam),
  });

  const rows = search.data?.data.items ?? [];
  const totalPages = search.data?.data.totalPages ?? 0;
  const totalCount = search.data?.data.totalCount ?? 0;
  const rerfesh = () => {
    queryClient.invalidateQueries({ queryKey: ["notices"] });
  };

  const { canCreate, canUpdate, canDelete } =
    usePermission("/dashboard/notices");

  const { options: noticeTypeOptions, getCodeNm: getNoticeTypeNm } = useCodes(
    CODE_GROUPS.NOTICE_TYPE,
  );

  const { showError, showSuccess, showLoading, hideLoading, showInfo } =
    useFeedback();

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
    setNoticeType(noticeTypeOptions[0]?.value ?? "GENERAL");
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
      rerfesh();
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

  const handleSearch = async () => {
    setPage(1);
    setSearchParam((prev) => ({
      ...prev,
      condition: {
        ...prev.condition,
        title: searchTitle,
      },
    }));
    showInfo("검색 조건이 적용되었습니다.");
    rerfesh();
  };

  const handleRefresh = async () => {
    setPage(1);
    setTitle("");
    setSearchParam({
      page: 1,
      size: 10,
      condition: {
        title: "",
      },
    });
    showInfo("검색이 완료되었습니다.");
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("공지사항을 삭제하시겠습니까?")) return;

    showLoading();
    try {
      await deleteNotice(id);
      showSuccess("공지사항이 삭제되었습니다.");
      rerfesh();
    } catch (error) {
      handleApiError(error, {
        showError,
        fallbackMessage: "공지사항 삭제에 실패했습니다.",
      });
    } finally {
      hideLoading();
    }
  };
  const columns: DataTableColumn<NoticeResponse>[] = [
    { key: "id", header: "ID", render: (row) => row.id },
    { key: "title", header: "제목", render: (row) => row.title },
    {
      key: "noticeType",
      header: "유형",
      render: (row) => getNoticeTypeNm(row.noticeType),
    },
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

          {canDelete ? (
            <AppButton onClick={() => handleDelete(row.id)}>삭제</AppButton>
          ) : null}
        </Box>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="공지사항 관리"
        description={`전체 ${totalCount}건`}
        actions={
          canCreate ? (
            <AppButton onClick={openCreateDialog}>등록</AppButton>
          ) : null
        }
      />
      <SearchPanel
        actions={
          <>
            <AppButton onClick={handleRefresh}>초기화</AppButton>
            <AppButton onClick={handleSearch}>검색</AppButton>
          </>
        }
      >
        <Box display="flex" gap={2}>
          <TextField
            label="제목"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            fullWidth
          />
        </Box>
      </SearchPanel>

      <DataTable
        rows={rows}
        columns={columns}
        loading={loading}
        emptyMessage="공지사항 데이터가 없습니다."
        totalCnt={totalCount}
      />
      <Box mt={3} display="flex" justifyContent="center" alignItems="center">
        <Pagination
          page={page}
          count={Math.max(totalPages, 1)}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>

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
        noticeTypeOptions={noticeTypeOptions}
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
