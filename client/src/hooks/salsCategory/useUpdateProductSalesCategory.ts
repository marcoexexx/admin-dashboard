import AppError, { AppErrorKind } from "@/libs/exceptions"
import Result, { Err, Ok } from "@/libs/result"

import { CacheResource } from "@/context/cacheKey"
import { ProductApiService } from "@/services/productsApi"
import { useMutation } from "@tanstack/react-query"
import { useStore } from ".."
import { playSoundEffect } from "@/libs/playSound"
import { queryClient } from "@/components"


const apiService = ProductApiService.new()


export function useUpdateProductSalesCategory() {
  const { dispatch } = useStore()

  const mutation = useMutation({
    mutationFn: (...args: Parameters<typeof apiService.updateSaleCategory>) => apiService.updateSaleCategory(...args),
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success updated a sale category.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: [CacheResource.ProductSalesCategory]
      })
      playSoundEffect("success")
    },
    onError: (err: any) => {
      dispatch({ type: "OPEN_TOAST", payload: {
          message: `failed: ${err?.response?.data?.message || err?.message || "Unknown error"}`,
        severity: "error"
      } })
      playSoundEffect("error")
    },
  })

  const try_data: Result<typeof mutation.data, AppError> = !!mutation.error && mutation.isError
    ? Err(AppError.new((mutation.error as any).kind || AppErrorKind.ApiError, mutation.error.message)) 
    : Ok(mutation.data)

  return {
    ...mutation,
    try_data
  }
}
