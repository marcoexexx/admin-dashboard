import { PageTitle } from "@/components";
import { MiniAccessDenied } from "@/components/MiniAccessDenied";
import { CreateSalesCategoryForm } from "@/components/content/sales-categories/forms";
import { usePermission } from "@/hooks";
import { getSalesCategoryPermissionsFn } from "@/services/permissionsApi";
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import { Card, CardContent, Container, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { Link } from 'react-router-dom'

export default function CreateProduct() {
  const isAllowedCreateSalesCategory = usePermission({
    key: "sales-categor-permissions",
    actions: "create",
    queryFn: getSalesCategoryPermissionsFn
  })

  return (
    <>
      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Tooltip arrow placeholder="top" title="go back">
              <IconButton color="primary" sx={{ p: 2, mr: 2 }} component={Link} to="/sales-categories">
                <ArrowBackTwoToneIcon />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid item xs={10}>
            <Typography variant="h3" component="h3" gutterBottom>Create a new sale category</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>
        </Grid>
      </PageTitle>

      {isAllowedCreateSalesCategory
      ? <Container maxWidth="lg">
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          {/*   <Grid item xs={12} md={4}> */}
          {/*     <Card> */}
          {/*       <CardContent> */}
          {/*         <UploadProductImage /> */}
          {/*       </CardContent> */}
          {/*     </Card> */}
          {/*   </Grid> */}

            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <CreateSalesCategoryForm />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      : <MiniAccessDenied />}
      
    </>
  )
}
