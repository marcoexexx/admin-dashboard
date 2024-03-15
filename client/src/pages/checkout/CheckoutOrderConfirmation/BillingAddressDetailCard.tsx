import { Address } from "@/services/types";
import { Alert, Card, CardContent, Typography } from "@mui/material";

interface BillingAddressDetailCardProps {
  billingAddress: Address | undefined;
}

export function BillingAddressDetailCard({ billingAddress }: BillingAddressDetailCardProps) {
  return (
    <Card>
      {billingAddress
        ? (
          <CardContent>
            <Typography variant="h4">{billingAddress.username}</Typography>
            <Typography>Phone: {billingAddress.phone}</Typography>
            {billingAddress.email ? <Typography>Email: {billingAddress.email}</Typography> : null}
            <Typography>full address: {billingAddress.fullAddress}</Typography>
          </CardContent>
        )
        : (
          <CardContent>
            <Alert severity="error">Error: Billing Address Not Found</Alert>
            <Typography mt={2}>
              Sorry, we couldn't find the specified billing address. It may have been deleted or does not exist in our
              records. Please double-check the address and try again. If you continue to experience issues, reach out to
              our support team for further assistance.
            </Typography>
          </CardContent>
        )}
    </Card>
  );
}
