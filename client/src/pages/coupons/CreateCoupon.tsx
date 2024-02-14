import { PermissionKey } from '@/context/cacheKey';
import { Suspense } from 'react';
import { Helmet } from 'react-helmet-async'
import { PageTitle, SuspenseLoader } from "@/components";
import { Card, CardContent, Container, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { CreateCouponForm } from '@/components/content/coupons/forms';
import { usePermission } from "@/hooks";
import { useNavigate } from 'react-router-dom'
import { getCouponsPermissionsFn } from '@/services/permissionsApi';

import getConfig from "@/libs/getConfig";
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import ErrorBoundary from '@/components/ErrorBoundary';
import AppError, { AppErrorKind } from '@/libs/exceptions';


const appName = getConfig("appName")


function CreateCouponWrapper() {
  const isAllowedCreateCoupon = usePermission({
    key: PermissionKey.Coupon,
    actions: "create",
    queryFn: getCouponsPermissionsFn
  })

  if (!isAllowedCreateCoupon) throw AppError.new(AppErrorKind.AccessDeniedError)
  
  return <Card>
      <CardContent>
        <CreateCouponForm />
      </CardContent>
    </Card>
}


export default function CreateCoupon() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <>
      <Helmet>
        <title>{appName} | Create a new coupon</title>
        <meta name="description" content="Effortlessly coupon currencies with our user-friendly platform. Get real-time rates, seamless transactions, and a secure experience. Simplify currency exchange and manage your finances with ease. Explore now for quick and hassle-free international transactions."></meta>
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
            <Typography variant="h3" component="h3" gutterBottom>Create a new coupon</Typography>
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
                <CreateCouponWrapper />
              </Suspense>
            </ErrorBoundary>

          </Grid>
        </Grid>
      </Container>
    </>
  )
}

