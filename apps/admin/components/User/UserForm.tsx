"use client";

import { FormSection, FormSelectField, FormTextField } from "@repo/ui";

type Props = {
  mode: "create" | "edit";
  userId: string;
  password: string;
  role: string;
  onChangeUserId: (value: string) => void;
  onChangePassword: (value: string) => void;
  onChangeRole: (value: string) => void;
};

export function UserForm({
  mode,
  userId,
  password,
  role,
  onChangeUserId,
  onChangePassword,
  onChangeRole,
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

      <FormSelectField
        label="권한"
        value={role}
        onChange={(e) => onChangeRole(e.target.value)}
        options={[
          { label: "USER", value: "USER" },
          { label: "ADMIN", value: "ADMIN" },
        ]}
      />
    </FormSection>
  );
}
