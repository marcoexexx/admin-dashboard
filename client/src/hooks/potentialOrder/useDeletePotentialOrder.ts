import AppError, { AppErrorKind } from "@/libs/exceptions"
import Result, { Err, Ok } from "@/libs/result"

import { PotentialOrderApiService } from "@/services/potentialOrdersApi"
import { CacheResource } from "@/context/cacheKey"
import { useMutation } from "@tanstack/react-query"
import { useStore } from ".."
import { queryClient } from "@/components"


const apiService = PotentialOrderApiService.new()


export function useDeletePotentialOrder() {
  const { dispatch } = useStore()

  const mutation = useMutation({
    mutationFn: (...args: Parameters<typeof apiService.delete>) => apiService.delete(...args),
    onError(err: any) {
      dispatch({
        type: "OPEN_TOAST", payload: {
          message: `failed: ${err.response.data.message}`,
          severity: err.response.data.status === 403 ? "warning" : "error"
        }
      })
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [CacheResource.PotentialOrder]
      })
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

