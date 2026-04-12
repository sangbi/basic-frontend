"use client";

import { useEffect, useState } from "react";
import { getActivityLogs } from "@repo/api";
import type { ActivityLogResponse } from "@repo/types";
import { DataTable, type DataTableColumn, PageHeader } from "@repo/ui";
import { useFeedback } from "@repo/ui";

export default function ActivityLogsPage() {
  const [rows, setRows] = useState<ActivityLogResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const { showError } = useFeedback();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await getActivityLogs();
        setRows(result.data);
      } catch (error) {
        console.log(error);
        showError("활동 로그 조회에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [showError]);

  const columns: DataTableColumn<ActivityLogResponse>[] = [
    { key: "id", header: "ID", render: (row) => row.id },
    { key: "userId", header: "사용자", render: (row) => row.userId ?? "-" },
    { key: "actionType", header: "액션", render: (row) => row.actionType },
    {
      key: "httpMethod",
      header: "메서드",
      render: (row) => row.httpMethod ?? "-",
    },
    {
      key: "requestUri",
      header: "URI",
      render: (row) => row.requestUri ?? "-",
    },
    {
      key: "responseCode",
      header: "응답코드",
      render: (row) => row.responseCode ?? "-",
    },
    { key: "createdAt", header: "시각", render: (row) => row.createdAt },
  ];

  return (
    <>
      <PageHeader title="활동 로그" />
      <DataTable
        rows={rows}
        columns={columns}
        loading={loading}
        emptyMessage="데이터가 없습니다."
      />
    </>
  );
}
