import { PageTitle } from "@/components";
import { Card, CardContent, Container, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { Link } from 'react-router-dom'
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import { usePermission } from "@/hooks";
import { getCategoryPermissionsFn } from "@/services/permissionsApi";
import { UpdateCategoryForm } from "@/components/content/categories/forms";
import { MiniAccessDenied } from "@/components/MiniAccessDenied";

export default function UpdateCategory() {
  const isAllowedUpdateCategory = usePermission({
    key: "category-permissions",
    actions: "update",
    queryFn: getCategoryPermissionsFn
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

      {isAllowedUpdateCategory
      ? <Container maxWidth="lg">
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <UpdateCategoryForm />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      : <MiniAccessDenied />}
      
    </>
  )
}



