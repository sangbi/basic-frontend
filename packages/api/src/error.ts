import axios, { AxiosError } from "axios";

export type ApiErrorResponse = {
  success: boolean;
  code: string;
  message: string;
  data: unknown;
};

export function isAxiosApiError(
  error: unknown,
): error is AxiosError<ApiErrorResponse> {
  return axios.isAxiosError(error);
}

export function getApiError(error: unknown): ApiErrorResponse | null {
  if (!isAxiosApiError(error)) {
    return null;
  }

  return error.response?.data ?? null;
}

export function getErrorMessage(error: unknown): string {
  const apiError = getApiError(error);

  if (apiError?.message) {
    return apiError.message;
  }

  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "네트워크 오류가 발생했습니다.";
    }

    switch (error.response.status) {
      case 401:
        return "인증이 필요합니다.";
      case 403:
        return "접근 권한이 없습니다.";
      case 404:
        return "요청한 리소스를 찾을 수 없습니다.";
      case 500:
        return "서버 내부 오류가 발생했습니다.";
      default:
        return "요청 처리 중 오류가 발생했습니다.";
    }
  }

  return "알 수 없는 오류가 발생했습니다.";
}

export function getErrorCode(error: unknown): string | null {
  const apiError = getApiError(error);
  return apiError?.code ?? null;
}

type ErrorHandlerOptions = {
  showError?: (message: string) => void;
  onUnauthorized?: () => void;
  onForbidden?: () => void;
  fallbackMessage?: string;
};

export function handleApiError(
  error: unknown,
  options: ErrorHandlerOptions = {},
) {
  const { showError, onUnauthorized, onForbidden, fallbackMessage } = options;

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    if (status === 401 && onUnauthorized) {
      onUnauthorized();
    }

    if (status === 403 && onForbidden) {
      onForbidden();
    }
  }

  const message = fallbackMessage ?? getErrorMessage(error);

  if (showError) {
    showError(message);
  }

  return {
    code: getErrorCode(error),
    message,
  };
}
