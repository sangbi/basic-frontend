const ALLOWED_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "hwp",
  "hwpx",
  "zip",
];

const MAX_FILE_SIZE = 20 * 1024 * 1024;

export function validateUploadFile(file: File) {
  const extension = file.name.includes(".")
    ? (file.name.split(".").pop()?.toLowerCase() ?? "")
    : "";

  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      message: `허용되지 않은 파일 형식입니다. (${file.name})`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      message: `파일 크기는 20MB를 초과할 수 없습니다. (${file.name})`,
    };
  }

  return {
    valid: true,
    message: "",
  };
}
