import AppError, { AppErrorKind } from "@/libs/exceptions"
import Result, { Err, Ok } from "@/libs/result"

import { useMutation } from "@tanstack/react-query"
import { useStore } from ".."
import { queryClient } from "@/components"
import { logoutUserFn } from "@/services/authApi"


export function useUserLogout() {
  const { dispatch } = useStore()

  const mutation = useMutation({
    mutationFn: logoutUserFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["authUser"]
      })
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success logout.",
        severity: "success"
      } })
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
