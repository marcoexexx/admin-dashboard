import { PermissionKey } from '@/context/cacheKey';
import { Suspense } from 'react';
import { Helmet } from 'react-helmet-async'
import { PageTitle, SuspenseLoader } from "@/components";
import { Card, CardContent, Container, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { UpdateSalesCategoryForm } from "@/components/content/sales-categories/forms";
import { usePermission } from "@/hooks";
import { getSalesCategoryPermissionsFn } from "@/services/permissionsApi";
import { useNavigate } from 'react-router-dom';

import getConfig from "@/libs/getConfig";
import AppError, { AppErrorKind } from '@/libs/exceptions';
import ErrorBoundary from '@/components/ErrorBoundary';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';


const appName = getConfig("appName")

function UpdateSalesCategoryWrapper() {
  const isAllowedUpdateSalesCategory = usePermission({
    key: PermissionKey.SalesCategory,
    actions: "update",
    queryFn: getSalesCategoryPermissionsFn
  })
  
  if (!isAllowedUpdateSalesCategory) throw AppError.new(AppErrorKind.AccessDeniedError)

  return <Card>
    <CardContent>
      <UpdateSalesCategoryForm />
    </CardContent>
  </Card>
}


export default function UpdateSalesCategory() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }


  return (
    <>
      <Helmet>
        <title>{appName} | Update sale</title>
        <meta name="description" content="Effortlessly refine and update your sales data with our user-friendly platform. Seamlessly edit details, track performance, and optimize your sales strategy. Take control of your revenue insights and ensure your sales data stays accurate. Simplify the update process with our intuitive tools. Explore now for hassle-free sales management and enhanced business performance."></meta>
      </Helmet>

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

          <Grid item xs={10}>
            <Typography variant="h3" component="h3" gutterBottom>Update a sales category</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>
        </Grid>
      </PageTitle>

      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12} md={8}>

            <ErrorBoundary>
              <Suspense fallback={<SuspenseLoader />}>
                <UpdateSalesCategoryWrapper />
              </Suspense>
            </ErrorBoundary>

          </Grid>
        </Grid>
      </Container>
    </>
  )
}


