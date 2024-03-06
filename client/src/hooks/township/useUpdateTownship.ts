import AppError, { AppErrorKind } from "@/libs/exceptions"
import Result, { Err, Ok } from "@/libs/result"

import { useMutation } from "@tanstack/react-query"
import { useStore } from ".."
import { playSoundEffect } from "@/libs/playSound"
import { queryClient } from "@/components"
import { useNavigate } from "react-router-dom"
import { CacheResource } from "@/context/cacheKey"
import { TownshipApiService } from "@/services/townshipsApi"


const apiService = TownshipApiService.new()


export function useUpdateTownship() {
  const { state: { modalForm }, dispatch } = useStore()

  const navigate = useNavigate()
  const from = "/townships"

  const mutation = useMutation({
    mutationFn: (...args: Parameters<typeof apiService.update>) => apiService.update(...args),
    onSuccess: () => {
      dispatch({
        type: "OPEN_TOAST", payload: {
          message: "Success updated a township.",
          severity: "success"
        }
      })
      if (modalForm.field === "*") navigate(from)
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: [CacheResource.Township]
      })
      playSoundEffect("success")
    },
    onError: (err: any) => {
      dispatch({
        type: "OPEN_TOAST", payload: {
          message: `failed: ${err?.response?.data?.message || err?.message || "Unknown error"}`,
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

