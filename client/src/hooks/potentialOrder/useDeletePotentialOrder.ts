import AppError, { AppErrorKind } from "@/libs/exceptions"
import Result, { Err, Ok } from "@/libs/result"

import { useMutation } from "@tanstack/react-query"
import { useStore } from ".."
import { queryClient } from "@/components"
import { deletePotentialOrderFn } from "@/services/potentialOrdersApi"


export function useDeletePotentialOrder() {
  const { dispatch } = useStore()

  const mutation = useMutation({
    mutationFn: deletePotentialOrderFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: err.response.data.status === 403 ? "warning" : "error"
      } })
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["potential-orders"]
      })
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

