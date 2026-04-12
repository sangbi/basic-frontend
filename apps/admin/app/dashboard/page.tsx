"use client";

import { useQuery } from "@tanstack/react-query";
import { Box, Paper, Typography } from "@mui/material";
import { getAdminDashboardSummary, handleApiError } from "@repo/api";
import { PageHeader, useFeedback } from "@repo/ui";
import { useAdminAuthGuard } from "@/features/auth/useAdminAuthGuard";

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
  const { showError } = useFeedback();
  const { loading, authorized } = useAdminAuthGuard({
    requiredRoles: ["ADMIN"],
    redirectTo: "/login",
  });

  const summaryQuery = useQuery({
    queryKey: ["admin", "dashboard", "summary"],
    queryFn: getAdminDashboardSummary,
    enabled: !loading && authorized,
  });

  if (summaryQuery.error) {
    handleApiError(summaryQuery.error, {
      showError,
      fallbackMessage: "대시보드 요약 조회에 실패했습니다.",
    });
  }

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
          value={summaryQuery.data?.data.todayLoginSuccessCount ?? 0}
        />
        <SummaryCard
          title="오늘 로그인 실패"
          value={summaryQuery.data?.data.todayLoginFailCount ?? 0}
        />
        <SummaryCard
          title="현재 활성 세션"
          value={summaryQuery.data?.data.activeSessionCount ?? 0}
        />
        <SummaryCard
          title="오늘 활동 로그"
          value={summaryQuery.data?.data.todayActivityLogCount ?? 0}
        />
      </Box>
    </>
  );
}
