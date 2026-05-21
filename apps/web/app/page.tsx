"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { searchWebNotices, searchWebResources } from "@repo/api";
import type { NoticeResponse, ResourceResponse } from "@repo/types";

export default function WebHomePage() {
  const [notices, setNotices] = useState<NoticeResponse[]>([]);
  const [resources, setResources] = useState<ResourceResponse[]>([]);

  useEffect(() => {
    const load = async () => {
      const [noticeResult, resourceResult] = await Promise.all([
        searchWebNotices({ page: 1, size: 5, condition: {} }),
        searchWebResources({ page: 1, size: 5, condition: {} }),
      ]);

      setNotices(noticeResult.data.items);
      setResources(resourceResult.data.items);
    };

    load();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={5}>
        <Typography variant="h3" fontWeight={800} mb={1}>
          Basic Framework
        </Typography>
        <Typography variant="body1" color="text.secondary">
          공지사항과 자료실을 확인할 수 있습니다.
        </Typography>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
        gap={3}
      >
        <Section
          title="최근 공지사항"
          moreHref="/dashboard/notices"
          items={notices.map((item) => ({
            id: item.id,
            title: item.title,
            href: `/notices/${item.id}`,
            meta: `${item.noticeType} · 조회수 ${item.viewCnt}`,
            pinned: item.pinnedYn === "Y",
          }))}
        />

        <Section
          title="최근 자료실"
          moreHref="/dashboard/resources"
          items={resources.map((item) => ({
            id: item.id,
            title: item.title,
            href: `/resources/${item.id}`,
            meta: `조회수 ${item.viewCnt}`,
            pinned: item.pinnedYn === "Y",
          }))}
        />
      </Box>
    </Container>
  );
}

type SectionItem = {
  id: number;
  title: string;
  href: string;
  meta: string;
  pinned: boolean;
};

function Section({
  title,
  moreHref,
  items,
}: {
  title: string;
  moreHref: string;
  items: SectionItem[];
}) {
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={700} flex={1}>
          {title}
        </Typography>
        <Button component={Link} href={moreHref} size="small">
          더보기
        </Button>
      </Box>

      <Stack spacing={1.5}>
        {items.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            데이터가 없습니다.
          </Typography>
        ) : (
          items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Box>
                <Typography variant="body1" fontWeight={600}>
                  {item.pinned ? "[고정] " : ""}
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.meta}
                </Typography>
              </Box>
            </Link>
          ))
        )}
      </Stack>
    </Paper>
  );
}
