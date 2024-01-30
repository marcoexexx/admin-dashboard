import Result, { Err, Ok } from "@/libs/result"
import AppError, { AppErrorKind } from "@/libs/exceptions"

import { createProductFn } from "@/services/productsApi"
import { useMutation } from "@tanstack/react-query"
import { useStore } from ".."
import { playSoundEffect } from "@/libs/playSound"
import { queryClient } from "@/components"
import { useNavigate } from "react-router-dom"


export function useCreateProduct() {
  const { state: {modalForm}, dispatch } = useStore()

  const navigate = useNavigate()
  const from = "/products"

  const mutation = useMutation({
    mutationFn: createProductFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success created a new product.",
        severity: "success"
      } })
      if (modalForm.field === "*") navigate(from)
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["products"]
      })
      playSoundEffect("success")
    },
    onError: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "failed created a new product.",
        severity: "error"
      } })
      playSoundEffect("error")
    }
  })

  const try_data: Result<typeof mutation.data, AppError> = !!mutation.error && mutation.isError
    ? Err(AppError.new(AppErrorKind.ApiError, mutation.error.message)) 
    : Ok(mutation.data)

  return { ...mutation, try_data }
}

