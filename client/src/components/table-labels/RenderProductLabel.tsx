import { useNavigate } from "react-router-dom"
import { LinkLabel } from ".."
import { useStore } from "@/hooks"
import { Product } from "@/services/types"

export function RenderProductLabel({product}: {product: Product}) {
  const navigate = useNavigate()

  const { dispatch } = useStore()

  const to = "/products/detail/" + product.id

  const handleNavigate = () => {
    dispatch({ type: "SET_PRODUCT_FILTER", payload: { include: { specification: true } } })
    navigate(to)
  }

  return <LinkLabel onClick={handleNavigate}>
    {product.title}
  </LinkLabel>
}
