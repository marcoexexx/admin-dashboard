import { Suspense } from 'react';
import { Helmet } from 'react-helmet-async'
import { PageTitle, SuspenseLoader } from "@/components";
import { Card, CardContent, Container, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { UpdateRegionForm } from '@/components/content/regions/forms/UpdateRegionForm';
import { OperationAction, Resource } from '@/services/types';
import { useNavigate } from 'react-router-dom'
import { usePermission } from "@/hooks";

import ErrorBoundary from '@/components/ErrorBoundary';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import getConfig from '@/libs/getConfig';


const appName = getConfig("appName")

function UpdateFormWrapper() {
  usePermission({ action: OperationAction.Update, resource: Resource.Region }).ok_or_throw()

  return  <Card>
    <CardContent>
      <UpdateRegionForm />
    </CardContent>
  </Card>
}


export default function UpdatePage() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }


  return (
    <>
      <Helmet>
        <title>{appName} | Update region</title>
        <meta name="description" content=""></meta>
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
            <Typography variant="h3" component="h3" gutterBottom>Update a region</Typography>
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
                <UpdateFormWrapper />
              </Suspense>
            </ErrorBoundary>

          </Grid>
        </Grid>
      </Container>
    </>
  )
}


