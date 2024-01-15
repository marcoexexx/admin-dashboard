import { CreateOrderInput } from "@/components/content/orders/forms";
import { Card, CardContent, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";


export function PickupAddressDetailCard() {
  const { getValues } = useFormContext<CreateOrderInput>()
  const { pickupAddress } = getValues()


  return (
    <Card>
      <CardContent>
        <Typography variant="h4">{pickupAddress.username}</Typography>
        <Typography>Phone: {pickupAddress.phone}</Typography>
       {pickupAddress.email ? <Typography>Email: {pickupAddress.email}</Typography> : null}
        <Typography>date: {pickupAddress.date}</Typography>
      </CardContent>
    </Card>
  )
}
