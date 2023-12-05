import { PageTitle } from "@/components"
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Link } from 'react-router-dom'
import { Button, Container, Grid, Typography } from "@mui/material"
import { ProductsList } from "@/components/content/products";
import { usePermission } from "@/hooks";
import { getProductPermissionsFn } from "@/services/permissionsApi";

export default function ListProduct() {
  const isAllowedCreateProduct = usePermission({
    key: "product-permissions",
    actions: "create",
    queryFn: getProductPermissionsFn
  })

  const isAllowedReadProduct = usePermission({
    key: "product-permissions",
    actions: "read",
    queryFn: getProductPermissionsFn
  })

  return (
    <>
      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>Products List</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>

          {isAllowedCreateProduct
          ? <Grid item>
              <Button
                sx={{ mt: { xs: 2, md: 0 } }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
                component={Link}
                to="/products/create"
              >Create new product</Button>
            </Grid>
          : null}
        </Grid>
      </PageTitle>

      {isAllowedReadProduct
      ? <Container maxWidth="lg">
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item xs={12}>
              <ProductsList />
            </Grid>
          </Grid>
        </Container>
      : null}
    </>
  )
}
