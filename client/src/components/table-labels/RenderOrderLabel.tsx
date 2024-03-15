import { CacheResource } from "@/context/cacheKey";
import { Order } from "@/services/types";
import { useNavigate } from "react-router-dom";
import { LinkLabel } from "..";

export function RenderOrderLabel({ order }: { order: Order; }) {
  const navigate = useNavigate();
  const to = `/${CacheResource.Order}/${order.id}`;

  const handleNavigate = () => {
    console.table(order);
    navigate(to);
  };

  return (
    <LinkLabel onClick={handleNavigate}>
      {order.id}
    </LinkLabel>
  );
}
