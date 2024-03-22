import { useStore } from "@/hooks";
import AppError, { AppErrorKind } from "@/libs/exceptions";

export function useSudo<
  Fn extends (...args: any[]) => any,
>(fn: Fn) {
  return (...args: Parameters<Fn>): ReturnType<Fn> => {
    const { state: { user } } = useStore();

    if (!user?.isSuperuser) {
      throw AppError.new(
        AppErrorKind.AccessDeniedError,
        `Could not access this recouse, superuser only`,
      );
    }

    return fn(...args);
  };
}
