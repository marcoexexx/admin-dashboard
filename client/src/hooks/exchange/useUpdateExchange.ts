import AppError, { AppErrorKind } from "@/libs/exceptions"
import Result, { Err, Ok } from "@/libs/result"

import { CacheResource } from "@/context/cacheKey"
import { ExchangeApiService } from "@/services/exchangesApi"
import { UpdateExchangeInput } from "@/components/content/exchanges/forms"
import { useMutation } from "@tanstack/react-query"
import { useStore } from ".."
import { playSoundEffect } from "@/libs/playSound"
import { queryClient } from "@/components"
import { useNavigate } from "react-router-dom"


const apiService = ExchangeApiService.new()


export function useUpdateExchange() {
  const { state: { modalForm }, dispatch } = useStore()

  const navigate = useNavigate()
  const from = "/exchanges"

  const mutation = useMutation({
    mutationFn: (arg: { id: string, payload: UpdateExchangeInput }) => apiService.update(arg),
    onSuccess: () => {
      dispatch({
        type: "OPEN_TOAST", payload: {
          message: "Success updated a exchange.",
          severity: "success"
        }
      })
      if (modalForm.field === "*") navigate(from)
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: [CacheResource.Exchange]
      })
      playSoundEffect("success")
    },
    onError: (err: any) => {
      dispatch({
        type: "OPEN_TOAST", payload: {
          message: `failed: ${err.response.data.message}`,
          severity: "error"
        }
      })
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

