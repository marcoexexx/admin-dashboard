import { Order } from "@/services/types";
import { LinkLabel } from "..";
import { useNavigate } from "react-router-dom";


export function RenderOrderLabel({order}: {order: Order}) {
  const navigate = useNavigate()
  // const to = "/brands/detail/" + brand.id
  const to = "#/orders/" + order.id

  const handleNavigate = () => {
    console.table(order)
    navigate(to)
  }

  return <LinkLabel onClick={handleNavigate}>
    {order.id}
  </LinkLabel>
}

