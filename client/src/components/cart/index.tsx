import { useLocalStorage, useStore } from "@/hooks";
import { useGetCart } from "@/hooks/cart";
import { Container, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CreateOrderInput } from "../content/orders/forms";
import { MuiButton } from "../ui";
import { CartsTable } from "./CartsTable";

export function Carts() {
  const { dispatch } = useStore();

  const { try_data, isLoading } = useGetCart();
  const { get } = useLocalStorage();

  const navigate = useNavigate();

  const itemsCount = try_data.ok_or_throw()?.orderItems?.length;
  const disableCheckout = !itemsCount
    || !!get<CreateOrderInput>("PICKUP_FORM")?.createdPotentialOrderId;

  const handleNavigate = () => {
    dispatch({ type: "CLOSE_MODAL_FORM", payload: "cart" });
    navigate("/checkout");
  };

  return (
    <Container>
      <Grid container justifyContent="space-between" alignItems="center" rowGap={3}>
        <Grid item xs={12}>
          <Typography variant="h3" component="h3" gutterBottom>Shopping carts</Typography>
          <CartsTable />
        </Grid>

        <Grid item xs={6}>
          <MuiButton onClick={handleNavigate} loading={isLoading} disabled={disableCheckout}>
            Checkout
          </MuiButton>
        </Grid>
      </Grid>
    </Container>
  );
}
