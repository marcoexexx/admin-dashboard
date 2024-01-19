import { Alert, Badge, Box, Card, CardContent, Chip, Container, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material"
import { MuiButton } from "@/components/ui"
import { OrderItem } from "@/services/types"
import { useMemo } from "react"
import { useStore } from "@/hooks"
import { numberFormat } from "@/libs/numberFormat"


interface OrderSummaryProps {
  orderItems: OrderItem[]
  deliveryFee: number | undefined
}

/**
 * totalAmount is total price of in all order items     := orderItems.reduce((total, item) => total + item.totalPrice, 0)
 * totalPrice is total price of order                   := totalAmount + deliveryFee
 */
export function OrderSummary({orderItems, deliveryFee = 0}: OrderSummaryProps) {
  const { dispatch } = useStore()

  const itemCount = orderItems.length

  const totalAmount = useMemo(() => orderItems.reduce((total, item) => {
    // console.log("re-calculate")
    return total + item.totalPrice
  }, 0), [JSON.stringify(orderItems)])

  const originalTotalPrice = useMemo(() => orderItems.reduce((total, item) => {
    // console.log("re-calculate")
    return total + item.originalTotalPrice
  }, 0), [JSON.stringify(orderItems)])

  const totalSaving = useMemo(() => orderItems.reduce((total, item) => {
    // console.log("re-calculate")
    return total + item.saving
  }, 0), [JSON.stringify(orderItems)])

  
  const handleViewItems = () => {
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
                    {orderItems.slice(0, 3).map((item, idx) => {
                      if (item.product) return <Badge key={idx} badgeContent={item.quantity} variant="standard" color="primary">
                        <Box
                          component="img"
                          sx={{
                            height: 54,
                          }}
                          alt={item.product.title}
                          src={item.product.images[0] || "/static/box.svg"}
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
                        <TableCell sx={{ verticalAlign: "top" }}>
                          <Typography variant="h4">Subtotal ({itemCount} items)</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="h4">{numberFormat(totalAmount)} Ks</Typography>
                          <Typography variant="h5" sx={{ textDecoration: "line-through" }}>{numberFormat(originalTotalPrice)} Ks</Typography>
                          <Box display="flex" alignItems="center" gap={1} justifyContent="end">
                            <Chip 
                              label="saving" 
                              style={{ borderRadius: 5 }}
                              color="primary" 
                              size="small" />
                            <Typography variant="h5">{numberFormat(totalSaving)} Ks</Typography>
                          </Box>
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
