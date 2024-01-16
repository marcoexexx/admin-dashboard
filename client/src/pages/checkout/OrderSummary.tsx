import { MuiButton } from "@/components/ui"
import { useLocalStorage } from "@/hooks"
import { OrderItem } from "@/services/types"
import { Badge, Box, Card, CardContent, Container, Grid, Typography } from "@mui/material"


interface OrderSummaryProps {}

export function OrderSummary({}: OrderSummaryProps) {
  const { get } = useLocalStorage()

  const items = get<OrderItem[]>("CARTS") || []  // should not `0` or empty string. So, using `||`

  const itemCount = items.length


  return (
    <Container maxWidth="lg">
      <Card>
        <CardContent>
          <Box display="flex" flexDirection="column" gap={3}>
            <Typography variant="h3">Order Summary</Typography>

            <Grid container alignItems="baseline">
              <Grid item xs={8}>
                <Box>
                  <Typography mb={2} variant="h4">Total {itemCount} items</Typography>
                  <Box display="flex" flexDirection="row" gap={1}>
                    {items.slice(0, 3).map((item, idx) => {
                      if (item.product) return <Badge key={idx} badgeContent={item.quantity} variant="standard" color="primary">
                        <Box
                          component="img"
                          sx={{
                            height: 54,
                          }}
                          alt={item.product.title}
                          // src={item.product.images[0]}
                          src={"../../../public/static/box.svg"}  // TODO: real product image
                        />
                      </Badge>
                    })}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={4}>
                <MuiButton size="large">View items</MuiButton>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}
