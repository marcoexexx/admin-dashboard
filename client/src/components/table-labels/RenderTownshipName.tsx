import { useNavigate } from "react-router-dom"
import { LinkLabel } from ".."
import { TownshipFees } from "@/services/types"


export function RenderTownshipName({township}: {township: TownshipFees}) {
  const navigate = useNavigate()
  const to = "/township/detail/" + township.id

  const handleNavigate = () => {
    navigate(to)
  }

  return <LinkLabel onClick={handleNavigate}>
    {township.name}
  </LinkLabel>
}

