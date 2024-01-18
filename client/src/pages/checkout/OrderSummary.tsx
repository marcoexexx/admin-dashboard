import { MuiButton } from "@/components/ui"
import { useLocalStorage, useStore } from "@/hooks"
import { numberFormat } from "@/libs/numberFormat"
import { OrderItem } from "@/services/types"
import { Alert, Badge, Box, Card, CardContent, Container, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material"


interface OrderSummaryProps {
  deliveryFee: number | undefined
  totalAmount: number
}

/**
 * totalAmount is total price of in all order items     := orderItems.reduce((total, item) => total + item.totalPrice, 0)
 * totalPrice is total price of order                   := totalAmount + deliveryFee
 */
export function OrderSummary({deliveryFee = 0, totalAmount = 0}: OrderSummaryProps) {
  const { get } = useLocalStorage()

  const { dispatch } = useStore()

  const items = get<OrderItem[]>("CARTS") || []  // should not `0` or empty string. So, using `||`

  const itemCount = items.length
  
  const handleViewItems = (_: React.MouseEvent<HTMLButtonElement>) => {
    dispatch({
      type: "OPEN_MODAL_FORM",
      payload: "cart"
    })
  }


  return (
    <Container maxWidth="lg">
      <Card>
        <CardContent>
          <Box display="flex" flexDirection="column" gap={3}>
            <Typography variant="h3">Order Summary</Typography>

            <Grid container alignItems="baseline" rowGap={1}>
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
                  <MuiButton size="large" onClick={handleViewItems}>View items</MuiButton>
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
                          <Typography variant="h4">{numberFormat(totalAmount)} Ks</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="h4">Delivery fee</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="h4">{numberFormat(deliveryFee)} Ks</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="h4">Total</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="h4">{numberFormat(totalAmount + deliveryFee)} Ks</Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12}>
                <Alert severity="info">Transportation charges may vary due to your shipping method or address.</Alert>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}
