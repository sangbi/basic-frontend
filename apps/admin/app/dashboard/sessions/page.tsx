"use client";

import { useEffect, useState } from "react";
import { getActiveSessions } from "@repo/api";
import type { UserSessionResponse } from "@repo/types";
import { DataTable, type DataTableColumn, PageHeader } from "@repo/ui";
import { useFeedback } from "@repo/ui";

export default function SessionsPage() {
  const [rows, setRows] = useState<UserSessionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const { showError } = useFeedback();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await getActiveSessions();
        setRows(result.data);
      } catch (error) {
        showError("활성 세션 조회에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [showError]);

  const columns: DataTableColumn<UserSessionResponse>[] = [
    { key: "id", header: "ID", render: (row) => row.id },
    { key: "userId", header: "사용자", render: (row) => row.userId },
    { key: "ipAddress", header: "IP", render: (row) => row.ipAddress ?? "-" },
    { key: "status", header: "상태", render: (row) => row.status },
    { key: "loginAt", header: "로그인 시각", render: (row) => row.loginAt },
    {
      key: "lastAccessAt",
      header: "마지막 접근",
      render: (row) => row.lastAccessAt,
    },
  ];

  return (
    <>
      <PageHeader title="활성 세션" />
      <DataTable
        rows={rows}
        columns={columns}
        loading={loading}
        emptyMessage="데이터가 없습니다."
      />
    </>
  );
}
