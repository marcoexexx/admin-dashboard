import { Suspense } from 'react';
import { Helmet } from 'react-helmet-async'
import { PageTitle, SuspenseLoader } from "@/components"
import { MuiButton } from "@/components/ui";
import { UserAddressesList } from '@/components/content/user-addresses';
import { Container, Grid, Typography } from "@mui/material"
import { usePermission } from "@/hooks";
import { useNavigate } from 'react-router-dom'
import { getUserAddressPermissionsFn } from "@/services/permissionsApi";

import getConfig from "@/libs/getConfig";
import AppError, { AppErrorKind } from '@/libs/exceptions';
import ErrorBoundary from '@/components/ErrorBoundary';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';


const appName = getConfig("appName")

function ListUserAddressWrapper() {
  const isAllowedReadUserAddress = usePermission({
    key: "address-permissions",
    actions: "read",
    queryFn: getUserAddressPermissionsFn
  })

  if (!isAllowedReadUserAddress) throw AppError.new(AppErrorKind.AccessDeniedError)

  return <UserAddressesList />
}


export default function ListUserAddress() {
  const navigate = useNavigate()

  const isAllowedCreateUserAddress = usePermission({
    key: "address-permissions",
    actions: "create",
    queryFn: getUserAddressPermissionsFn
  })

  const handleNavigateCreate = (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/addresses/create")
  }


  return (
    <>
      <Helmet>
        <title>{appName} | List Address</title>
        <meta name="description" content=""></meta>
      </Helmet>

      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>My addresses List</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>

          {isAllowedCreateUserAddress
          ? <Grid item>
              <MuiButton
                sx={{ mt: { xs: 2, md: 0 } }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
                onClick={handleNavigateCreate}
              >Create new address</MuiButton>
            </Grid>
          : null}
        </Grid>
      </PageTitle>

       <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>

            <ErrorBoundary>
              <Suspense fallback={<SuspenseLoader />}>
                <ListUserAddressWrapper />
              </Suspense>
            </ErrorBoundary>

          </Grid>
        </Grid>
      </Container>
    </>
  )
}
