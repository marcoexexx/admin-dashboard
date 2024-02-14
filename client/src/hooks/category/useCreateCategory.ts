import Result, { Err, Ok } from "@/libs/result"
import AppError, { AppErrorKind } from "@/libs/exceptions"

import { Resource } from "@/context/cacheKey"
import { useMutation } from "@tanstack/react-query"
import { useStore } from ".."
import { playSoundEffect } from "@/libs/playSound"
import { queryClient } from "@/components"
import { useNavigate } from "react-router-dom"
import { createCategoryFn } from "@/services/categoryApi"


export function useCreateCategory() {
  const { state: {modalForm}, dispatch } = useStore()

  const navigate = useNavigate()
  const from = "/categories"

  const mutation = useMutation({
    mutationFn: createCategoryFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success created a new category.",
        severity: "success"
      } })
      if (modalForm.field === "*") navigate(from)
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: [Resource.Category]
      })
      playSoundEffect("success")
    },
    onError: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "failed created a new category.",
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


