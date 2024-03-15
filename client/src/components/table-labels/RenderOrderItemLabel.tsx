import { OrderItem } from "@/services/types";
import { useNavigate } from "react-router-dom";
import { LinkLabel } from "..";

export function RenderOrderItemLabel({ orderItem }: { orderItem: OrderItem; }) {
  const navigate = useNavigate();
  // const to = "/brands/detail/" + brand.id
  const to = "#order-items";

  const handleNavigate = () => {
    console.table(orderItem);
    navigate(to);
  };

  return (
    <LinkLabel onClick={handleNavigate}>
      {orderItem.id}
    </LinkLabel>
  );
}
