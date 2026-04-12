"use client";

import { useEffect, useState } from "react";
import { getRoles } from "@repo/api";
import type { RoleResponse } from "@repo/types";
import {
  DataTable,
  type DataTableColumn,
  PageHeader,
  useFeedback,
} from "@repo/ui";

export default function RolesPage() {
  const [rows, setRows] = useState<RoleResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const { showError } = useFeedback();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await getRoles();
        setRows(result.data);
      } catch (error) {
        console.error(error);
        showError("역할 목록 조회에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [showError]);

  const columns: DataTableColumn<RoleResponse>[] = [
    { key: "id", header: "ID", render: (row) => row.id },
    { key: "roleCode", header: "역할 코드", render: (row) => row.roleCode },
    { key: "roleName", header: "역할명", render: (row) => row.roleNm },
    {
      key: "description",
      header: "설명",
      render: (row) => row.description ?? "-",
    },
    { key: "status", header: "상태", render: (row) => row.status },
  ];

  return (
    <>
      <PageHeader title="역할 관리" description={`전체 ${rows.length}건`} />
      <DataTable
        rows={rows}
        columns={columns}
        loading={loading}
        emptyMessage="역할 데이터가 없습니다."
      />
    </>
  );
}
