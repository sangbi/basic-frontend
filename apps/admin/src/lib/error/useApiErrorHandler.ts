import { handleApiError } from "@repo/api";
import { tokenStorage } from "@repo/auth";
import { useFeedback } from "@repo/ui";
import { useRouter } from "next/navigation";

// 애는 문제가 있으니 나중에 수정하자
export function useApiErrorHandler() {
  const { showError } = useFeedback();
  const router = useRouter();

  return (error: Error, fallbackMessage?: string) => {
    return handleApiError(error, {
      showError,
      fallbackMessage,
      onUnauthorized: () => {
        tokenStorage.clear();
        router.replace("/login");
      },
    });
  };
}
