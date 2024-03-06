import AppError, { AppErrorKind } from "@/libs/exceptions"
import Result, { Err, Ok } from "@/libs/result"

import { PotentialOrderApiService } from "@/services/potentialOrdersApi"
import { CacheResource } from "@/context/cacheKey"
import { useMutation } from "@tanstack/react-query"
import { useLocalStorage, useStore } from ".."
import { queryClient } from "@/components"
import { CreateOrderInput } from "@/components/content/orders/forms"


const apiService = PotentialOrderApiService.new()


export function useDeletePotentialOrder() {
  const { dispatch } = useStore()
  const { set, get } = useLocalStorage()

  const mutation = useMutation({
    mutationFn: (...args: Parameters<typeof apiService.delete>) => apiService.delete(...args),
    onError(err: any) {
      dispatch({
        type: "OPEN_TOAST", payload: {
          message: `failed: ${err?.response?.data?.message || err?.message || "Unknown error"}`,
          severity: err.response.data.status === 403 ? "warning" : "error"
        }
      })
    },
    onSuccess(data) {
      queryClient.invalidateQueries({
        queryKey: [CacheResource.PotentialOrder]
      })
      // Clean created PotentialOrder from localStorage
      const pickupForm = get<CreateOrderInput>("PICKUP_FORM")
      const isCartOrderId = data.potentialOrder.id === pickupForm?.createdPotentialOrderId
      if (isCartOrderId) set<CreateOrderInput>("PICKUP_FORM", { ...pickupForm, createdPotentialOrderId: undefined })
    }
  })

  const try_data: Result<typeof mutation.data, AppError> = !!mutation.error && mutation.isError
    ? Err(AppError.new((mutation.error as any).kind || AppErrorKind.ApiError, mutation.error.message))
    : Ok(mutation.data)

  return {
    ...mutation,
    try_data
  }
}

