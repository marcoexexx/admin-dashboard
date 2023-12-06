import { PageTitle } from "@/components"
import { useParams } from 'react-router-dom'
import { Container, Grid, Typography } from "@mui/material"
import { usePermission } from "@/hooks";
import { getProductPermissionsFn } from "@/services/permissionsApi";
import { MiniAccessDenied } from "@/components/MiniAccessDenied";
import { UserProfile } from "@/components/content/users";

export default function ViewUser() {
  const { username } = useParams()

  const isAllowedReadProduct = usePermission({
    key: "product-permissions",
    actions: "read",
    queryFn: getProductPermissionsFn
  })

  const isAllowedUpdateProduct = usePermission({
    key: "product-permissions",
    actions: "update",
    queryFn: getProductPermissionsFn
  })

  return (
    <>
      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>User profile</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>

          {isAllowedUpdateProduct
          ? <p>change role...</p>
          : null}

        </Grid>
      </PageTitle>

      {isAllowedReadProduct
      ? <Container maxWidth="lg">
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item xs={12}>
              <UserProfile username={username} />
            </Grid>
          </Grid>
        </Container>
      : <MiniAccessDenied />}
    </>
  )
}

