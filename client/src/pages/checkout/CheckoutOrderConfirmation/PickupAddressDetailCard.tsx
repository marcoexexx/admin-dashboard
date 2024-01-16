import { CreateOrderInput } from "@/components/content/orders/forms";
import { Card, CardContent, Typography } from "@mui/material";
import { Dayjs } from "dayjs";
import { useFormContext } from "react-hook-form";


export function PickupAddressDetailCard() {
  const { getValues } = useFormContext<CreateOrderInput>()
  const { pickupAddress } = getValues()

  if (!pickupAddress) return <h1>Error: pickupAddress not found</h1>


  return (
    <Card>
      <CardContent>
        <Typography variant="h4">{pickupAddress.username}</Typography>
        <Typography>Phone: {pickupAddress.phone}</Typography>
       {pickupAddress.email ? <Typography>Email: {pickupAddress.email}</Typography> : null}
        <Typography>date: {(pickupAddress.date as Dayjs).toISOString()}</Typography>
      </CardContent>
    </Card>
  )
}
