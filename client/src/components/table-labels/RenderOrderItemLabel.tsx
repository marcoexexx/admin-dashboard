import { OrderItem } from "@/services/types";
import { Typography } from "@mui/material";


export function RenderOrderItemLabel({orderItem}: {orderItem: OrderItem}) {
  return <Typography>
    {orderItem.id}
  </Typography>
}
