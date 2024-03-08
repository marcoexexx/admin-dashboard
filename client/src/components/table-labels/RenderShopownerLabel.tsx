import { useNavigate } from "react-router-dom"
import { LinkLabel } from ".."
import { ShopownerProvider } from "@/services/types"
import { CacheResource } from "@/context/cacheKey"


export function RenderShopownerLabel({ shopowner }: { shopowner: ShopownerProvider }) {
  const navigate = useNavigate()
  const to = `/${CacheResource.Shopowner}/detail/${shopowner.id}`

  const handleNavigate = () => {
    navigate(to)
  }

  return <LinkLabel onClick={handleNavigate}>
    {shopowner.name}
  </LinkLabel>
}

