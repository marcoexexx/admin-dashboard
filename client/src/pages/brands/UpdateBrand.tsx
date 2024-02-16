import { Suspense } from 'react';
import { Helmet } from 'react-helmet-async'
import { PageTitle } from "@/components";
import { UpdateBrandForm } from "@/components/content/brands/forms";
import { Card, CardContent, Container, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { OperationAction, Resource } from '@/services/types';
import { useNavigate } from 'react-router-dom'
import { usePermission } from "@/hooks";

import getConfig from "@/libs/getConfig";
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import ErrorBoundary from '@/components/ErrorBoundary';


const appName = getConfig("appName")


function UpdateBrandWrapper() {
  usePermission({ action: OperationAction.Update, resource: Resource.Brand }).ok_or_throw()

  return (
    <Card>
      <CardContent>
        <UpdateBrandForm />
      </CardContent>
    </Card>
  )
}


export default function UpdateBrand() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }


  return (
    <>
      <Helmet>
        <title>{appName} | Update brand</title>
        <meta name="description" content="Effortlessly update and refine your product brand details with our user-friendly brand update page. Seamlessly edit brand names, logos, and other essential information, ensuring your brand identity remains current and compelling. Take control of your brand's image, make instant modifications, and maintain a consistent and polished appearance. Simplify the brand update process with our intuitive tools and keep your business on the cutting edge. Explore the power of effortless brand management today."></meta>
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
            <Typography variant="h3" component="h3" gutterBottom>Update a brand</Typography>
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
              <Suspense>
                <UpdateBrandWrapper />
              </Suspense>
            </ErrorBoundary>

          </Grid>
        </Grid>
      </Container>
      
    </>
  )
}


