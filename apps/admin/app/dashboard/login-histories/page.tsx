"use client";

import { useEffect, useState } from "react";
import { getLoginHistories } from "@repo/api";
import type { LoginHistoryResponse } from "@repo/types";
import { DataTable, type DataTableColumn, PageHeader } from "@repo/ui";
import { useFeedback } from "@repo/ui";

export default function LoginHistoriesPage() {
  const [rows, setRows] = useState<LoginHistoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const { showError } = useFeedback();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await getLoginHistories();
        setRows(result.data);
      } catch (error) {
        console.log(error);
        showError("로그인 이력 조회에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [showError]);

  const columns: DataTableColumn<LoginHistoryResponse>[] = [
    { key: "id", header: "ID", render: (row) => row.id },
    { key: "userId", header: "사용자", render: (row) => row.userId },
    { key: "loginResult", header: "결과", render: (row) => row.loginResult },
    { key: "ipAddress", header: "IP", render: (row) => row.ipAddress ?? "-" },
    { key: "loginAt", header: "로그인 시각", render: (row) => row.loginAt },
    {
      key: "logoutAt",
      header: "로그아웃 시각",
      render: (row) => row.logoutAt ?? "-",
    },
  ];

  return (
    <>
      <PageHeader title="로그인 이력" />
      <DataTable
        rows={rows}
        columns={columns}
        loading={loading}
        emptyMessage="데이터가 없습니다."
      />
    </>
  );
}
