import AppError, { AppErrorKind } from "@/libs/exceptions"
import Result, { Err, Ok } from "@/libs/result"

import { updateProductFn } from "@/services/productsApi"
import { useMutation } from "@tanstack/react-query"
import { useStore } from ".."
import { playSoundEffect } from "@/libs/playSound"
import { queryClient } from "@/components"


export function useUpdateProduct() {
  const { dispatch } = useStore()

  const mutation = useMutation({
    mutationFn: updateProductFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: err.response.data.status === 403 ? "warning" : "error"
      } })
      playSoundEffect(err.response.data.status === 403 ? "denied" : "error")
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success update product.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["products"]
      })
      playSoundEffect("success")
    }
  })

  const try_data: Result<typeof mutation.data, AppError> = !!mutation.error && mutation.isError
    ? Err(AppError.new(AppErrorKind.ApiError, mutation.error.message)) 
    : Ok(mutation.data)

  return {
    ...mutation,
    try_data
  }
}
