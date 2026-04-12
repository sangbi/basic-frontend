"use client";

import { useEffect, useState } from "react";
import { getMenus } from "@repo/api";
import type { MenuResponse } from "@repo/types";
import {
  DataTable,
  type DataTableColumn,
  PageHeader,
  useFeedback,
} from "@repo/ui";

export default function MenusPage() {
  const [rows, setRows] = useState<MenuResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const { showError } = useFeedback();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await getMenus();
        setRows(result.data);
      } catch (error) {
        console.error(error);
        showError("메뉴 목록 조회에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [showError]);

  const columns: DataTableColumn<MenuResponse>[] = [
    { key: "id", header: "ID", render: (row) => row.id },
    { key: "menuName", header: "메뉴명", render: (row) => row.menuNm },
    { key: "menuPath", header: "경로", render: (row) => row.menuPath ?? "-" },
    {
      key: "parentId",
      header: "상위 메뉴 ID",
      render: (row) => row.parentId ?? "-",
    },
    { key: "sortOrder", header: "정렬", render: (row) => row.sortOrder },
    { key: "visibleYn", header: "노출", render: (row) => row.visibleYn },
    { key: "status", header: "상태", render: (row) => row.status },
  ];

  return (
    <>
      <PageHeader title="메뉴 관리" description={`전체 ${rows.length}건`} />
      <DataTable
        rows={rows}
        columns={columns}
        loading={loading}
        emptyMessage="메뉴 데이터가 없습니다."
      />
    </>
  );
}
