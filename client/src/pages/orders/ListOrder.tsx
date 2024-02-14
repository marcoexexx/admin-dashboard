import { PermissionKey } from '@/context/cacheKey';
import { Suspense } from 'react';
import { Helmet } from 'react-helmet-async'
import { PageTitle, SuspenseLoader } from "@/components"
import { Container, Grid, Typography } from "@mui/material"
import { OrdersList } from '@/components/content/orders';
import { MuiButton } from "@/components/ui";
import { useNavigate } from 'react-router-dom'
import { usePermission } from "@/hooks"
import { getOrderPermissionsFn } from '@/services/permissionsApi';

import getConfig from "@/libs/getConfig";
import AppError, { AppErrorKind } from '@/libs/exceptions';
import ErrorBoundary from '@/components/ErrorBoundary';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';


const appName = getConfig("appName")


function ListOrderWrapper() {
  const isAllowedReadOrder = usePermission({
    key: PermissionKey.Order,
    actions: "read",
    queryFn: getOrderPermissionsFn
  })

  if (!isAllowedReadOrder) throw AppError.new(AppErrorKind.AccessDeniedError)

  return <OrdersList />
}


export default function ListOrder() {
  const navigate = useNavigate()

  const isAllowedCreatOrder = usePermission({
    key: PermissionKey.Order,
    actions: "create",
    queryFn: getOrderPermissionsFn
  })

  const handleNavigateCreate = () => {
    navigate("/orders/create")
  }


  return (
    <>
      <Helmet>
        <title>{appName} | List orders</title>
        <meta name="description" content=""></meta>
      </Helmet>

      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>Order List</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>

          {isAllowedCreatOrder
          ? <Grid item>
              <MuiButton
                sx={{ mt: { xs: 2, md: 0 } }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
                onClick={handleNavigateCreate}
              >Create new order</MuiButton>
            </Grid>
          : null}
          
        </Grid>
      </PageTitle>

      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>

            <ErrorBoundary>
              <Suspense fallback={<SuspenseLoader />}>
                <ListOrderWrapper />
              </Suspense>
            </ErrorBoundary>

          </Grid>
        </Grid>
      </Container>
    </>
  )
}
