import { PageTitle } from "@/components"
import { Link } from 'react-router-dom'
import { Button, Container, Grid, Typography } from "@mui/material"
import { usePermission } from "@/hooks";
import { getCategoryPermissionsFn } from "@/services/permissionsApi";
import { CategoriesList } from "@/components/content/categories";
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

export default function ListCategory() {
  const isAllowedCreateCategory = usePermission({
    key: "category-permissions",
    actions: "create",
    queryFn: getCategoryPermissionsFn
  })

  const isAllowedReadCategory = usePermission({
    key: "category-permissions",
    actions: "read",
    queryFn: getCategoryPermissionsFn
  })

  return (
    <>
      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>Category List</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>

          {isAllowedCreateCategory
          ? <Grid item>
              <Button
                sx={{ mt: { xs: 2, md: 0 } }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
                component={Link}
                to="/categories/create"
              >Create new category</Button>
            </Grid>
          : null}
          
        </Grid>
      </PageTitle>

      {isAllowedReadCategory
      ? <Container maxWidth="lg">
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item xs={12}>
              <CategoriesList />
            </Grid>
          </Grid>
        </Container>
      : null}
      
    </>
  )
}
