import { LinkLabel } from ".."
import { Product } from "@/services/types"
import { Alert, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useStore } from "@/hooks"
import { useGetProduct } from "@/hooks/product"

import AppError from "@/libs/exceptions"
import { useEffect } from "react"


export function RenderProductLabelFetch({product, onError, onSuccess}: {product: Product, onError: (err: AppError) => void, onSuccess: () => void}) {
  const navigate = useNavigate()

  const { dispatch } = useStore()

  const productQuery = useGetProduct({
    id: product.id
  })

  const try_data = productQuery.try_data

  useEffect(() => {
    if (productQuery.isError && try_data.err()) onError(try_data.err() as AppError)
  }, [productQuery.isError])

  useEffect(() => {
    if (productQuery.isSuccess) onSuccess()
  }, [productQuery.isSuccess])

  const to = "/products/detail/" + product.id

  const handleNavigate = () => {
    dispatch({ type: "SET_PRODUCT_FILTER", payload: { include: { specification: true } } })
    navigate(to)
  }


  if (productQuery.isLoading) return "Loading..."

  if (try_data.is_err()) return <Alert severity="error">
    <Typography>{try_data.unwrap_err().message}</Typography>
  </Alert>
  

  return <LinkLabel onClick={handleNavigate}>
    {product.title}
  </LinkLabel>
}
