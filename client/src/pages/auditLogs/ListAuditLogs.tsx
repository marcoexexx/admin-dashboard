import getConfig from "@/libs/getConfig";
import { Helmet } from 'react-helmet-async'
import { PageTitle } from "@/components"
import { Container, Grid, Typography } from "@mui/material"
import { MiniAccessDenied } from "@/components/MiniAccessDenied";
import { AuditLogsList } from "@/components/content/auditLogs";
import { usePermission } from "@/hooks";
import { getAuditLogsPermissionsFn } from "@/services/permissionsApi";


const appName = getConfig("appName")

export default function ListAuditLogs() {
  const isAllowedReadAuditLog = usePermission({
    key: "audit-logs-permissions",
    actions: "read",
    queryFn: getAuditLogsPermissionsFn
  })


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

      {isAllowedReadAuditLog
      ?  <Container maxWidth="lg">
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item xs={12}>
              <AuditLogsList />
            </Grid>
          </Grid>
        </Container>
      : <MiniAccessDenied />}
    </>
  )
}
