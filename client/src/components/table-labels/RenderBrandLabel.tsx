import { useNavigate } from "react-router-dom"
import { LinkLabel } from ".."
import { Brand } from "@/services/types"
import { CacheResource } from "@/context/cacheKey"


export function RenderBrandLabel({ brand }: { brand: Brand }) {
  const navigate = useNavigate()
  const to = `/${CacheResource.Brand}/detail/${brand.id}`

  const handleNavigate = () => {
    navigate(to)
  }

  return <LinkLabel onClick={handleNavigate}>
    {brand.name}
  </LinkLabel>
}
