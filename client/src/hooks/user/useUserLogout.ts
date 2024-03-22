import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { queryClient } from "@/components";
import { CacheResource } from "@/context/cacheKey";
import { logoutUserFn } from "@/services/authApi";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "..";

export function useUserLogout() {
  const { dispatch } = useStore();

  const mutation = useMutation({
    mutationFn: logoutUserFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CacheResource.AuthUser],
      });
      dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: "Success logout.",
          severity: "success",
        },
      });
    },
    onError(err: any) {
      dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: `failed: ${
            err?.response?.data?.message || err?.message || "Unknown error"
          }`,
          severity: "error",
        },
      });
    },
  });

  const try_data: Result<typeof mutation.data, AppError> =
    !!mutation.error && mutation.isError
      ? Err(
        AppError.new(
          (mutation.error as any).kind || AppErrorKind.ApiError,
          mutation.error.message,
        ),
      )
      : Ok(mutation.data);

  return {
    ...mutation,
    try_data,
  };
}
