import { PageTitle, SuspenseLoader } from "@/components";
import { ShopownersList } from "@/components/content/shopowners";
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
  usePermission({
    action: OperationAction.Read,
    resource: Resource.Shopowner,
  }).ok_or_throw();

  return <ShopownersList />;
}

export default function ListPage() {
  const navigate = useNavigate();

  const isAllowedCreateShopowner = usePermission({
    action: OperationAction.Create,
    resource: Resource.Shopowner,
  }).is_ok();

  const handleNavigateCreate = (
    _: React.MouseEvent<HTMLButtonElement>,
  ) => {
    navigate("/shopowners/create");
  };

  return (
    <>
      <Helmet>
        <title>{appName} | List shopowners</title>
        <meta
          name="description"
          content="Effortlessly manage and organize your product brands with our intuitive CRUD table list. Create, update, and delete brands seamlessly, ensuring your brand portfolio is always up-to-date. Explore a user-friendly interface that simplifies brand management, making it easy to add new brands, edit existing information, and remove outdated entries. Optimize your business operations and maintain a well-organized brand catalog. Experience the convenience of our CRUD table list for brands."
        >
        </meta>
      </Helmet>

      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>
              Shopowners List
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing
              minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>

          {isAllowedCreateShopowner
            ? (
              <Grid item>
                <MuiButton
                  sx={{ mt: { xs: 2, md: 0 } }}
                  variant="contained"
                  startIcon={<AddTwoToneIcon fontSize="small" />}
                  onClick={handleNavigateCreate}
                >
                  Create new shopowner
                </MuiButton>
              </Grid>
            )
            : null}
        </Grid>
      </PageTitle>

      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
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
