"use client";

import { MenuItem, TextField, TextFieldProps } from "@mui/material";

type Option = {
  label: string;
  value: string;
};

type Props = Omit<TextFieldProps, "select"> & {
  options: Option[];
  errorMessage?: string;
};

export function FormSelectField({
  options,
  errorMessage,
  helperText,
  ...props
}: Props) {
  return (
    <TextField
      select
      fullWidth
      size="medium"
      error={!!errorMessage || props.error}
      helperText={errorMessage ?? helperText}
      {...props}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
