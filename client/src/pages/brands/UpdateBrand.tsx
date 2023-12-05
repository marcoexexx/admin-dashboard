import { PageTitle } from "@/components";
import { UpdateBrandForm } from "@/components/content/brands/forms";
import { Card, CardContent, Container, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { Link } from 'react-router-dom'
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import { usePermission } from "@/hooks";
import { getBrandPermissionsFn } from "@/services/permissionsApi";
import { MiniAccessDenied } from "@/components/MiniAccessDenied";

export default function UpdateBrand() {
  const isAllowedUpdateBrand = usePermission({
    key: "brand-permissions",
    actions: "update",
    queryFn: getBrandPermissionsFn
  })

  return (
    <>
      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Tooltip arrow placeholder="top" title="go back">
              <IconButton color="primary" sx={{ p: 2, mr: 2 }} component={Link} to="/brands">
                <ArrowBackTwoToneIcon />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid item xs={10}>
            <Typography variant="h3" component="h3" gutterBottom>Update a brand</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>
        </Grid>
      </PageTitle>

      {isAllowedUpdateBrand
      ? <Container maxWidth="lg">
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <UpdateBrandForm />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      : <MiniAccessDenied />}
      
    </>
  )
}


