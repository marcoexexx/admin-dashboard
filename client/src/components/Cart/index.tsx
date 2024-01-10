import { Container, Grid, Typography } from "@mui/material"
import { CartsTable } from "./CartsTable"
import { OrderItem } from "@/services/types"


interface CartsProps {
  orderItems: OrderItem[]
}


export function Carts(props: CartsProps) {
  const { orderItems } = props

  return (
    <Container>
      <Grid container justifyContent="space-between" alignItems="center" rowGap={3}>
        <Grid item xs={12}>
          <Typography variant="h3" component="h3" gutterBottom>Shopping carts</Typography>
          <CartsTable carts={orderItems} />
        </Grid>

        <Grid item xs={6}>
          <Typography variant="h3" component="h3" gutterBottom>Summary</Typography>
        </Grid>
      </Grid>
    </Container>
  )
}

