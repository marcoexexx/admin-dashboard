import { Helmet } from 'react-helmet-async'
import { PageTitle } from "@/components"
import { Container, Grid, Typography } from "@mui/material"
import { usePermission } from "@/hooks";
import { getAccessLogsPermissionsFn } from "@/services/permissionsApi";
import { MiniAccessDenied } from "@/components/MiniAccessDenied";
import getConfig from "@/libs/getConfig";
import { AccessLogsList } from '@/components/content/accessLogs';


const appName = getConfig("appName")

export default function ListAccessLogs() {
  const isAllowedReadAccessLog = usePermission({
    key: "access-log-permissions",
    actions: "read",
    queryFn: getAccessLogsPermissionsFn
  })


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

      {isAllowedReadAccessLog
      ?  <Container maxWidth="lg">
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item xs={12}>
              <AccessLogsList />
            </Grid>
          </Grid>
        </Container>
      : <MiniAccessDenied />}
    </>
  )
}
