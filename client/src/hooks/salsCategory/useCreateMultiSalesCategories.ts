import Result, { Err, Ok } from "@/libs/result"
import AppError, { AppErrorKind } from "@/libs/exceptions"

import { CacheResource } from "@/context/cacheKey"
import { SalesCategoryApiService } from "@/services/salesCategoryApi"
import { useMutation } from "@tanstack/react-query"
import { useStore } from ".."
import { playSoundEffect } from "@/libs/playSound"
import { queryClient } from "@/components"


const apiService = SalesCategoryApiService.new()


export function useCreateMultiSalesCategories() {
  const { dispatch } = useStore()

  const mutation = useMutation({
    mutationFn: (...args: Parameters<typeof apiService.uploadExcel>) => apiService.uploadExcel(...args),
    onError(err: any) {
      dispatch({
        type: "OPEN_TOAST", payload: {
          message: `failed: ${err?.response?.data?.message || err?.message || "Unknown error"}`,
          severity: "error"
        }
      })
      dispatch({ type: "CLOSE_BACKDROP" })
      playSoundEffect("error")
    },
    onSuccess() {
      dispatch({
        type: "OPEN_TOAST", payload: {
          message: "Success created new sales categories.",
          severity: "success"
        }
      })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: [CacheResource.SalesCategory]
      })
      dispatch({ type: "CLOSE_BACKDROP" })
      playSoundEffect("success")
    }
  })

  const try_data: Result<typeof mutation.data, AppError> = !!mutation.error && mutation.isError
    ? Err(AppError.new((mutation.error as any).kind || AppErrorKind.ApiError, mutation.error.message))
    : Ok(mutation.data)

  return { ...mutation, try_data }
}

