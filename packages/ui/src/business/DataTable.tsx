"use client";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";
import { EmptyState } from "./EmptyState";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  width?: number | string;
  render: (row: T) => ReactNode;
};

type Props<T> = {
  rows: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  totalCnt?: number;
};

export function DataTable<T>({
  rows,
  columns,
  loading = false,
  emptyMessage,
  totalCnt,
}: Props<T>) {
  if (loading) {
    return (
      <Paper elevation={1} sx={{ p: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  if (!loading && rows.length === 0) {
    return (
      <Paper elevation={1}>
        <EmptyState message={emptyMessage} />
      </Paper>
    );
  }

  return (
    <>
      {totalCnt && (
        <Box mb={0.5}>
          <Typography variant="body2" color="text.secondary">
            총 {totalCnt}건
          </Typography>
        </Box>
      )}
      <TableContainer component={Paper} elevation={1}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  sx={{
                    fontWeight: 700,
                    width: column.width,
                  }}
                >
                  {column.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex} hover>
                {columns.map((column) => (
                  <TableCell key={column.key}>{column.render(row)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
