"use client";

import TextField, { TextFieldProps } from "@mui/material/TextField";

type Props = TextFieldProps & {
  errorMessage?: string;
};

export function FormTextField({ errorMessage, helperText, ...props }: Props) {
  return (
    <TextField
      fullWidth
      size="medium"
      error={!!errorMessage || props.error}
      helperText={errorMessage ?? helperText}
      {...props}
    />
  );
}
