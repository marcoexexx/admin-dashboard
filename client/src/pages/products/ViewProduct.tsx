import { PageTitle } from "@/components"
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Container, Grid, IconButton, Tooltip, Typography } from "@mui/material"
import { usePermission } from "@/hooks";
import { getProductPermissionsFn } from "@/services/permissionsApi";
import { MiniAccessDenied } from "@/components/MiniAccessDenied";
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import { ProductDetail } from "@/components/content/products/detail";

export default function ViewProduct() {
  const { productId } = useParams()

  const navigate = useNavigate()

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

  const handleBack = (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate(-1)
  }
  

  return (
    <>
      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Tooltip arrow placeholder="top" title="go back">
              <IconButton color="primary" sx={{ p: 2, mr: 2 }} onClick={handleBack}>
                <ArrowBackTwoToneIcon />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>Products Detail</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>

          {isAllowedUpdateProduct
          ? <Grid item>
              <Button
                sx={{ mt: { xs: 2, md: 0 } }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
                component={Link}
                to={"/products/update/" + productId}
              >Update product</Button>
            </Grid>
          : null}
        </Grid>
      </PageTitle>

      {isAllowedReadProduct
      ? <Container maxWidth="lg">
          <ProductDetail productId={productId} />
        </Container>
      : <MiniAccessDenied />}
    </>
  )
}
