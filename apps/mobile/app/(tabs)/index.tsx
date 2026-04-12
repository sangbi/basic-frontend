import { useEffect, useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { mobileGetMe, mobileLogin, mobileLogout } from "@/src/lib/api/authApi";
import { mobileTokenStorage } from "@/src/lib/mobileTokenStorage";

export default function HomeScreen() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [me, setMe] = useState<string>("");

  const handleLogin = async () => {
    try {
      setMessage("로그인 중...");

      const result = await mobileLogin({
        userId,
        password,
      });

      await mobileTokenStorage.setAccessToken(result.data.accessToken);
      setMessage("로그인 성공");
    } catch (error) {
      console.error(error);
      setMessage("로그인 실패");
    }
  };

  const handleMe = async () => {
    try {
      const result = await mobileGetMe();
      setMe(`${result.data.userId} (${result.data.role})`);
      setMessage("내 정보 조회 성공");
    } catch (error) {
      console.error(error);
      setMessage("내 정보 조회 실패");
    }
  };

  const handleLogout = async () => {
    try {
      await mobileLogout();
    } catch (error) {
      console.error(error);
    } finally {
      await mobileTokenStorage.clear();
      setMe("");
      setMessage("로그아웃");
    }
  };

  useEffect(() => {
    const init = async () => {
      const token = await mobileTokenStorage.getAccessToken();
      if (token) {
        setMessage("저장된 토큰 있음");
      }
    };

    init();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 24,
        gap: 12,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 12 }}>
        Mobile Login
      </Text>

      <TextInput
        placeholder="아이디"
        value={userId}
        onChangeText={setUserId}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          color: "#ccc",
          padding: 12,
          borderRadius: 8,
        }}
      />

      <TextInput
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          color: "#ccc",
          padding: 12,
          borderRadius: 8,
        }}
      />

      <Button title="로그인" onPress={handleLogin} />
      <Button title="내 정보 조회" onPress={handleMe} />
      <Button title="로그아웃" onPress={handleLogout} />

      <Text style={{ marginTop: 16, color: "#ccc" }}>{message}</Text>
      <Text>{me}</Text>
    </View>
  );
}
