import { SuspenseLoader } from "@/components";
import { CreateOrderInput } from "@/components/content/orders/forms";
import { getUserAddressFn } from "@/services/userAddressApi";
import { Card, CardContent, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";


export function DeliveryAddressDetailCard() {
  const { getValues } = useFormContext<CreateOrderInput>()
  const { deliveryAddressId } = getValues()

  const { data: deliveryAddress, isError, isLoading, error } = useQuery({
    enabled: !!deliveryAddressId,
    queryKey: ["user-addresses", { id: deliveryAddressId }],
    queryFn: args => getUserAddressFn(args, { userAddressId: deliveryAddressId }),

    select: data => data?.userAddress
  })

  if (isError && error) return <h1>ERROR: {error.message}</h1>

  if (!deliveryAddress || isLoading) return <SuspenseLoader />

  return (
    <Card>
      <CardContent>
        <Typography variant="h4">{deliveryAddress.username}</Typography>
        <Typography>Phone: {deliveryAddress.phone}</Typography>
       {deliveryAddress.email ? <Typography>Email: {deliveryAddress.email}</Typography> : null}
        <Typography>full address: {deliveryAddress.fullAddress}</Typography>
      </CardContent>
    </Card>
  )
}
