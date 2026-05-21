"use client";

import { ResourceFormDialog } from "@/components/Resource/ResourceFormDialog";
import { usePermission } from "@/features/permission/usePermission";
import { queryKeys } from "@/src/lib/queryKeys";
import { Box, Pagination, TextField } from "@mui/material";
import {
  createResource,
  deleteAttachmentFromTarget,
  getAttachmentsByTarget,
  getResource,
  getResources,
  handleApiError,
  linkAttachment,
  updateResource,
  uploadAttachment,
} from "@repo/api";
import type {
  AttachmentResponse,
  PageRequest,
  ResourceResponse,
  ResourceSearchCondition,
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

export default function ResourcesPage() {
  const router = useRouter();
  const [loading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTitle, setSearchTitle] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [pinnedYn, setPinnedYn] = useState("N");
  const [attachments, setAttachments] = useState<AttachmentResponse[]>([]);
  const [newAttachmentIds, setNewAttachmentIds] = useState<number[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [uploadErrors, setUploadErrors] = useState<UploadErrorItem[]>([]);

  const { canCreate, canUpdate } = usePermission("/dashboard/resources");
  const { showError, showSuccess, showLoading, hideLoading, showInfo } =
    useFeedback();

  const [searchParam, setSearchParam] = useState<
    PageRequest<ResourceSearchCondition>
  >({
    page,
    size: 10,
    condition: {
      title: searchTitle,
    },
  });
  const queryClient = useQueryClient();
  const search = useQuery({
    queryKey: queryKeys.resource(searchParam),
    queryFn: () => getResources(searchParam),
  });

  const rows = search.data?.data.items ?? [];
  const totalPages = search.data?.data.totalPages ?? 0;
  const totalCount = search.data?.data.totalCount ?? 0;
  const rerfesh = () => {
    queryClient.invalidateQueries({ queryKey: ["notices"] });
  };

  const resetForm = () => {
    setSelectedId(null);
    setTitle("");
    setContent("");
    setStatus("ACTIVE");
    setPinnedYn("N");
    setAttachments([]);
    setNewAttachmentIds([]);
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
        getResource(id),
        getAttachmentsByTarget("RESOURCE", id),
      ]);
      const resource = noticeResult.data;

      setSelectedId(resource.id);
      setTitle(resource.title);
      setContent(resource.content);
      setStatus(resource.status);
      setPinnedYn(resource.pinnedYn);
      setAttachments(attachmentResult.data);
      setNewAttachmentIds([]);

      setFormMode("edit");
      setFormOpen(true);
    } catch (error) {
      handleApiError(error, {
        showError,
        fallbackMessage: "자료실 상세 조회에 실패했습니다.",
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
        status,
        pinnedYn,
      };

      if (formMode === "create") {
        const result = await createResource(payload);
        const resourceId = result.data;

        for (let i = 0; i < attachments.length; i += 1) {
          await linkAttachment({
            attachmentId: attachments[i].id,
            targetType: "RESOURCE",
            targetId: resourceId,
            sortOrder: i,
          });
        }
        showSuccess("자료실이 등록되었습니다.");
      } else if (formMode === "edit" && selectedId != null) {
        await updateResource(selectedId, payload);

        for (let i = 0; i < newAttachmentIds.length; i += 1) {
          await linkAttachment({
            attachmentId: newAttachmentIds[i],
            targetType: "RESOURCE",
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
            ? "자료실 등록에 실패했습니다."
            : "자료실 수정에 실패했습니다.",
      });
    } finally {
      hideLoading();
    }
  };

  const MAX_NOTICE_ATTACHMENTS = 10;
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
          targetType: "RESOURCE",
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

  const columns: DataTableColumn<ResourceResponse>[] = [
    { key: "id", header: "ID", render: (row) => row.id },
    { key: "title", header: "제목", render: (row) => row.title },
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
            onClick={() => router.push(`/dashboard/resources/${row.id}`)}
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
        title="자료실 관리"
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
        emptyMessage="자료실 데이터가 없습니다."
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

      <ResourceFormDialog
        open={formOpen}
        mode={formMode}
        title={title}
        content={content}
        status={status}
        pinnedYn={pinnedYn}
        attachments={attachments}
        uploadingFiles={uploadingFiles}
        uploadErrors={uploadErrors}
        onChangeTitle={setTitle}
        onChangeContent={setContent}
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
