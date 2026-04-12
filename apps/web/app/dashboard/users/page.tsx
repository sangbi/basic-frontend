"use client";

import { UserFormDialog } from "@/components/User/UserFormDialog";
import { queryKeys } from "@/src/lib/queryKeys";
import { Box, Pagination, TextField, Typography } from "@mui/material";
import {
  createUser,
  deleteUser,
  handleApiError,
  infoUser,
  searchUsers,
  updateUser,
} from "@repo/api";
import type {
  PageRequest,
  UserListResponse,
  UserSearchCondition,
} from "@repo/types";
import {
  AppButton,
  ConfirmDialog,
  DataTable,
  type DataTableColumn,
  PageHeader,
  SearchPanel,
  useFeedback,
} from "@repo/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function UsersPage() {
  const { showError, showInfo, showSuccess, showLoading, hideLoading } =
    useFeedback();

  const [userId, setUserId] = useState<string>("");
  const [page, setPage] = useState(1);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formUserId, setFormUserId] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRoleId, setFormRoleId] = useState(3);
  const [searchParam, setSearchParam] = useState<
    PageRequest<UserSearchCondition>
  >({
    page,
    size: 10,
    condition: {
      userId: userId,
    },
  });

  const queryClient = useQueryClient();
  const search = useQuery({
    queryKey: queryKeys.users(searchParam),
    queryFn: () => searchUsers(searchParam),
  });
  const rows = search.data?.data.items ?? [];
  const totalPages = search.data?.data.totalPages ?? 0;
  const totalCount = search.data?.data.totalCount ?? 0;
  const rerfesh = () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormUserId("");
    setFormPassword("");
    setFormRoleId(3);
  };

  const openCreateDialog = () => {
    setFormMode("create");
    resetForm();
    setFormOpen(true);
  };

  const handleEdit = async (userId: string) => {
    try {
      showLoading();
      const res = await infoUser(userId);

      const user = res.data;
      setFormMode("edit");
      setEditingId(user.userId);
      setFormUserId(user.userId);
      setFormRoleId(user.roleId);
      setFormOpen(true);
    } catch (error) {
      console.error(error);
      handleApiError(error, { showError });
    } finally {
      hideLoading();
    }
  };

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      setFormOpen(false);

      showSuccess("사용자가 등록되었습니다.");
      setPage(1);
    },
    onError: (error) => {
      console.error(error);
      handleApiError(error, { showError });
    },
  });
  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      setFormOpen(false);
      resetForm();
      showSuccess("사용자 정보가 수정되었습니다.");
    },
    onError: (error) => {
      console.error(error);
      handleApiError(error, { showError });
    },
  });

  const handleSubmitForm = async () => {
    if (formMode === "create") {
      showLoading();
      createMutation
        .mutateAsync({
          userId: formUserId,
          password: formPassword,
          roleId: formRoleId,
          userNm: "",
          email: "",
        })
        .finally(() => {
          hideLoading();
          rerfesh();
        });
    }
    if (formMode === "edit") {
      if (!editingId) return;
      showLoading();
      updateMutation
        .mutateAsync({
          userId: editingId,
          roleId: formRoleId,
        })
        .finally(() => {
          hideLoading();
          resetForm();
        });
    }
  };

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      setDeleteTargetId(null);
      showSuccess("사용자가 삭제되었습니다.");
      rerfesh();
    },
    onError: (error) => {
      console.error(error);
      handleApiError(error, { showError });
    },
  });
  const handleDelete = async () => {
    if (deleteTargetId == null) return;
    showLoading();
    deleteMutation.mutateAsync(deleteTargetId).finally(() => {
      hideLoading();
    });
  };

  const handleSearch = async () => {
    setPage(1);
    setSearchParam((prev) => ({
      ...prev,
      condition: {
        ...prev.condition,
        userId: userId,
      },
    }));
    showInfo("검색 조건이 적용되었습니다.");
  };

  const handleRefresh = async () => {
    setPage(1);
    setUserId("");
    setSearchParam({
      page: 1,
      size: 10,
      condition: {
        userId: "",
      },
    });
    showInfo("검색이 완료되었습니다.");
  };

  const columns: DataTableColumn<UserListResponse>[] = [
    {
      key: "id",
      header: "ID",
      width: 80,
      render: (row) => row.id,
    },
    {
      key: "userId",
      header: "아이디",
      render: (row) => row.userId,
    },
    {
      key: "role",
      header: "권한",
      render: (row) => row.roleCode,
    },
    {
      key: "action",
      header: "액션",
      render: (row) => (
        <Box display="flex" gap={1}>
          <AppButton onClick={() => handleEdit(row.userId)}>수정</AppButton>
          <AppButton
            color="error"
            onClick={() => setDeleteTargetId(row.userId)}
          >
            삭제
          </AppButton>
        </Box>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="사용자 관리"
        description={`전체 ${totalCount}건`}
        actions={<AppButton onClick={openCreateDialog}>등록</AppButton>}
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
            label="아이디"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            fullWidth
          />
        </Box>
      </SearchPanel>

      <DataTable
        rows={rows}
        columns={columns}
        loading={search.isLoading}
        emptyMessage="검색 결과가 없습니다."
        totalCnt={totalCount}
      />

      <Box
        mt={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="body2" color="text.secondary">
          총 {totalCount}건
        </Typography>

        <Pagination
          page={page}
          count={Math.max(totalPages, 1)}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>

      <ConfirmDialog
        open={deleteTargetId != null}
        title="사용자 삭제"
        message="정말 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDelete}
        onClose={() => setDeleteTargetId(null)}
      />

      <UserFormDialog
        open={formOpen}
        mode={formMode}
        userId={formUserId}
        password={formPassword}
        roleId={formRoleId}
        onChangeUserId={setFormUserId}
        onChangePassword={setFormPassword}
        onChangeRoleId={setFormRoleId}
        onSubmit={handleSubmitForm}
        onClose={() => {
          setFormOpen(false);
          resetForm();
        }}
      />
    </>
  );
}
