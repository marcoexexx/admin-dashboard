import { PageTitle } from "@/components"
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Link } from 'react-router-dom'
import { Button, Container, Grid, Typography } from "@mui/material"
import { BrandsList } from "@/components/content/brands";
import { usePermission } from "@/hooks";
import { getBrandPermissionsFn } from "@/services/permissionsApi";
import { MiniAccessDenied } from "@/components/MiniAccessDenied";

export default function ListBrand() {
  const isAllowedReadBrand = usePermission({
    key: "brand-permissions",
    actions: "read",
    queryFn: getBrandPermissionsFn
  })

  const isAllowedCreateBrand = usePermission({
    key: "brand-permissions",
    actions: "create",
    queryFn: getBrandPermissionsFn
  })

  return (
    <>
      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>Brands List</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>

          {isAllowedCreateBrand
          ? <Grid item>
              <Button
                sx={{ mt: { xs: 2, md: 0 } }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
                component={Link}
                to="/brands/create"
              >Create new brand</Button>
            </Grid>
          : null}
        </Grid>
      </PageTitle>

      {isAllowedReadBrand
      ?  <Container maxWidth="lg">
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item xs={12}>
              <BrandsList />
            </Grid>
          </Grid>
        </Container>
      : <MiniAccessDenied />}
    </>
  )
}
