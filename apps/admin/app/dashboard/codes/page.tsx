"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Paper, Stack } from "@mui/material";
import {
  AppButton,
  DataTable,
  type DataTableColumn,
  FormSelectField,
  PageHeader,
  useFeedback,
} from "@repo/ui";
import {
  createCode,
  createCodeGroup,
  getCodeGroups,
  getCodes,
  getCodesByGroupCode,
  handleApiError,
  updateCode,
  updateCodeGroup,
} from "@repo/api";
import type { CodeGroupResponse, CodeResponse } from "@repo/types";
import { CodeGroupFormDialog } from "@/components/Code/CodeGroupFormDialog";
import { CodeFormDialog } from "@/components/Code/CodeFormDialog";
import { usePermission } from "@/features/permission/usePermission";

export default function CodesPage() {
  const [groups, setGroups] = useState<CodeGroupResponse[]>([]);
  const [codes, setCodes] = useState<CodeResponse[]>([]);
  const [selectedGroupCode, setSelectedGroupCode] = useState("");

  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [groupDialogMode, setGroupDialogMode] = useState<"create" | "edit">(
    "create",
  );
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [groupCode, setGroupCode] = useState("");
  const [groupNm, setGroupNm] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupStatus, setGroupStatus] = useState("ACTIVE");

  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [codeDialogMode, setCodeDialogMode] = useState<"create" | "edit">(
    "create",
  );
  const [editingCodeId, setEditingCodeId] = useState<number | null>(null);
  const [codeGroupId, setCodeGroupId] = useState("");
  const [code, setCode] = useState("");
  const [codeNm, setCodeNm] = useState("");
  const [codeDescription, setCodeDescription] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [codeStatus, setCodeStatus] = useState("ACTIVE");
  const [extraValue, setExtraValue] = useState("");

  const { canCreate, canUpdate } = usePermission("/dashboard/codes");
  const { showError, showSuccess, showLoading, hideLoading } = useFeedback();

  const groupOptions = useMemo(
    () =>
      groups.map((group) => ({
        label: `${group.groupNm} (${group.groupCode})`,
        value: String(group.id),
      })),
    [groups],
  );

  const groupFilterOptions = useMemo(
    () => [
      { label: "전체", value: "" },
      ...groups.map((group) => ({
        label: `${group.groupNm} (${group.groupCode})`,
        value: group.groupCode,
      })),
    ],
    [groups],
  );

  const loadGroups = async () => {
    const result = await getCodeGroups();
    setGroups(result.data);
  };

  const loadCodes = async (groupCode?: string) => {
    const result = groupCode
      ? await getCodesByGroupCode(groupCode)
      : await getCodes();
    setCodes(result.data);
  };

  const initialize = useCallback(async () => {
    try {
      showLoading();
      await loadGroups();
      await loadCodes(selectedGroupCode || undefined);
    } catch (error) {
      handleApiError(error, {
        showError,
        fallbackMessage: "코드 관리 화면 조회에 실패했습니다.",
      });
    } finally {
      hideLoading();
    }
  }, [hideLoading, selectedGroupCode, showError, showLoading]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const resetGroupForm = () => {
    setEditingGroupId(null);
    setGroupCode("");
    setGroupNm("");
    setGroupDescription("");
    setGroupStatus("ACTIVE");
  };

  const resetCodeForm = () => {
    setEditingCodeId(null);
    setCodeGroupId("");
    setCode("");
    setCodeNm("");
    setCodeDescription("");
    setSortOrder("0");
    setCodeStatus("ACTIVE");
    setExtraValue("");
  };

  const openCreateGroupDialog = () => {
    resetGroupForm();
    setGroupDialogMode("create");
    setGroupDialogOpen(true);
  };

  const openEditGroupDialog = (row: CodeGroupResponse) => {
    setEditingGroupId(row.id);
    setGroupCode(row.groupCode);
    setGroupNm(row.groupNm);
    setGroupDescription(row.description ?? "");
    setGroupStatus(row.status);
    setGroupDialogMode("edit");
    setGroupDialogOpen(true);
  };

  const openCreateCodeDialog = () => {
    resetCodeForm();
    setCodeGroupId(groups[0] ? String(groups[0].id) : "");
    setCodeDialogMode("create");
    setCodeDialogOpen(true);
  };

  const openEditCodeDialog = (row: CodeResponse) => {
    setEditingCodeId(row.id);
    setCodeGroupId(String(row.groupId));
    setCode(row.code);
    setCodeNm(row.codeNm);
    setCodeDescription(row.description ?? "");
    setSortOrder(String(row.sortOrder ?? 0));
    setCodeStatus(row.status);
    setExtraValue(row.extraValue ?? "");
    setCodeDialogMode("edit");
    setCodeDialogOpen(true);
  };

  const handleSubmitGroup = async () => {
    if (!groupCode.trim() && groupDialogMode === "create") {
      showError("그룹 코드를 입력해주세요.");
      return;
    }

    if (!groupNm.trim()) {
      showError("그룹명을 입력해주세요.");
      return;
    }

    try {
      showLoading();

      if (groupDialogMode === "create") {
        await createCodeGroup({
          groupCode,
          groupNm,
          description: groupDescription,
          status: groupStatus,
        });
        showSuccess("코드 그룹이 등록되었습니다.");
      } else if (editingGroupId != null) {
        await updateCodeGroup(editingGroupId, {
          groupNm,
          description: groupDescription,
          status: groupStatus,
        });
        showSuccess("코드 그룹이 수정되었습니다.");
      }

      setGroupDialogOpen(false);
      resetGroupForm();
      await loadGroups();
    } catch (error) {
      handleApiError(error, {
        showError,
        fallbackMessage:
          groupDialogMode === "create"
            ? "코드 그룹 등록에 실패했습니다."
            : "코드 그룹 수정에 실패했습니다.",
      });
    } finally {
      hideLoading();
    }
  };

  const handleSubmitCode = async () => {
    if (!codeGroupId) {
      showError("코드 그룹을 선택해주세요.");
      return;
    }

    if (!code.trim() && codeDialogMode === "create") {
      showError("코드를 입력해주세요.");
      return;
    }

    if (!codeNm.trim()) {
      showError("코드명을 입력해주세요.");
      return;
    }

    try {
      showLoading();

      if (codeDialogMode === "create") {
        await createCode({
          groupId: Number(codeGroupId),
          code,
          codeNm,
          description: codeDescription,
          sortOrder: Number(sortOrder || 0),
          status: codeStatus,
          extraValue,
        });
        showSuccess("코드가 등록되었습니다.");
      } else if (editingCodeId != null) {
        await updateCode(editingCodeId, {
          codeNm,
          description: codeDescription,
          sortOrder: Number(sortOrder || 0),
          status: codeStatus,
          extraValue,
        });
        showSuccess("코드가 수정되었습니다.");
      }

      setCodeDialogOpen(false);
      resetCodeForm();
      await loadCodes(selectedGroupCode || undefined);
    } catch (error) {
      handleApiError(error, {
        showError,
        fallbackMessage:
          codeDialogMode === "create"
            ? "코드 등록에 실패했습니다."
            : "코드 수정에 실패했습니다.",
      });
    } finally {
      hideLoading();
    }
  };

  const groupColumns: DataTableColumn<CodeGroupResponse>[] = [
    { key: "groupCode", header: "그룹 코드", render: (row) => row.groupCode },
    { key: "groupNm", header: "그룹명", render: (row) => row.groupNm },
    {
      key: "description",
      header: "설명",
      render: (row) => row.description ?? "-",
    },
    { key: "status", header: "상태", render: (row) => row.status },
    {
      key: "action",
      header: "액션",
      render: (row) =>
        canUpdate ? (
          <AppButton onClick={() => openEditGroupDialog(row)}>수정</AppButton>
        ) : null,
    },
  ];

  const codeColumns: DataTableColumn<CodeResponse>[] = [
    { key: "groupCode", header: "그룹 코드", render: (row) => row.groupCode },
    { key: "code", header: "코드", render: (row) => row.code },
    { key: "codeNm", header: "코드명", render: (row) => row.codeNm },
    {
      key: "description",
      header: "설명",
      render: (row) => row.description ?? "-",
    },
    { key: "sortOrder", header: "정렬", render: (row) => row.sortOrder },
    { key: "status", header: "상태", render: (row) => row.status },
    {
      key: "extraValue",
      header: "추가값",
      render: (row) => row.extraValue ?? "-",
    },
    {
      key: "action",
      header: "액션",
      render: (row) =>
        canUpdate ? (
          <AppButton onClick={() => openEditCodeDialog(row)}>수정</AppButton>
        ) : null,
    },
  ];

  return (
    <>
      <PageHeader title="코드 관리" description="공통 코드 및 그룹 관리" />

      <Stack spacing={3}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <PageHeader
            title="코드 그룹"
            description={`전체 ${groups.length}건`}
            actions={
              canCreate ? (
                <AppButton onClick={openCreateGroupDialog}>그룹 등록</AppButton>
              ) : null
            }
          />
          <DataTable
            rows={groups}
            columns={groupColumns}
            loading={false}
            emptyMessage="코드 그룹이 없습니다."
          />
        </Paper>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Box mb={2} maxWidth={320}>
            <FormSelectField
              label="그룹 필터"
              value={selectedGroupCode}
              onChange={(e) => setSelectedGroupCode(e.target.value)}
              options={groupFilterOptions}
            />
          </Box>

          <PageHeader
            title="코드"
            description={`전체 ${codes.length}건`}
            actions={
              canCreate ? (
                <AppButton onClick={openCreateCodeDialog}>코드 등록</AppButton>
              ) : null
            }
          />

          <DataTable
            rows={codes}
            columns={codeColumns}
            loading={false}
            emptyMessage="코드가 없습니다."
          />
        </Paper>
      </Stack>

      <CodeGroupFormDialog
        open={groupDialogOpen}
        mode={groupDialogMode}
        groupCode={groupCode}
        groupNm={groupNm}
        description={groupDescription}
        status={groupStatus}
        onChangeGroupCode={setGroupCode}
        onChangeGroupNm={setGroupNm}
        onChangeDescription={setGroupDescription}
        onChangeStatus={setGroupStatus}
        onSubmit={handleSubmitGroup}
        onClose={() => {
          setGroupDialogOpen(false);
          resetGroupForm();
        }}
      />

      <CodeFormDialog
        open={codeDialogOpen}
        mode={codeDialogMode}
        groupId={codeGroupId}
        code={code}
        codeNm={codeNm}
        description={codeDescription}
        sortOrder={sortOrder}
        status={codeStatus}
        extraValue={extraValue}
        groupOptions={groupOptions}
        onChangeGroupId={setCodeGroupId}
        onChangeCode={setCode}
        onChangeCodeNm={setCodeNm}
        onChangeDescription={setCodeDescription}
        onChangeSortOrder={setSortOrder}
        onChangeStatus={setCodeStatus}
        onChangeExtraValue={setExtraValue}
        onSubmit={handleSubmitCode}
        onClose={() => {
          setCodeDialogOpen(false);
          resetCodeForm();
        }}
      />
    </>
  );
}
