"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { getMenuRoles, updateMenuRole } from "@repo/api";
import type { MenuRoleResponse } from "@repo/types";
import {
  AppButton,
  DataTable,
  type DataTableColumn,
  PageHeader,
  useFeedback,
} from "@repo/ui";

type Yn = "Y" | "N";

export default function MenuRolesPage() {
  const [rows, setRows] = useState<MenuRoleResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<MenuRoleResponse | null>(null);

  const [canRead, setCanRead] = useState<Yn>("Y");
  const [canCreate, setCanCreate] = useState<Yn>("N");
  const [canUpdate, setCanUpdate] = useState<Yn>("N");
  const [canDelete, setCanDelete] = useState<Yn>("N");

  const { showError, showSuccess, showLoading, hideLoading } = useFeedback();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getMenuRoles();
      setRows(result.data);
    } catch (error) {
      console.error(error);
      showError("메뉴 권한 목록 조회에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    load();
  }, [load]);

  const openDialog = (row: MenuRoleResponse) => {
    setSelected(row);
    setCanRead((row.canRead as Yn) ?? "N");
    setCanCreate((row.canCreate as Yn) ?? "N");
    setCanUpdate((row.canUpdate as Yn) ?? "N");
    setCanDelete((row.canDelete as Yn) ?? "N");
    setOpen(true);
  };

  const handleSave = async () => {
    if (!selected) return;

    showLoading();
    try {
      await updateMenuRole(selected.id, {
        canRead,
        canCreate,
        canUpdate,
        canDelete,
      });

      showSuccess("메뉴 권한이 수정되었습니다.");
      setOpen(false);
      setSelected(null);
      await load();
    } catch (error) {
      console.error(error);
      showError("메뉴 권한 수정에 실패했습니다.");
    } finally {
      hideLoading();
    }
  };

  const columns: DataTableColumn<MenuRoleResponse>[] = [
    { key: "id", header: "ID", render: (row) => row.id },
    { key: "roleCode", header: "역할", render: (row) => row.roleCode },
    { key: "menuName", header: "메뉴", render: (row) => row.menuNm },
    { key: "canRead", header: "조회", render: (row) => row.canRead },
    { key: "canCreate", header: "등록", render: (row) => row.canCreate },
    { key: "canUpdate", header: "수정", render: (row) => row.canUpdate },
    { key: "canDelete", header: "삭제", render: (row) => row.canDelete },
    {
      key: "action",
      header: "액션",
      render: (row) => (
        <AppButton onClick={() => openDialog(row)}>수정</AppButton>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="메뉴 권한 관리"
        description={`전체 ${rows.length}건`}
      />

      <DataTable
        rows={rows}
        columns={columns}
        loading={loading}
        emptyMessage="메뉴 권한 데이터가 없습니다."
      />

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>메뉴 권한 수정</DialogTitle>

        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="역할"
              value={selected?.roleCode ?? ""}
              disabled
              fullWidth
            />
            <TextField
              label="메뉴"
              value={selected?.menuNm ?? ""}
              disabled
              fullWidth
            />

            <TextField
              select
              label="조회"
              value={canRead}
              onChange={(e) => setCanRead(e.target.value as Yn)}
              fullWidth
            >
              <MenuItem value="Y">Y</MenuItem>
              <MenuItem value="N">N</MenuItem>
            </TextField>

            <TextField
              select
              label="등록"
              value={canCreate}
              onChange={(e) => setCanCreate(e.target.value as Yn)}
              fullWidth
            >
              <MenuItem value="Y">Y</MenuItem>
              <MenuItem value="N">N</MenuItem>
            </TextField>

            <TextField
              select
              label="수정"
              value={canUpdate}
              onChange={(e) => setCanUpdate(e.target.value as Yn)}
              fullWidth
            >
              <MenuItem value="Y">Y</MenuItem>
              <MenuItem value="N">N</MenuItem>
            </TextField>

            <TextField
              select
              label="삭제"
              value={canDelete}
              onChange={(e) => setCanDelete(e.target.value as Yn)}
              fullWidth
            >
              <MenuItem value="Y">Y</MenuItem>
              <MenuItem value="N">N</MenuItem>
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>취소</Button>
          <Button variant="contained" onClick={handleSave}>
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
