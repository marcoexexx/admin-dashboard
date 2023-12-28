import { useNavigate } from "react-router-dom"
import { LinkLabel } from ".."
import { Brand } from "@/services/types"

export function RenderBrandLabel({brand}: {brand: Brand}) {
  const navigate = useNavigate()
  const to = "/brands/detail/" + brand.id

  const handleNavigate = () => {
    navigate(to)
  }

  return <LinkLabel onClick={handleNavigate}>
    {brand.name}
  </LinkLabel>
}
