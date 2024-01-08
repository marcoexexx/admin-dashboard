import { useNavigate } from "react-router-dom"
import { LinkLabel } from ".."
import { Region } from "@/services/types"


export function RenderRegionLabel({region}: {region: Region}) {
  const navigate = useNavigate()
  const to = "/regions/detail/" + region.id

  const handleNavigate = () => {
    navigate(to)
  }

  return <LinkLabel onClick={handleNavigate}>
    {region.name}
  </LinkLabel>
}

