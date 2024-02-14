import Result, { Err, Ok } from "@/libs/result"
import AppError, { AppErrorKind } from "@/libs/exceptions"

import { Resource } from "@/context/cacheKey"
import { useMutation } from "@tanstack/react-query"
import { playSoundEffect } from "@/libs/playSound"
import { queryClient } from "@/components"
import { createOrderFn } from "@/services/orderApi"
import { useStore } from ".."


export function useCreateOrder() {
  const { dispatch } = useStore()

  const mutation = useMutation({
    mutationFn: createOrderFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success created a new Order.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: [Resource.Order]
      })
      queryClient.invalidateQueries({
        queryKey: [Resource.Product]
      })
      playSoundEffect("success")
    },
    onError: (err: any) => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
      playSoundEffect("error")
    },
  })

  const try_data: Result<typeof mutation.data, AppError> = !!mutation.error && mutation.isError
    ? Err(AppError.new((mutation.error as any).kind || AppErrorKind.ApiError, mutation.error.message)) 
    : Ok(mutation.data)

  return { ...mutation, try_data }
}


