import AppError, { AppErrorKind } from "@/libs/exceptions"
import Result, { Err, Ok } from "@/libs/result"

import { CacheResource } from "@/context/cacheKey"
import { ProductApiService } from "@/services/productsApi"
import { useMutation } from "@tanstack/react-query"
import { useStore } from ".."
import { playSoundEffect } from "@/libs/playSound"
import { queryClient } from "@/components"
import { useNavigate } from "react-router-dom"


const apiService = ProductApiService.new()


export function useLikeProduct() {
  const { state: { modalForm }, dispatch } = useStore()

  const navigate = useNavigate()
  const from = "/products"

  const mutation = useMutation({
    mutationFn: (...args: Parameters<typeof apiService.like>) => apiService.like(...args),
    onError(err: any) {
      dispatch({
        type: "OPEN_TOAST", payload: {
          message: `failed: ${err.response.data.message}`,
          severity: err.response.data.status === 400 ? "warning" : "error"
        }
      })
      playSoundEffect(err.response.data.status === 400 ? "denied" : "error")
    },
    onSuccess() {
      dispatch({
        type: "OPEN_TOAST", payload: {
          message: "Success update product.",
          severity: "success"
        }
      })
      if (modalForm.field === "*") navigate(from)
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: [CacheResource.Product]
      })
      playSoundEffect("success")
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

