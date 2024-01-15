import { SuspenseLoader } from "@/components";
import { CreateOrderInput } from "@/components/content/orders/forms";
import { Card, CardContent, Typography } from "@mui/material";
import { getUserAddressFn } from "@/services/userAddressApi";
import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";


export function BillingAddressDetailCard() {
  const { getValues } = useFormContext<CreateOrderInput>()
  const { billingAddressId } = getValues()

  const { data: billingAddress, isError, isLoading, error } = useQuery({
    enabled: !!billingAddressId,
    queryKey: ["user-addresses", { id: billingAddressId }],
    queryFn: args => getUserAddressFn(args, { userAddressId: billingAddressId }),

    select: data => data?.userAddress
  })

  if (isError && error) return <h1>ERROR: {error.message}</h1>

  if (!billingAddress || isLoading) return <SuspenseLoader />

  return (
    <Card>
      <CardContent>
        <Typography variant="h4">{billingAddress.username}</Typography>
        <Typography>Phone: {billingAddress.phone}</Typography>
       {billingAddress.email ? <Typography>Email: {billingAddress.email}</Typography> : null}
        <Typography>full address: {billingAddress.fullAddress}</Typography>
      </CardContent>
    </Card>
  )
}
