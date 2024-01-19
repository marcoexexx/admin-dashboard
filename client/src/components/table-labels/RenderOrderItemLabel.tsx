import { OrderItem } from "@/services/types";
import { LinkLabel } from "..";
import { useNavigate } from "react-router-dom";


export function RenderOrderItemLabel({orderItem}: {orderItem: OrderItem}) {
  const navigate = useNavigate()
  // const to = "/brands/detail/" + brand.id
  const to = "#order-items"

  const handleNavigate = () => {
    console.table(orderItem)
    navigate(to)
  }

  return <LinkLabel onClick={handleNavigate}>
    {orderItem.id}
  </LinkLabel>
}
