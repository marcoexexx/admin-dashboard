import { Suspense } from 'react';
import { Helmet } from 'react-helmet-async'
import { PageTitle, SuspenseLoader } from "@/components"
import { Container, Grid, Typography } from "@mui/material"
import { MuiButton } from "@/components/ui"; import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { RegionsList } from '@/components/content/regions';
import { OperationAction, Resource } from '@/services/types';
import { useNavigate } from 'react-router-dom'
import { usePermission } from "@/hooks";

import getConfig from "@/libs/getConfig";
import ErrorBoundary from '@/components/ErrorBoundary';


const appName = getConfig("appName")

function ListRegionWrapper() {
  usePermission({ action: OperationAction.Read, resource: Resource.Region }).ok_or_throw()

  return <RegionsList />
}


export default function ListRegion() {
  const navigate = useNavigate()

  const isAllowedCreateRegion = usePermission({
    action: OperationAction.Create,
    resource: Resource.Region
  }).is_ok()

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
