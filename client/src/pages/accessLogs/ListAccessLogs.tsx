import { Suspense } from 'react';
import { Helmet } from 'react-helmet-async'
import { PageTitle, SuspenseLoader } from "@/components"
import { Container, Grid, Typography } from "@mui/material"
import { AccessLogsList } from '@/components/content/accessLogs';
import { OperationAction, Resource } from '@/services/types';
import { usePermission } from "@/hooks";

import getConfig from "@/libs/getConfig";
import ErrorBoundary from '@/components/ErrorBoundary';


const appName = getConfig("appName")


function ListAccessLogsWrapper() {
  usePermission({ action: OperationAction.Read, resource: Resource.AccessLog }).ok_or_throw()

  return <AccessLogsList />
}


export default function ListAccessLogs() {
  return (
    <>
      <Helmet>
        <title>{appName} | List Access logs</title>
        <meta name="description" content=""></meta>
      </Helmet>

      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>Access logs List</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>
        </Grid>
      </PageTitle>

      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>

            <ErrorBoundary>
              <Suspense fallback={<SuspenseLoader />}>
                <ListAccessLogsWrapper />
              </Suspense>
            </ErrorBoundary>

          </Grid>
        </Grid>
      </Container>
    </>
  )
}
