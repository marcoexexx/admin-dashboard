import AppError, { AppErrorKind } from "@/libs/exceptions"
import Result, { Err, Ok } from "@/libs/result"

import { CacheResource } from "@/context/cacheKey"
import { RegionApiService } from "@/services/regionsApi"
import { useMutation } from "@tanstack/react-query"
import { useStore } from ".."
import { playSoundEffect } from "@/libs/playSound"
import { queryClient } from "@/components"


const apiService = RegionApiService.new()


export function useDeleteRegion() {
  const { dispatch } = useStore()

  const mutation = useMutation({
    mutationFn: (...args: Parameters<typeof apiService.delete>) => apiService.delete(...args),
    onError(err: any) {
      dispatch({
        type: "OPEN_TOAST", payload: {
          message: `failed: ${err.response.data.message}`,
          severity: "error"
        }
      })
      playSoundEffect("error")
    },
    onSuccess() {
      dispatch({
        type: "OPEN_TOAST", payload: {
          message: "Success delete a region.",
          severity: "success"
        }
      })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: [CacheResource.Region]
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

