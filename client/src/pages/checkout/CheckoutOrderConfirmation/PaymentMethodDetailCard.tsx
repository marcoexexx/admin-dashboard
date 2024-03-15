import { CreateOrderInput } from "@/components/content/orders/forms";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { paymentMethodProviderImages } from "../PaymentMethod";

export function PaymentMethodDetailCard() {
  const { getValues } = useFormContext<CreateOrderInput>();
  const { paymentMethodProvider } = getValues();

  return (
    <Card>
      <CardContent>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap={2}
        >
          <Typography sx={{ fontSize: 20 }}>{paymentMethodProvider}</Typography>
          <Box
            component="img"
            sx={{
              height: 40,
            }}
            alt={`payment-${paymentMethodProvider}`}
            src={`/static/${paymentMethodProviderImages[paymentMethodProvider]}`}
          />
        </Box>
        <Typography mt={1} variant="h4">
          Click the "Place Order" button below and the instructions of purchasing the product will be given in the next
          page.
        </Typography>
      </CardContent>
    </Card>
  );
}
