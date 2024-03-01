import { Suspense } from 'react';
import { Helmet } from 'react-helmet-async'
import { PageTitle, SuspenseLoader } from "@/components"
import { Container, Grid, Typography } from "@mui/material"
import { ProductsList } from "@/components/content/products";
import { MuiButton } from "@/components/ui";
import { OperationAction, Resource } from '@/services/types';
import { usePermission } from "@/hooks";
import { useNavigate } from "react-router-dom";

import getConfig from "@/libs/getConfig";
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import ErrorBoundary from '@/components/ErrorBoundary';


const appName = getConfig("appName")

function ListWrapper() {
  usePermission({ action: OperationAction.Read, resource: Resource.Product }).ok_or_throw()

  return <ProductsList />
}


export default function ListPage() {
  const navigate = useNavigate()

  const isAllowedCreateProduct = usePermission({
    action: OperationAction.Create,
    resource: Resource.Product
  }).is_ok()


  const handleNavigateCreate = (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/products/create")
  }


  return (
    <>
      <Helmet>
        <title>{appName} | List products</title>
        <meta name="description" content="Effortlessly manage your product list with our intuitive CRUD tables. Create, read, update, and delete products seamlessly. Streamline your inventory management, ensuring a well-organized and up-to-date product catalog. Explore user-friendly tables for efficient product list management."></meta>
      </Helmet>

      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>Products List</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>

          {isAllowedCreateProduct
          ? <Grid item>
              <MuiButton
                sx={{ mt: { xs: 2, md: 0 } }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
                onClick={handleNavigateCreate}
              >Create new product</MuiButton>
            </Grid>
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
  )
}
