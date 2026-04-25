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
  createResource,
  getResource,
  getResources,
  handleApiError,
  linkAttachment,
  updateResource,
  uploadAttachment,
} from "@repo/api";
import type { ResourceResponse } from "@repo/types";
import { useRouter } from "next/navigation";

export default function ResourcesPage() {
  const router = useRouter();
  const [rows, setRows] = useState<ResourceResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [pinnedYn, setPinnedYn] = useState("N");
  const [attachments, setAttachments] = useState<UploadedAttachment[]>([]);

  const { showError, showSuccess, showLoading, hideLoading } = useFeedback();

  const load = async () => {
    setLoading(true);
    try {
      const result = await getResources();
      setRows(result.data);
    } catch (error) {
      handleApiError(error, {
        showError,
        fallbackMessage: "자료실 목록 조회에 실패했습니다.",
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
    setStatus("ACTIVE");
    setPinnedYn("N");
  };

  const openCreateDialog = () => {
    resetForm();
    setFormMode("create");
    setFormOpen(true);
  };

  const openEditDialog = async (id: number) => {
    showLoading();
    try {
      const result = await getResource(id);
      const resource = result.data;

      setSelectedId(resource.id);
      setTitle(resource.title);
      setContent(resource.content);
      setStatus(resource.status);
      setPinnedYn(resource.pinnedYn);

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
      } else if (selectedId != null) {
        await updateResource(selectedId, payload);
        showSuccess("자료실이 수정되었습니다.");
      }

      setFormOpen(false);
      resetForm();
      await load();
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

  // 파일업로드 핸들러
  const handleUploadAttachment = async (file: File) => {
    const result = await uploadAttachment(file);
    setAttachments((prev) => [...prev, result.data]);
  };

  // 파일제거 핸들러
  const handleRemoveAttachment = (fileId: number) => {
    setAttachments((prev) => prev.filter((file) => file.id !== fileId));
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
        </Box>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="자료실 관리" description={`전체 ${rows.length}건`} />

      <DataTable
        rows={rows}
        columns={columns}
        loading={loading}
        emptyMessage="자료실 데이터가 없습니다."
      />
    </>
  );
}
