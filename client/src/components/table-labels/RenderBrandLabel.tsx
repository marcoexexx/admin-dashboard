import { useNavigate } from "react-router-dom"
import { LinkLabel } from ".."

export function RenderBrandLabel({brand}: {brand: IBrand}) {
  const navigate = useNavigate()
  const to = "/brands/detail/" + brand.id

  const handleNavigate = () => {
    navigate(to)
  }

  return <LinkLabel onClick={handleNavigate}>
    {brand.name}
  </LinkLabel>
}
