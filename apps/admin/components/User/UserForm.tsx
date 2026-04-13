"use client";

import { FormSection, FormSelectField, FormTextField } from "@repo/ui";

type Props = {
  mode: "create" | "edit";
  userId: string;
  userNm: string;
  password: string;
  roleId: number;
  onChangeUserId: (value: string) => void;
  onChangeUserNm: (value: string) => void;
  onChangePassword: (value: string) => void;
  onChangeRoleId: (value: number) => void;
};

export function UserForm({
  mode,
  userId,
  userNm,
  password,
  roleId,
  onChangeUserId,
  onChangeUserNm,
  onChangePassword,
  onChangeRoleId,
}: Props) {
  return (
    <FormSection title={mode === "edit" ? "사용자 정보" : undefined}>
      <FormTextField
        label="아이디"
        value={userId}
        onChange={(e) => onChangeUserId(e.target.value)}
        disabled={mode === "edit"}
      />

      {mode === "create" ? (
        <FormTextField
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => onChangePassword(e.target.value)}
        />
      ) : null}

      <FormTextField
        label="이름"
        value={userNm}
        onChange={(e) => onChangeUserNm(e.target.value)}
      />

      <FormSelectField
        label="권한"
        value={roleId}
        onChange={(e) => onChangeRoleId(Number(e.target.value))}
        options={[
          { label: "USER", value: "3" },
          { label: "ADMIN", value: "1" },
        ]}
      />
    </FormSection>
  );
}
