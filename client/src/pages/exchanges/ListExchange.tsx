import { PermissionKey } from '@/context/cacheKey';
import { Helmet } from 'react-helmet-async'
import { PageTitle, SuspenseLoader } from "@/components"
import { Container, Grid, Typography } from "@mui/material"
import { ExchangesList } from "@/components/content/exchanges";
import { MuiButton } from "@/components/ui";
import { useNavigate } from 'react-router-dom'
import { usePermission } from "@/hooks";
import { getExchangePermissionsFn } from "@/services/permissionsApi";

import getConfig from "@/libs/getConfig";
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import AppError, { AppErrorKind } from '@/libs/exceptions';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Suspense } from 'react';


const appName = getConfig("appName")


function ListExchangeWrapper() {
  const isAllowedReadExchange = usePermission({
    key: PermissionKey.Exchange,
    actions: "read",
    queryFn: getExchangePermissionsFn
  })
  
  if (!isAllowedReadExchange) throw AppError.new(AppErrorKind.AccessDeniedError)

  return <ExchangesList />
}


export default function ListExchange() {
  const navigate = useNavigate()

  const isAllowedCreateExchange = usePermission({
    key: PermissionKey.Exchange,
    actions: "create",
    queryFn: getExchangePermissionsFn
  })

  const handleNavigateCreate = (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/exchanges/create")
  }


  return (
    <>
      <Helmet>
        <title>{appName} | List exchanges</title>
        <meta name="description" content="Launch your own exchange effortlessly with our platform. Create a secure and customizable exchange to trade digital assets. Enjoy robust features, easy management, and a seamless user experience. Start your exchange journey now and elevate your cryptocurrency trading platform with our intuitive solutions."></meta>
      </Helmet>

      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>Exchanges List</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>

          {isAllowedCreateExchange
          ? <Grid item>
              <MuiButton
                sx={{ mt: { xs: 2, md: 0 } }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
                onClick={handleNavigateCreate}
              >Create new exchange</MuiButton>
            </Grid>
          : null }
          
        </Grid>
      </PageTitle>

      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>

            <ErrorBoundary>
              <Suspense fallback={<SuspenseLoader />}>
                <ListExchangeWrapper />
              </Suspense>
            </ErrorBoundary>

          </Grid>
        </Grid>
      </Container>
      
    </>
  )
}
