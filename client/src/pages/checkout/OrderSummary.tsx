import { MuiButton } from "@/components/ui"
import { useLocalStorage } from "@/hooks"
import { OrderItem } from "@/services/types"
import { Badge, Box, Card, CardContent, Container, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material"


interface OrderSummaryProps {
  deliveryFee: number | undefined
}

export function OrderSummary({deliveryFee = 0}: OrderSummaryProps) {
  const { get } = useLocalStorage()

  const items = get<OrderItem[]>("CARTS") || []  // should not `0` or empty string. So, using `||`

  const itemCount = items.length
  const totalAmount = items.reduce((total, item) => total + item.totalPrice, 0)


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
                <Box display="flex" justifyContent="end">
                  <MuiButton size="large">View items</MuiButton>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Divider orientation="horizontal" sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={12}>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Typography variant="h4">Subtotal ({itemCount} items)</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="h4">{new Intl.NumberFormat().format(totalAmount)} Ks</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="h4">Delivery fee</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="h4">{new Intl.NumberFormat().format(deliveryFee)} Ks</Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}
