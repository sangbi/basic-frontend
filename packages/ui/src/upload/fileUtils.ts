export function isImageFile(contentType: string | null) {
  return !!contentType && contentType.startsWith("image/");
}

export function isPdfFile(contentType: string | null, fileName?: string) {
  return (
    contentType === "application/pdf" ||
    fileName?.toLowerCase().endsWith(".pdf") === true
  );
}

export function isExcelFile(contentType: string | null, fileName?: string) {
  return (
    contentType?.includes("spreadsheet") === true ||
    fileName?.toLowerCase().endsWith(".xls") === true ||
    fileName?.toLowerCase().endsWith(".xlsx") === true
  );
}

export function isWordFile(contentType: string | null, fileName?: string) {
  return (
    contentType?.includes("word") === true ||
    fileName?.toLowerCase().endsWith(".doc") === true ||
    fileName?.toLowerCase().endsWith(".docx") === true
  );
}

export function isZipFile(contentType: string | null, fileName?: string) {
  return (
    contentType?.includes("zip") === true ||
    fileName?.toLowerCase().endsWith(".zip") === true
  );
}

export function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`;
  return `${(size / 1024 / 1024 / 1024).toFixed(1)} GB`;
}
