import { PageTitle, SuspenseLoader } from "@/components";
import { UpdateUserForm } from "@/components/content/users/forms";
import { usePermission } from "@/hooks";
import { OperationAction, Resource } from "@/services/types";
import { Card, CardContent, Container, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import ErrorBoundary from "@/components/ErrorBoundary";
import getConfig from "@/libs/getConfig";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";

const appName = getConfig("appName");

function UpdateFormWrapper() {
  usePermission({ action: OperationAction.Update, resource: Resource.User }).ok_or_throw();

  return (
    <Card>
      <CardContent>
        <UpdateUserForm />
      </CardContent>
    </Card>
  );
}

export default function UpdateForm() {
  return (
    <>
      <Helmet>
        <title>{appName} | Change User role</title>
      </Helmet>

      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Tooltip arrow placeholder="top" title="go back">
              <IconButton color="primary" sx={{ p: 2, mr: 2 }} component={Link} to="/users/list">
                <ArrowBackTwoToneIcon />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid item xs={10}>
            <Typography variant="h3" component="h3" gutterBottom>Change Role</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint
              consectetur cupidatat.
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
  );
}
