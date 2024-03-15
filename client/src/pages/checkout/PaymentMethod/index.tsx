import { CreateOrderInput } from "@/components/content/orders/forms";
import { AddressInputField } from "@/components/input-fields";
import { PaymentMethodProvider } from "@/services/types";
import { Box, Card, CardContent, Container, FormLabel, Grid, Radio, styled, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

const SelectionCardWrapper = styled(Box)<{
  active: "true" | "false";
  error: "true" | "false";
}>(({
  theme,
  active,
  error,
}) => ({
  cursor: "pointer",
  border: active === "true"
    ? `2px solid ${theme.colors.primary.dark}`
    : error === "true"
    ? `2px solid ${theme.colors.error.dark}`
    : "",
  borderRadius: 10,
  height: 80,
  width: "100%",
  backgroundColor: theme.colors.alpha.white[70],
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-around",
}));

export const paymentMethodProviderImages: Record<PaymentMethodProvider, string> = {
  Cash: "cash.svg",
  AYAPay: "aya-pay.png",
  CBPay: "cb-pay.png",
  KBZPay: "kbz-pay.png",
  OnePay: "one-pay.png",
  UABPay: "uab-pay.png",
  WavePay: "wave-pay.png",
  BankTransfer: "bank-transfer.svg",
};

export function PaymentMethodStep() {
  const { setValue, getValues, formState: { errors } } = useFormContext<CreateOrderInput>();

  const selectedPayment = getValues("paymentMethodProvider");

  const handleChangeAddressType = (payment: PaymentMethodProvider) => (_: React.MouseEvent<HTMLDivElement>) => {
    setValue("paymentMethodProvider", payment);
  };

  return (
    <Container maxWidth="lg">
      <Box display="flex" flexDirection="column" gap={3}>
        <Typography variant="h3">Payment Method</Typography>

        <Card>
          <CardContent>
            <Box display="flex" flexDirection="column" gap={2}>
              {/* TODO: Form label */}
              <FormLabel>Choose the billing address</FormLabel>
              <AddressInputField fieldName="billingAddressId" updateField />
            </Box>
          </CardContent>
        </Card>

        <Box display="flex" flexDirection="column" gap={1}>
          <Typography>Select the payment method</Typography>
          <Grid container gap={1}>
            {(Object.keys(PaymentMethodProvider) as PaymentMethodProvider[]).map(payment => {
              return (
                <Grid key={payment} item xs={3.8}>
                  <SelectionCardWrapper
                    key={payment}
                    error={!!errors.paymentMethodProvider ? "true" : "false"}
                    active={selectedPayment === payment ? "true" : "false"}
                    onClick={handleChangeAddressType(payment)}
                  >
                    <Radio
                      checked={selectedPayment === payment}
                      value="delivery"
                      name="delivery"
                      inputProps={{ "aria-label": "Delivery" }}
                    />
                    <Typography variant="h6">{payment}</Typography>
                    <Box
                      component="img"
                      sx={{
                        height: 40,
                      }}
                      alt={`payment-${payment}`}
                      src={`/static/${paymentMethodProviderImages[payment]}`}
                    />
                  </SelectionCardWrapper>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        <Box display="flex" flexDirection="column" gap={1}>
        </Box>
      </Box>
    </Container>
  );
}
