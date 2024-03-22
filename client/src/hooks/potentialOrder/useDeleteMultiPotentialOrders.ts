import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { queryClient } from "@/components";
import { CreateOrderInput } from "@/components/content/orders/forms";
import { CacheResource } from "@/context/cacheKey";
import { playSoundEffect } from "@/libs/playSound";
import { PotentialOrderApiService } from "@/services/potentialOrdersApi";
import { useMutation } from "@tanstack/react-query";
import { useLocalStorage, useStore } from "..";

const apiService = PotentialOrderApiService.new();

export function useDeleteMultiPotentialOrders() {
  const { dispatch } = useStore();
  const { set, get } = useLocalStorage();

  const mutation = useMutation({
    mutationFn: (...args: Parameters<typeof apiService.deleteMany>) =>
      apiService.deleteMany(...args),
    onError(err: any) {
      dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: `failed: ${err?.response?.data?.message || err?.message || "Unknown error"}`,
          severity: "error",
        },
      });
      playSoundEffect("error");
    },
    onSuccess(_, ids) {
      dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: "Success delete multi potential orders.",
          severity: "success",
        },
      });
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" });
      queryClient.invalidateQueries({
        queryKey: [CacheResource.PotentialOrder],
      });
      // Clean created PotentialOrder from localStorage
      const pickupForm = get<CreateOrderInput>("PICKUP_FORM");
      const isCartOrderId = pickupForm?.createdPotentialOrderId
        && ids.includes(pickupForm.createdPotentialOrderId);
      if (isCartOrderId) {
        set<CreateOrderInput>("PICKUP_FORM", { ...pickupForm, createdPotentialOrderId: undefined });
      }
      playSoundEffect("success");
    },
  });

  const try_data: Result<typeof mutation.data, AppError> = !!mutation.error && mutation.isError
    ? Err(
      AppError.new((mutation.error as any).kind || AppErrorKind.ApiError, mutation.error.message),
    )
    : Ok(mutation.data);

  return {
    ...mutation,
    try_data,
  };
}
