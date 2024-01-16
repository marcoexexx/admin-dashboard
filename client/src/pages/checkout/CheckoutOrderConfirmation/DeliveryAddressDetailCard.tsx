import { Address } from "@/services/types";
import { Alert, Card, CardContent, Typography } from "@mui/material";


interface DeliveryAddressDetailCardProps {
  deliveryAddress: Address | undefined
}

export function DeliveryAddressDetailCard({deliveryAddress}: DeliveryAddressDetailCardProps) {
  return (
    <Card>
      {deliveryAddress
        ? <CardContent>
            <Typography variant="h4">{deliveryAddress.username}</Typography>
            <Typography>Phone: {deliveryAddress.phone}</Typography>
           {deliveryAddress.email ? <Typography>Email: {deliveryAddress.email}</Typography> : null}
            <Typography>full address: {deliveryAddress.fullAddress}</Typography>
          </CardContent>
        : <CardContent>
        <Alert severity="error">Error: Delivery Address Not Found</Alert>
        <Typography mt={2}>Sorry, we couldn't find the specified delivery address. It may have been deleted or does not exist in our records. Please double-check the address and try again. If you continue to experience issues, reach out to our support team for further assistance.</Typography>
      </CardContent>}
    </Card>
  )
}
