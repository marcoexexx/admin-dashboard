import { useNavigate } from "react-router-dom"
import { LinkLabel } from ".."

export function RenderProductLabel({product}: {product: IProduct}) {
  const navigate = useNavigate()
  const to = "/products/detail/" + product.id

  return <LinkLabel onClick={() => navigate(to)}>
    {product.title}
  </LinkLabel>
}
