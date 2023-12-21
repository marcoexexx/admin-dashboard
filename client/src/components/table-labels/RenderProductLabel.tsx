import { useNavigate } from "react-router-dom"
import { LinkLabel } from ".."
import { useStore } from "@/hooks"

export function RenderProductLabel({product}: {product: IProduct}) {
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
