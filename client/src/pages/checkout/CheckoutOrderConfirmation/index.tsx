import { Box, Container, Typography } from "@mui/material";
import { DeliveryAddressDetailCard } from "./DeliveryAddressDetailCard";
import { useFormContext } from "react-hook-form";
import { CreateOrderInput } from "@/components/content/orders/forms";
import { BillingAddressDetailCard } from "./BillingAddressDetailCard";
import { PickupAddressDetailCard } from "./PickupAddressDetailCard";
import { PaymentMethodDetailCard } from "./PaymentMethodDetailCard";


export function CheckoutOrderConfirmation() {
  const { getValues } = useFormContext<CreateOrderInput>()

  const { addressType } = getValues()


  return (
    <Container maxWidth="lg">
      <Box display="flex" flexDirection="column" gap={3}>
        {addressType === "delivery"
          ? <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="h3">Delivery address</Typography>
              <DeliveryAddressDetailCard />
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
            <BillingAddressDetailCard />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="h3">Payment method</Typography>
            <PaymentMethodDetailCard />
          </Box>
      </Box>
    </Container>
  )
}
