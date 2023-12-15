import { PageTitle } from "@/components";
import { UpdateProductForm } from "@/components/content/products/forms";
import { Card, CardContent, Container, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom'
import { usePermission } from "@/hooks";
import { getProductPermissionsFn } from "@/services/permissionsApi";
import { MiniAccessDenied } from "@/components/MiniAccessDenied";
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';

export default function UpdateBrand() {
  const navigate = useNavigate()

  const isAllowedUpdateProduct = usePermission({
    key: "product-permissions",
    actions: "update",
    queryFn: getProductPermissionsFn
  })

  const handleBack = () => {
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

          <Grid item xs={10}>
            <Typography variant="h3" component="h3" gutterBottom>Update a product</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>
        </Grid>
      </PageTitle>

      {isAllowedUpdateProduct
      ? <Container maxWidth="lg">
          {/* <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}> */}
          {/*   <Grid item xs={12} md={4}> */}
          {/*     <Card> */}
          {/*       <CardContent> */}
          {/*         <UploadProductImage /> */}
          {/*       </CardContent> */}
          {/*     </Card> */}
          {/*   </Grid> */}

          <Card>
            <CardContent>
              <UpdateProductForm />
            </CardContent>
          </Card>
        </Container>
      : <MiniAccessDenied />}
      
    </>
  )
}



