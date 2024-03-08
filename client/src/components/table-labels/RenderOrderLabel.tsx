import { Order } from "@/services/types";
import { LinkLabel } from "..";
import { CacheResource } from "@/context/cacheKey";
import { useNavigate } from "react-router-dom";


export function RenderOrderLabel({ order }: { order: Order }) {
  const navigate = useNavigate()
  const to = `/${CacheResource.Order}/${order.id}`

  const handleNavigate = () => {
    console.table(order)
    navigate(to)
  }

  return <LinkLabel onClick={handleNavigate}>
    {order.id}
  </LinkLabel>
}

