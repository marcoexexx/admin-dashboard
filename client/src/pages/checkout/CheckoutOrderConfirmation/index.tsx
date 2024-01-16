import { Box, Container, Typography } from "@mui/material";
import { DeliveryAddressDetailCard } from "./DeliveryAddressDetailCard";
import { CreateOrderInput } from "@/components/content/orders/forms";
import { BillingAddressDetailCard } from "./BillingAddressDetailCard";
import { PickupAddressDetailCard } from "./PickupAddressDetailCard";
import { PaymentMethodDetailCard } from "./PaymentMethodDetailCard";
import { useFormContext } from "react-hook-form";
import { getUserAddressFn } from "@/services/userAddressApi";
import { useQuery } from "@tanstack/react-query";
import { SuspenseLoader } from "@/components";
import { useEffect } from "react";
import { useLocalStorage } from "@/hooks";


export function CheckoutOrderConfirmation() {
  const { getValues, resetField } = useFormContext<CreateOrderInput>()

  const { addressType, deliveryAddressId, billingAddressId } = getValues()

  const { get, set } = useLocalStorage()

  const { 
    data: deliveryAddressResponse, 
    isError: isErrorDeleveryAddressResponse, 
    isLoading: isLoadingDeleveryAddressResponse, 
    error: errorDeleveryAddressResponse,
    isSuccess: isSuccessDeleveryAddressResponse
  } = useQuery({
    enabled: !!deliveryAddressId,
    queryKey: ["user-addresses", { id: deliveryAddressId }],
    queryFn: args => getUserAddressFn(args, { userAddressId: deliveryAddressId }),
  })

  const { 
    data: billingAddressResponse, 
    isError: isErrorBillingAddressResponse, 
    isLoading: isLoadingBillingAddressResponse, 
    error: errorBillingAddressResponse,
    isSuccess: isSuccessBillingAddressResponse
  } = useQuery({
    enabled: !!billingAddressId,
    queryKey: ["user-addresses", { id: billingAddressId }],
    queryFn: args => getUserAddressFn(args, { userAddressId: billingAddressId }),
  })

  const isError = isErrorDeleveryAddressResponse || isErrorBillingAddressResponse
  const isLoading = isLoadingDeleveryAddressResponse || isLoadingBillingAddressResponse
  const error = errorDeleveryAddressResponse || errorBillingAddressResponse
  const isSuccess = isSuccessDeleveryAddressResponse || isSuccessBillingAddressResponse

  const deliveryAddress = deliveryAddressResponse?.userAddress
  const billingAddress = billingAddressResponse?.userAddress

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


  if (isError && error) return <h1>ERROR: {error.message}</h1>

  if (isLoading) return <SuspenseLoader />


  return (
    <Container maxWidth="lg">
      <Box display="flex" flexDirection="column" gap={3}>
        {addressType === "delivery"
          ? <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="h3">Delivery address</Typography>
              <DeliveryAddressDetailCard deliveryAddress={deliveryAddress} />
            </Box>
          : null}

        {addressType === "pickup" 
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
