import { PageTitle, SuspenseLoader } from "@/components";
import { PickupAddressList } from "@/components/content/pickupAddressHistory";
import { MuiButton } from "@/components/ui";
import { usePermission } from "@/hooks";
import { OperationAction, Resource } from "@/services/types";
import { Container, Grid, Typography } from "@mui/material";
import { Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

import ErrorBoundary from "@/components/ErrorBoundary";
import getConfig from "@/libs/getConfig";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";

const appName = getConfig("appName");

function ListWrapper() {
  usePermission({ action: OperationAction.Read, resource: Resource.PickupAddress }).ok_or_throw();

  return <PickupAddressList />;
}

export default function ListPage() {
  const navigate = useNavigate();

  const isAllowedCreatePickupAddress = usePermission({
    action: OperationAction.Create,
    resource: Resource.PickupAddress,
  }).is_ok();

  const handleNavigateCreate = (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/pickup-address-history/create");
  };

  return (
    <>
      <Helmet>
        <title>{appName} | List pickup address history</title>
        <meta name="description" content=""></meta>
      </Helmet>

      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>Pickup address history</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>

          {isAllowedCreatePickupAddress
            ? (
              <Grid item>
                <MuiButton
                  sx={{ mt: { xs: 2, md: 0 } }}
                  variant="contained"
                  startIcon={<AddTwoToneIcon fontSize="small" />}
                  onClick={handleNavigateCreate}
                >
                  Create new pickup address
                </MuiButton>
              </Grid>
            )
            : null}
        </Grid>
      </PageTitle>

      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>
            <ErrorBoundary>
              <Suspense fallback={<SuspenseLoader />}>
                <ListWrapper />
              </Suspense>
            </ErrorBoundary>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
