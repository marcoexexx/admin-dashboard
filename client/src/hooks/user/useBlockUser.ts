import AppError, { AppErrorKind } from "@/libs/exceptions"
import Result, { Err, Ok } from "@/libs/result"

import { Resource } from "@/context/cacheKey"
import { useMutation } from "@tanstack/react-query"
import { useStore } from ".."
import { queryClient } from "@/components"
import { createBlockUserFn } from "@/services/usersApi"


export function useBlockUser() {
  const { dispatch } = useStore()

  const mutation = useMutation({
    mutationFn: createBlockUserFn,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [Resource.User]
      })
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success blocked.",
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

