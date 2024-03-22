import { PageTitle } from "@/components";
import ErrorBoundary from "@/components/ErrorBoundary";
import getConfig from "@/libs/getConfig";
import { Container, Grid, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { CheckoutForm } from "./CheckoutForm";

// TODO: Update pickup form :: feature

const appName = getConfig("appName");

export default function Checkout() {
  return (
    <>
      <Helmet>
        <title>{appName} | Checkout</title>
        <meta name="description" content=""></meta>
      </Helmet>

      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>Checkout</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint
              consectetur cupidatat.
            </Typography>
          </Grid>
        </Grid>
      </PageTitle>

      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>
            <ErrorBoundary>
              <CheckoutForm />
            </ErrorBoundary>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
