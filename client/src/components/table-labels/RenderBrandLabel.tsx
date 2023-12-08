import { useNavigate } from "react-router-dom"
import { LinkLabel } from ".."

export function RenderBrandLabel({brand}: {brand: IBrand}) {
  const navigate = useNavigate()
  const to = "/brands/detail/" + brand.id

  return <LinkLabel onClick={() => navigate(to)}>
    {brand.name}
  </LinkLabel>
}
