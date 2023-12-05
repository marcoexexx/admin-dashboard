import { PageTitle } from "@/components";
import { CreateCategoryForm } from "@/components/content/categories/forms";
import { Card, CardContent, Container, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { Link } from 'react-router-dom'
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import { usePermission } from "@/hooks";
import { getCategoryPermissionsFn } from "@/services/permissionsApi";

export default function CreateCategory() {
  const isAllowedCreateCategory = usePermission({
    key: "category-permissions",
    actions: "create",
    queryFn: getCategoryPermissionsFn
  })

  return (
    <>
      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Tooltip arrow placeholder="top" title="go back">
              <IconButton color="primary" sx={{ p: 2, mr: 2 }} component={Link} to="/categories">
                <ArrowBackTwoToneIcon />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid item xs={10}>
            <Typography variant="h3" component="h3" gutterBottom>Create a new category</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>
        </Grid>
      </PageTitle>

      {isAllowedCreateCategory
      ? <Container maxWidth="lg">
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            {/* <Grid item xs={12} md={4}> */}
            {/*   <Card> */}
            {/*     <CardContent> */}
            {/*       <UploadProductImage /> */}
            {/*     </CardContent> */}
            {/*   </Card> */}
            {/* </Grid> */}

            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <CreateCategoryForm />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      : null}
      
    </>
  )
}
