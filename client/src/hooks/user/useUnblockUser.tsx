import AppError, { AppErrorKind } from "@/libs/exceptions"
import Result, { Err, Ok } from "@/libs/result"

import { CacheResource } from "@/context/cacheKey"
import { UserApiService } from "@/services/usersApi"
import { useMutation } from "@tanstack/react-query"
import { useStore } from ".."
import { queryClient } from "@/components"


const apiService = UserApiService.new()


export function useUnblockUser() {
  const { dispatch } = useStore()

  const mutation = useMutation({
    mutationFn: (...args: Parameters<typeof apiService.unblock>) => apiService.unblock(...args),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [CacheResource.User]
      })
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success unblocked.",
        severity: "success"
      } })
    },
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
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


