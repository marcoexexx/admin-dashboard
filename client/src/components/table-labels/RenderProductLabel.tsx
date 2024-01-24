import { useNavigate } from "react-router-dom"
import { useStore } from "@/hooks"
import { useQuery } from "@tanstack/react-query"
import { getProductFn } from "@/services/productsApi"
import { LinkLabel } from ".."
import { Alert } from "@mui/material"
import { Product } from "@/services/types"

export function RenderProductLabel({product, fetch=true}: {product: Product, fetch?: boolean}) {
  const navigate = useNavigate()

  const { dispatch } = useStore()

  const {data, isLoading, isError, error} = useQuery({
    enabled: !!product.id && fetch,
    queryKey: ["products", { id: product.id }],
    queryFn: args => getProductFn(args, { productId: product.id }),
    select: data => data?.product
  })

  const to = "/products/detail/" + product.id

  const handleNavigate = () => {
    dispatch({ type: "SET_PRODUCT_FILTER", payload: { include: { specification: true } } })
    navigate(to)
  }


  if (isError && error) {
    const message = (error as any)?.response?.data?.message || error.message
    return <Alert severity="error">{message}</Alert>
  }
  if (isLoading || !data && fetch) return "Loading..."
  

  return <LinkLabel onClick={handleNavigate}>
    {product.title}
  </LinkLabel>
}
