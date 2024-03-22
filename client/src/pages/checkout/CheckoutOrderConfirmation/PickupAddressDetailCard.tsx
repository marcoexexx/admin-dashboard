import { SuspenseLoader } from "@/components";
import { CreateOrderInput } from "@/components/content/orders/forms";
import { useGetPickupAddress } from "@/hooks/pickupAddress";
import { Alert, Card, CardContent, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

export function PickupAddressDetailCard() {
  const { getValues } = useFormContext<CreateOrderInput>();
  const pickupAddressId = getValues("pickupAddressId");

  const { try_data, isLoading } = useGetPickupAddress({
    id: pickupAddressId,
  });
  const pickupAddress = try_data.ok_or_throw()?.pickupAddress;

  if (isLoading) return <SuspenseLoader />;

  return (
    <Card>
      {pickupAddress
        ? (
          <CardContent>
            <Typography variant="h4">{pickupAddress.username}</Typography>
            <Typography>Phone: {pickupAddress.phone}</Typography>
            {pickupAddress.email
              ? <Typography>Email: {pickupAddress.email}</Typography>
              : null}
            <Typography>
              date: {(new Date(pickupAddress.date) as Date).toUTCString()}
            </Typography>
          </CardContent>
        )
        : (
          <CardContent>
            <Alert severity="error">
              Error: Billing Address Not Found
            </Alert>
            <Typography mt={2}>
              Sorry, we couldn't find the specified billing address. It may
              have been deleted or does not exist in our records. Please
              double-check the address and try again. If you continue to
              experience issues, reach out to our support team for further
              assistance.
            </Typography>
          </CardContent>
        )}
    </Card>
  );
}
