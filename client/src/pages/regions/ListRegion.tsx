import { Suspense } from 'react';
import { Helmet } from 'react-helmet-async'
import { PageTitle, SuspenseLoader } from "@/components"
import { Container, Grid, Typography } from "@mui/material"
import { MuiButton } from "@/components/ui"; import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { RegionsList } from '@/components/content/regions';
import { useNavigate } from 'react-router-dom'
import { usePermission } from "@/hooks";
import { getRegionPermissionsFn } from "@/services/permissionsApi";

import getConfig from "@/libs/getConfig";
import AppError, { AppErrorKind } from '@/libs/exceptions';
import ErrorBoundary from '@/components/ErrorBoundary';


const appName = getConfig("appName")

function ListRegionWrapper() {
  const isAllowedReadRegion = usePermission({
    key: "region-permissions",
    actions: "read",
    queryFn: getRegionPermissionsFn
  })

  if (!isAllowedReadRegion) throw AppError.new(AppErrorKind.AccessDeniedError)

  return <RegionsList />
}


export default function ListRegion() {
  const navigate = useNavigate()

  const isAllowedCreateRegion = usePermission({
    key: "region-permissions",
    actions: "create",
    queryFn: getRegionPermissionsFn
  })

  const handleNavigateCreate = (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/regions/create")
  }


  return (
    <>
      <Helmet>
        <title>{appName} | List regions</title>
        <meta name="description" content=""></meta>
      </Helmet>

      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>Regions List</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>

          {isAllowedCreateRegion
          ? <Grid item>
              <MuiButton
                sx={{ mt: { xs: 2, md: 0 } }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
                onClick={handleNavigateCreate}
              >Create new region</MuiButton>
            </Grid>
          : null}
        </Grid>
      </PageTitle>

       <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>

            <ErrorBoundary>
              <Suspense fallback={<SuspenseLoader />}>
                <ListRegionWrapper />
              </Suspense>
            </ErrorBoundary>

          </Grid>
        </Grid>
      </Container>
    </>
  )
}
