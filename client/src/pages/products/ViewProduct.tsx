import { PageTitle, SuspenseLoader } from "@/components";
import { ProductDetail } from "@/components/content/products/detail";
import { MuiButton } from "@/components/ui";
import { usePermission } from "@/hooks";
import { OperationAction, Resource } from "@/services/types";
import { Container, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ErrorBoundary from "@/components/ErrorBoundary";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";

function ViewWrapper({ productId }: { productId: string | undefined; }) {
  usePermission({ action: OperationAction.Read, resource: Resource.Product }).ok_or_throw();

  return <ProductDetail productId={productId} />;
}

export default function ViewDetailPage() {
  const { productId } = useParams();

  const navigate = useNavigate();

  const isAllowedUpdateProduct = usePermission({
    action: OperationAction.Update,
    resource: Resource.Product,
  }).is_ok();

  const handleBack = (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate(-1);
  };

  const handleUpdate = (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate(`/products/update/${productId}`);
  };

  return (
    <>
      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Tooltip arrow placeholder="top" title="go back">
              <IconButton color="primary" sx={{ p: 2, mr: 2 }} onClick={handleBack}>
                <ArrowBackTwoToneIcon />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>Products Detail</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>

          {isAllowedUpdateProduct
            ? (
              <Grid item>
                <MuiButton
                  sx={{ mt: { xs: 2, md: 0 } }}
                  variant="contained"
                  startIcon={<EditTwoToneIcon fontSize="small" />}
                  onClick={handleUpdate}
                >
                  Update product
                </MuiButton>
              </Grid>
            )
            : null}
        </Grid>
      </PageTitle>

      <Container maxWidth="lg">
        <ErrorBoundary>
          <Suspense fallback={<SuspenseLoader />}>
            <ViewWrapper productId={productId} />
          </Suspense>
        </ErrorBoundary>
      </Container>
    </>
  );
}
