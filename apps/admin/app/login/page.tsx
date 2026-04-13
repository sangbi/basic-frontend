"use client";

import { Box, TextField, Typography } from "@mui/material";
import { handleApiError, login } from "@repo/api";
import { tokenStorage } from "@repo/auth";
import { AppButton } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [userId, setUserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // 로그인 함수
  const handleLogin = async () => {
    try {
      setLoading(true);

      const result = await login({ userId, password });

      tokenStorage.setAccessToken(result.data.accessToken);

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("로그인에 실패했습니다.");
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display={"flex"}
      minHeight={"100vh"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Box width={360} display={"flex"} flexDirection={"column"} gap={2}>
        <Typography variant="h4">로그인</Typography>

        <TextField
          label="아이디"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <TextField
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <AppButton onClick={handleLogin} disabled={loading}>
          로그인
        </AppButton>
      </Box>
    </Box>
  );
}
