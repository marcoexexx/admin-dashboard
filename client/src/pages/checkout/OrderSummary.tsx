import { Box, Container, Typography } from "@mui/material"

interface OrderSummaryProps {}

export function OrderSummary(props: OrderSummaryProps) {
  const {} = props

  return (
    <Container maxWidth="lg">
      <Box display="flex" flexDirection="column" gap={3}>
        <Typography variant="h3">Order Summary</Typography>
      </Box>
    </Container>
  )
}
