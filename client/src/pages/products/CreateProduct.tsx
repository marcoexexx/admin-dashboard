import { Suspense } from 'react';
import { Helmet } from 'react-helmet-async'
import { PageTitle, SuspenseLoader } from "@/components";
import { CreateProductForm } from "@/components/content/products/forms";
import { Card, CardContent, Container, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { OperationAction, Resource } from '@/services/types';
import { usePermission } from "@/hooks";
import { useNavigate } from 'react-router-dom'

import getConfig from "@/libs/getConfig";
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import ErrorBoundary from '@/components/ErrorBoundary';


const appName = getConfig("appName")

function CreateFormWrapper() {
  usePermission({ action: OperationAction.Create, resource: Resource.Product }).ok_or_throw()

  return <Card>
    <CardContent>
      <CreateProductForm />
    </CardContent>
  </Card>
}


export default function CreatePage() {
  
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <>
      <Helmet>
        <title>{appName} | Create a product</title>
        <meta name="description" content="Create products effortlessly with our user-friendly platform. Streamline customization and showcase your offerings seamlessly. Start crafting your unique products today."></meta>
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
            <Typography variant="h3" component="h3" gutterBottom>Create a new product</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>
        </Grid>
      </PageTitle>

      <Container maxWidth="lg">
        <ErrorBoundary>
          <Suspense fallback={<SuspenseLoader />}>
            <CreateFormWrapper />
          </Suspense>
        </ErrorBoundary>
      </Container>
    </>
  )
}
