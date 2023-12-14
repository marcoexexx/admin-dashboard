import { PageTitle } from "@/components"
import { Container, Grid, Typography } from "@mui/material"
import { ProductsList } from "@/components/content/products";
import { usePermission } from "@/hooks";
import { getProductPermissionsFn } from "@/services/permissionsApi";
import { MiniAccessDenied } from "@/components/MiniAccessDenied";
import { MuiButton } from "@/components/ui";
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useNavigate } from "react-router-dom";


export default function ListProduct() {
  const navigate = useNavigate()

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

  const handleNavigateCreate = (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/products/create")
  }


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
              <MuiButton
                sx={{ mt: { xs: 2, md: 0 } }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
                onClick={handleNavigateCreate}
              >Create new product</MuiButton>
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
      : <MiniAccessDenied />}
    </>
  )
}
