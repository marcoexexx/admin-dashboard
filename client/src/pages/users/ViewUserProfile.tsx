import { Suspense } from 'react';
import { Helmet } from 'react-helmet-async'
import { PageTitle, SuspenseLoader } from "@/components"
import { Container, Grid, IconButton, Tooltip, Typography } from "@mui/material"
import { UserProfile } from "@/components/content/users";
import { OperationAction, Resource } from '@/services/types';
import { useNavigate, useParams } from 'react-router-dom'
import { usePermission } from "@/hooks";

import getConfig from "@/libs/getConfig";
import ErrorBoundary from '@/components/ErrorBoundary';
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";


const appName = getConfig("appName")

function ViewDetailWrapper({ username }: { username: string | undefined }) {
  usePermission({ action: OperationAction.Read, resource: Resource.User }).ok_or_throw()

  return <UserProfile username={username} />
}


export default function ViewPage() {
  const { username } = useParams()

  const navigate = useNavigate()

  const isAllowedUpdateUser = usePermission({
    action: OperationAction.Update,
    resource: Resource.User
  }).is_ok()

  const handleBack= (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate(-1)
  }


  return (
    <>
      <Helmet>
        <title>{appName} | Change User role</title>
        <meta name="description" content={`Explore the detailed profile of User ID ${username} on our platform. Gain insights into user information, activity, and preferences. Enhance user engagement and personalize interactions seamlessly. Dive into a comprehensive view of user profiles for a more tailored and user-centric experience.`}></meta>
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

          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>User profile</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>

          {isAllowedUpdateUser
          ? <p>change role...</p>
          : null}

        </Grid>
      </PageTitle>

      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>

            <ErrorBoundary>
              <Suspense fallback={<SuspenseLoader />}>
                <ViewDetailWrapper username={username }/>
              </Suspense>
            </ErrorBoundary>

          </Grid>
        </Grid>
      </Container>
    </>
  )
}

