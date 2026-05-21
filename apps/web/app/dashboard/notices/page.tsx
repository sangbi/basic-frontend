"use client";

import { queryKeys } from "@/src/lib/queryKeys";
import {
  Box,
  Pagination,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { searchWebNotices } from "@repo/api";
import type { NoticeSearchCondition, PageRequest } from "@repo/types";
import { AppButton, PageHeader, useFeedback } from "@repo/ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

export default function WebNoticesPage() {
  const { showInfo } = useFeedback();
  const [page, setPage] = useState(1);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchParam, setSearchParam] = useState<
    PageRequest<NoticeSearchCondition>
  >({
    page,
    size: 10,
    condition: {
      title: searchTitle,
    },
  });

  const queryClient = useQueryClient();
  const search = useQuery({
    queryKey: queryKeys.notices(searchParam),
    queryFn: () => searchWebNotices(searchParam),
  });
  const rows = search.data?.data.items ?? [];
  const totalPages = search.data?.data.totalPages ?? 0;
  const totalCount = search.data?.data.totalCount ?? 0;
  const rerfesh = () => {
    queryClient.invalidateQueries({ queryKey: ["notices"] });
  };

  const handleSearch = async () => {
    setPage(1);
    setSearchParam((prev) => ({
      ...prev,
      condition: {
        ...prev.condition,
        title: searchTitle,
      },
    }));
    showInfo("검색 조건이 적용되었습니다.");
    rerfesh();
  };

  const handleRefresh = async () => {
    setPage(1);
    setSearchTitle("");
    setSearchParam({
      page: 1,
      size: 10,
      condition: {
        title: "",
      },
    });
    showInfo("검색이 완료되었습니다.");
  };

  return (
    <Box maxWidth={960} mx="auto" py={4}>
      <PageHeader
        title="공지사항"
        description={`전체 ${totalCount}건`}
        actions={
          <Stack display="flex" direction="row" spacing={1}>
            <TextField
              label="제목"
              value={searchTitle}
              size="small"
              onChange={(e) => setSearchTitle(e.target.value)}
              fullWidth
            />
            <AppButton
              sx={{ whiteSpace: "nowrap" }}
              size="small"
              onClick={handleRefresh}
            >
              초기화
            </AppButton>
            <AppButton
              sx={{ whiteSpace: "nowrap" }}
              size="small"
              onClick={handleSearch}
            >
              검색
            </AppButton>
          </Stack>
        }
      />

      <Stack spacing={1.5}>
        {rows.map((notice) => (
          <Paper key={notice.id} variant="outlined" sx={{ p: 2 }}>
            <Link
              href={`/dashboard/notices/${notice.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Typography variant="h6" fontWeight={600}>
                {notice.pinnedYn === "Y" ? "[고정] " : ""}
                {notice.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {notice.noticeType} · 조회수 {notice.viewCnt} ·{" "}
                {notice.createdAt}
              </Typography>
            </Link>
          </Paper>
        ))}
      </Stack>

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          page={page}
          count={Math.max(totalPages, 1)}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
}
