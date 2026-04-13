"use client";

import { useCallback, useEffect, useState } from "react";
import { Box } from "@mui/material";
import {
  AppButton,
  DataTable,
  type DataTableColumn,
  PageHeader,
  useFeedback,
} from "@repo/ui";
import {
  createRole,
  getRole,
  getRoles,
  updateRole,
  handleApiError,
} from "@repo/api";
import type { RoleResponse } from "@repo/types";
import { RoleFormDialog } from "@/components/Role/RoleFormDialog";
import { usePermission } from "@/features/permission/usePermission";

export default function RolesPage() {
  const {
    canCreate,
    canUpdate,
    canDelete,
    loading: permissionLoading,
  } = usePermission("/dashboard/roles");
  const [rows, setRows] = useState<RoleResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [roleCode, setRoleCode] = useState("");
  const [roleNm, setRoleNm] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  const { showError, showSuccess, showLoading, hideLoading } = useFeedback();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getRoles();
      setRows(result.data);
    } catch (error) {
      handleApiError(error, {
        showError,
        fallbackMessage: "역할 목록 조회에 실패했습니다.",
      });
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setSelectedId(null);
    setRoleCode("");
    setRoleNm("");
    setDescription("");
    setStatus("ACTIVE");
  };

  const openCreateDialog = () => {
    resetForm();
    setFormMode("create");
    setFormOpen(true);
  };

  const openEditDialog = async (id: number) => {
    showLoading();
    try {
      const result = await getRole(id);
      const role = result.data;

      setSelectedId(role.id);
      setRoleCode(role.roleCode);
      setRoleNm(role.roleNm);
      setDescription(role.description ?? "");
      setStatus(role.status);
      setFormMode("edit");
      setFormOpen(true);
    } catch (error) {
      handleApiError(error, {
        showError,
        fallbackMessage: "역할 상세 조회에 실패했습니다.",
      });
    } finally {
      hideLoading();
    }
  };

  const handleSubmit = async () => {
    if (!roleCode.trim() && formMode === "create") {
      showError("역할 코드를 입력해주세요.");
      return;
    }

    if (!roleNm.trim()) {
      showError("역할명을 입력해주세요.");
      return;
    }

    showLoading();
    try {
      if (formMode === "create") {
        await createRole({
          roleCode,
          roleNm: roleNm,
          description,
          status,
        });

        showSuccess("역할이 등록되었습니다.");
      } else if (selectedId != null) {
        await updateRole(selectedId, {
          roleNm: roleNm,
          description,
          status,
        });

        showSuccess("역할이 수정되었습니다.");
      }

      setFormOpen(false);
      resetForm();
      await load();
    } catch (error) {
      handleApiError(error, {
        showError,
        fallbackMessage:
          formMode === "create"
            ? "역할 등록에 실패했습니다."
            : "역할 수정에 실패했습니다.",
      });
    } finally {
      hideLoading();
    }
  };

  const columns: DataTableColumn<RoleResponse>[] = [
    { key: "id", header: "ID", render: (row) => row.id },
    { key: "roleCode", header: "역할 코드", render: (row) => row.roleCode },
    { key: "roleNm", header: "역할명", render: (row) => row.roleNm },
    {
      key: "description",
      header: "설명",
      render: (row) => row.description ?? "-",
    },
    { key: "status", header: "상태", render: (row) => row.status },
    {
      key: "action",
      header: "액션",
      render: (row) => (
        <Box display="flex" gap={1}>
          {canUpdate && (
            <AppButton onClick={() => openEditDialog(row.id)}>수정</AppButton>
          )}
        </Box>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="역할 관리"
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
        emptyMessage="역할 데이터가 없습니다."
      />

      <RoleFormDialog
        open={formOpen}
        mode={formMode}
        roleCode={roleCode}
        roleNm={roleNm}
        description={description}
        status={status}
        onChangeRoleCode={setRoleCode}
        onChangeRoleNm={setRoleNm}
        onChangeDescription={setDescription}
        onChangeStatus={setStatus}
        onSubmit={handleSubmit}
        onClose={() => {
          setFormOpen(false);
          resetForm();
        }}
      />
    </>
  );
}
