import { Box, Container, Typography } from "@mui/material";
import { DeliveryAddressDetailCard } from "./DeliveryAddressDetailCard";
import { CreateOrderInput } from "@/components/content/orders/forms";
import { BillingAddressDetailCard } from "./BillingAddressDetailCard";
import { PickupAddressDetailCard } from "./PickupAddressDetailCard";
import { PaymentMethodDetailCard } from "./PaymentMethodDetailCard";
import { SuspenseLoader } from "@/components";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { useCombineQuerys, useLocalStorage } from "@/hooks";
import { useGetUserAddress } from "@/hooks/userAddress";


export function CheckoutOrderConfirmation() {
  const { getValues, resetField } = useFormContext<CreateOrderInput>()

  const { addressType, deliveryAddressId, billingAddressId } = getValues()

  const { get, set } = useLocalStorage()

  // Queries
  const deliveryAddressQuery = useGetUserAddress({
    id: deliveryAddressId
  })
  const billingAddressQuery = useGetUserAddress({
    id: billingAddressId
  })

  const { isLoading, isSuccess } = useCombineQuerys(
    deliveryAddressQuery,
    billingAddressQuery
  )

  // Extraction
  const deliveryAddress = deliveryAddressQuery.try_data.ok_or_throw()?.userAddress
  const billingAddress = billingAddressQuery.try_data.ok_or_throw()?.userAddress


  // If deliveryAddress does not exist in database, must remove from localStorage
  useEffect(() => {
    if (!deliveryAddress && isSuccess) {
      const values = get<CreateOrderInput>("PICKUP_FORM")
      if (values) set("PICKUP_FORM", { ...values, deliveryAddressId: undefined })
      resetField("deliveryAddressId")
    }
  }, [deliveryAddress])

  // If billingAddress does not exist in database, must remove from localStorage
  useEffect(() => {
    if (!billingAddress && isSuccess) {
      const values = get<CreateOrderInput>("PICKUP_FORM")
      if (values) set("PICKUP_FORM", { ...values, billingAddressId: undefined })
      resetField("billingAddressId")
    }
  }, [deliveryAddress])


  if (isLoading) return <SuspenseLoader />


  return (
    <Container maxWidth="lg">
      <Box display="flex" flexDirection="column" gap={3}>
        {addressType === "Delivery"
          ? <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="h3">Delivery address</Typography>
              <DeliveryAddressDetailCard deliveryAddress={deliveryAddress} />
            </Box>
          : null}

        {addressType === "Pickup" 
          ? <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="h3">Pickup address</Typography>
              <PickupAddressDetailCard />
            </Box>
          : null}

          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="h3">Billing address</Typography>
            <BillingAddressDetailCard billingAddress={billingAddress} />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="h3">Payment method</Typography>
            <PaymentMethodDetailCard />
          </Box>
      </Box>
    </Container>
  )
}
