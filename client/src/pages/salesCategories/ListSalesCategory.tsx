import { Suspense } from 'react';
import { Helmet } from 'react-helmet-async'
import { PageTitle, SuspenseLoader } from "@/components"
import { Container, Grid, Typography } from "@mui/material"
import { SalesCategoriesList } from "@/components/content/sales-categories";
import { MuiButton } from "@/components/ui";
import { useNavigate } from 'react-router-dom'
import { usePermission } from "@/hooks";
import { getSalesCategoryPermissionsFn } from "@/services/permissionsApi";

import getConfig from "@/libs/getConfig";
import ErrorBoundary from '@/components/ErrorBoundary';
import AppError, { AppErrorKind } from '@/libs/exceptions';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';


const appName = getConfig("appName")

function ListSalesCategoryWrapper() {
  const isAllowedReadSalesCategory = usePermission({
    key: "sales-category-permissions",
    actions: "read",
    queryFn: getSalesCategoryPermissionsFn
  })

  if (!isAllowedReadSalesCategory) throw AppError.new(AppErrorKind.AccessDeniedError)

  return  <SalesCategoriesList />
}


export default function ListSalesCategory() {
  const navigate = useNavigate()

  const isAllowedCreateSalesCategory = usePermission({
    key: "sales-category-permissions",
    actions: "create",
    queryFn: getSalesCategoryPermissionsFn
  })

  const handleNavigateCreate = () => {
    navigate("/sales-categories/create")
  }


  return (
    <>
      <Helmet>
        <title>{appName} | List sales</title>
        <meta name="description" content="Effortlessly manage your sales data with our intuitive sales table. View, track, and analyze your product sales seamlessly. Stay informed about revenue, quantities sold, and more with our user-friendly interface. Explore the power of efficient sales data management for a clear overview of your business performance."></meta>
      </Helmet>

      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>Sale category List</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>

          {isAllowedCreateSalesCategory
          ? <Grid item>
              <MuiButton
                sx={{ mt: { xs: 2, md: 0 } }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
                onClick={handleNavigateCreate}
              >Create new sale category</MuiButton>
            </Grid>
          : null}
          
        </Grid>
      </PageTitle>

      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>

            <ErrorBoundary>
              <Suspense fallback={<SuspenseLoader />}>
                <ListSalesCategoryWrapper />
              </Suspense>
            </ErrorBoundary>

          </Grid>
        </Grid>
      </Container>
    </>
  )
}
