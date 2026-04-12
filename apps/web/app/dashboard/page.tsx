"use client";

import { Box, Typography } from "@mui/material";

export default function DashboardPage() {
  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>
        대시보드
      </Typography>
      <Typography variant="body1">
        공통 레이아웃 셸이 적용된 기본 페이지입니다.
      </Typography>
    </Box>
  );
}
