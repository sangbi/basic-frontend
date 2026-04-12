"use client";

import { Box, Typography } from "@mui/material";
import { AppButton } from "@repo/ui";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>
        Frontend Basic Ready
      </Typography>
      <AppButton onClick={() => router.push("/login")}>
        로그인 페이지로 이동
      </AppButton>
    </Box>
  );
}
