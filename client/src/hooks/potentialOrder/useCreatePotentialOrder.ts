import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { queryClient } from "@/components";
import { CacheResource } from "@/context/cacheKey";
import { playSoundEffect } from "@/libs/playSound";
import { PotentialOrderApiService } from "@/services/potentialOrdersApi";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "..";

const apiService = PotentialOrderApiService.new();

export function useCreatePotentialOrder() {
  const { dispatch } = useStore();

  const mutation = useMutation({
    mutationFn: (...args: Parameters<typeof apiService.create>) => apiService.create(...args),
    onSuccess: () => {
      dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: "Success created or updated a new Potential order.",
          severity: "success",
        },
      });
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" });
      queryClient.invalidateQueries({
        queryKey: [CacheResource.PotentialOrder],
      });
      playSoundEffect("success");
    },
    onError: (err: any) => {
      dispatch({
        type: "OPEN_TOAST",
        payload: {
          // message: `failed: ${err?.response?.data?.error?.map((err: any) => err?.message)}::${err?.response?.data?.message}`,
          message: `failed: ${err?.response?.data?.message || err?.message || "Unknown error"}`,
          severity: "error",
        },
      });
      playSoundEffect("error");
    },
  });

  const try_data: Result<typeof mutation.data, AppError> = !!mutation.error && mutation.isError
    ? Err(
      AppError.new((mutation.error as any).kind || AppErrorKind.ApiError, mutation.error.message),
    )
    : Ok(mutation.data);

  return { ...mutation, try_data };
}
