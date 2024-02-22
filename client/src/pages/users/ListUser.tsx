import { Suspense } from 'react';
import { Helmet } from 'react-helmet-async'
import { PageTitle, SuspenseLoader } from "@/components"
import { Container, Grid, Typography } from "@mui/material"
import { UsersList } from "@/components/content/users";
import { OperationAction, Resource } from '@/services/types';
import { usePermission } from "@/hooks";

import ErrorBoundary from '@/components/ErrorBoundary';
import getConfig from "@/libs/getConfig";


const appName = getConfig("appName")


function ListUserWrapper() {
  usePermission({ action: OperationAction.Read, resource: Resource.User }).ok_or_throw()

  return <UsersList />
}


export default function ListUser() {
  return (
    <>
      <Helmet>
        <title>{appName} | List users</title>
        <meta name="description" content="Effortlessly manage user roles on our platform with our intuitive user list page. View and organize users based on roles such as User, Guest, Shop Owner, Admin, and Employee. Streamline user management, permissions, and access levels seamlessly. Explore now for a comprehensive overview of your user base and simplified role-based administration."></meta>
      </Helmet>

      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>Users List</Typography>
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
                <ListUserWrapper />
              </Suspense>
            </ErrorBoundary>

          </Grid>
        </Grid>
      </Container>
    </>
  )
}
