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
  createMenu,
  getMenu,
  getMenus,
  updateMenu,
  handleApiError,
} from "@repo/api";
import type { MenuResponse } from "@repo/types";
import { MenuFormDialog } from "@/components/Menu/MenuFormDialog";
import { usePermission } from "@/features/permission/usePermission";

export default function MenusPage() {
  const {
    canCreate,
    canUpdate,
    canDelete,
    loading: permissionLoading,
  } = usePermission("/dashboard/menus");
  const [rows, setRows] = useState<MenuResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [menuNm, setMenuNm] = useState("");
  const [menuPath, setMenuPath] = useState("");
  const [apiPath, setApiPath] = useState("");
  const [parentId, setParentId] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [icon, setIcon] = useState("");
  const [visibleYn, setVisibleYn] = useState("Y");
  const [status, setStatus] = useState("ACTIVE");

  const { showError, showSuccess, showLoading, hideLoading } = useFeedback();

  const menuMap = new Map(rows.map((row) => [row.id, row]));

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getMenus();
      setRows(result.data);
    } catch (error) {
      handleApiError(error, {
        showError,
        fallbackMessage: "메뉴 목록 조회에 실패했습니다.",
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
    setMenuNm("");
    setMenuPath("");
    setApiPath("");
    setParentId("");
    setSortOrder("0");
    setIcon("");
    setVisibleYn("Y");
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
      const result = await getMenu(id);
      const menu = result.data;

      setSelectedId(menu.id);
      setMenuNm(menu.menuNm);
      setMenuPath(menu.menuPath ?? "");
      setApiPath(menu.apiPath ?? "");
      setParentId(menu.parentId != null ? String(menu.parentId) : "");
      setSortOrder(String(menu.sortOrder ?? 0));
      setIcon(menu.icon ?? "");
      setVisibleYn(menu.visibleYn);
      setStatus(menu.status);

      setFormMode("edit");
      setFormOpen(true);
    } catch (error) {
      handleApiError(error, {
        showError,
        fallbackMessage: "메뉴 상세 조회에 실패했습니다.",
      });
    } finally {
      hideLoading();
    }
  };

  const handleSubmit = async () => {
    if (!menuNm.trim()) {
      showError("메뉴명을 입력해주세요.");
      return;
    }

    showLoading();
    try {
      const payload = {
        menuNm: menuNm,
        menuPath,
        apiPath,
        parentId: parentId.trim() ? Number(parentId) : null,
        sortOrder: Number(sortOrder || 0),
        icon,
        visibleYn,
        status,
      };

      if (formMode === "create") {
        await createMenu(payload);
        showSuccess("메뉴가 등록되었습니다.");
      } else if (selectedId != null) {
        await updateMenu(selectedId, payload);
        showSuccess("메뉴가 수정되었습니다.");
      }

      setFormOpen(false);
      resetForm();
      await load();
    } catch (error) {
      handleApiError(error, {
        showError,
        fallbackMessage:
          formMode === "create"
            ? "메뉴 등록에 실패했습니다."
            : "메뉴 수정에 실패했습니다.",
      });
    } finally {
      hideLoading();
    }
  };

  const columns: DataTableColumn<MenuResponse>[] = [
    { key: "id", header: "ID", render: (row) => row.id },
    {
      key: "menuName",
      header: "메뉴명",
      render: (row) => {
        const isChild = row.parentId != null;
        return `${isChild ? "└ " : ""}${row.menuNm}`;
      },
    },
    { key: "menuPath", header: "경로", render: (row) => row.menuPath ?? "-" },
    { key: "apiPath", header: "API경로", render: (row) => row.apiPath ?? "-" },
    {
      key: "parentId",
      header: "상위 메뉴",
      render: (row) =>
        row.parentId != null
          ? (menuMap.get(row.parentId)?.menuNm ?? row.parentId)
          : "-",
    },
    { key: "sortOrder", header: "정렬", render: (row) => row.sortOrder },
    { key: "visibleYn", header: "노출", render: (row) => row.visibleYn },
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
  const parentOptions = rows
    .filter((row) => row.parentId == null)
    .map((row) => ({
      label: row.menuNm,
      value: String(row.id),
    }));

  return (
    <>
      <PageHeader
        title="메뉴 관리"
        description={`전체 ${rows.length}건`}
        actions={
          canCreate && <AppButton onClick={openCreateDialog}>등록</AppButton>
        }
      />

      <DataTable
        rows={rows}
        columns={columns}
        loading={loading}
        emptyMessage="메뉴 데이터가 없습니다."
      />

      <MenuFormDialog
        open={formOpen}
        mode={formMode}
        menuNm={menuNm}
        menuPath={menuPath}
        apiPath={apiPath}
        parentId={parentId}
        sortOrder={sortOrder}
        icon={icon}
        visibleYn={visibleYn}
        status={status}
        parentOptions={parentOptions}
        onChangeMenuNm={setMenuNm}
        onChangeMenuPath={setMenuPath}
        onChangeApiPath={setApiPath}
        onChangeParentId={setParentId}
        onChangeSortOrder={setSortOrder}
        onChangeIcon={setIcon}
        onChangeVisibleYn={setVisibleYn}
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
