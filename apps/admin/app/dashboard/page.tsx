"use client";

import { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { getAdminDashboardSummary } from "@repo/api";
import type { AdminDashboardSummaryResponse } from "@repo/types";
import { PageHeader, useFeedback } from "@repo/ui";

type SummaryCardProps = {
  title: string;
  value: number;
};

function SummaryCard({ title, value }: SummaryCardProps) {
  return (
    <Paper elevation={1} sx={{ p: 3, flex: 1 }}>
      <Typography variant="body2" color="text.secondary" mb={1}>
        {title}
      </Typography>
      <Typography variant="h4" fontWeight={700}>
        {value}
      </Typography>
    </Paper>
  );
}

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<AdminDashboardSummaryResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const { showError } = useFeedback();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await getAdminDashboardSummary();
        setSummary(result.data);
      } catch (error) {
        showError("대시보드 요약 조회에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [showError]);

  return (
    <>
      <PageHeader title="관리자 대시보드" description="운영 요약 정보" />

      <Box
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          md: "1fr 1fr",
          xl: "1fr 1fr 1fr 1fr",
        }}
        gap={2}
      >
        <SummaryCard
          title="오늘 로그인 성공"
          value={summary?.todayLoginSuccessCount ?? 0}
        />
        <SummaryCard
          title="오늘 로그인 실패"
          value={summary?.todayLoginFailCount ?? 0}
        />
        <SummaryCard
          title="현재 활성 세션"
          value={summary?.activeSessionCount ?? 0}
        />
        <SummaryCard
          title="오늘 활동 로그"
          value={summary?.todayActivityLogCount ?? 0}
        />
      </Box>

      {loading ? <Typography mt={3}>불러오는 중...</Typography> : null}
    </>
  );
}
