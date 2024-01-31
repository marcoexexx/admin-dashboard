import { Container, Grid, Typography } from "@mui/material"
import { CartsTable } from "./CartsTable"
import { OrderItem } from "@/services/types"
import { MuiButton } from "../ui"
import { useNavigate } from "react-router-dom"
import { useStore } from "@/hooks"


interface CartsProps {
  orderItems: OrderItem[]
}


export function Carts(props: CartsProps) {
  const { orderItems } = props

  const { dispatch, state: {disableCheckOut: invalidCart} } = useStore()

  const disableCheckOut = invalidCart || !orderItems.length

  const navigate = useNavigate()

  const handleNavigate = () => {
    if (!disableCheckOut) {
      dispatch({ type: "CLOSE_MODAL_FORM", payload: "cart" })
      navigate("/checkout")
    }
  }


  return (
    <Container>
      <Grid container justifyContent="space-between" alignItems="center" rowGap={3}>
        <Grid item xs={12}>
          <Typography variant="h3" component="h3" gutterBottom>Shopping carts</Typography>
          <CartsTable carts={orderItems} />
        </Grid>

        <Grid item xs={6}>
          <MuiButton disabled={disableCheckOut} onClick={handleNavigate}>Checkout</MuiButton>
        </Grid>
      </Grid>
    </Container>
  )
}

