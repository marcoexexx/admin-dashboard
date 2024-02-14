import { Helmet } from 'react-helmet-async'
import { PermissionKey } from "@/context/cacheKey";
import { PageTitle } from "@/components"
import { Container, Grid, Typography } from "@mui/material"
import { AuditLogsList } from "@/components/content/auditLogs";
import { Suspense } from "react";
import { usePermission } from "@/hooks";
import { getAuditLogsPermissionsFn } from "@/services/permissionsApi";

import getConfig from "@/libs/getConfig";
import AppError, { AppErrorKind } from "@/libs/exceptions";
import ErrorBoundary from "@/components/ErrorBoundary";


const appName = getConfig("appName")


function ListAuditLogsWrapper() {
  const isAllowedReadAuditLog = usePermission({
    key: PermissionKey.AuditLog,
    actions: "read",
    queryFn: getAuditLogsPermissionsFn
  })

  if (!isAllowedReadAuditLog) throw AppError.new(AppErrorKind.AccessDeniedError)

  return <AuditLogsList />
}


export default function ListAuditLogs() {
  return (
    <>
      <Helmet>
        <title>{appName} | List Audit logs</title>
        <meta name="description" content=""></meta>
      </Helmet>

      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>Audit logs List</Typography>
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
              <Suspense>
                <ListAuditLogsWrapper />
              </Suspense>
            </ErrorBoundary>

          </Grid>
        </Grid>
      </Container>
    </>
  )
}
