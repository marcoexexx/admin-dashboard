import { PageTitle } from "@/components"
import { Container, Grid, Typography } from "@mui/material"
import { UsersList } from "@/components/content/users";
import { usePermission } from "@/hooks";
import { getUserPermissionsFn } from "@/services/permissionsApi";
import { MiniAccessDenied } from "@/components/MiniAccessDenied";

export default function ListUser() {
  const isAllowedReadUser = usePermission({
    key: "user-permissions",
    actions: "read",
    queryFn: getUserPermissionsFn
  })

  return (
    <>
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

      {isAllowedReadUser
      ? <Container maxWidth="lg">
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item xs={12}>
              <UsersList />
            </Grid>
          </Grid>
        </Container>
      : <MiniAccessDenied />}
    </>
  )
}
