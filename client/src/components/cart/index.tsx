import { Container, Grid, Typography } from "@mui/material"
import { CartsTable } from "./CartsTable"
import { MuiButton } from "../ui"
import { useNavigate } from "react-router-dom"
import { useStore } from "@/hooks"


export function Carts() {
  const { dispatch } = useStore()

  const navigate = useNavigate()

  const handleNavigate = () => {
    dispatch({ type: "CLOSE_MODAL_FORM", payload: "cart" })
    navigate("/checkout")
  }


  return (
    <Container>
      <Grid container justifyContent="space-between" alignItems="center" rowGap={3}>
        <Grid item xs={12}>
          <Typography variant="h3" component="h3" gutterBottom>Shopping carts</Typography>
          <CartsTable />
        </Grid>

        <Grid item xs={6}>
          {/* TODO: disable is product 404 */}
          <MuiButton onClick={handleNavigate}>Checkout</MuiButton>
        </Grid>
      </Grid>
    </Container>
  )
}

