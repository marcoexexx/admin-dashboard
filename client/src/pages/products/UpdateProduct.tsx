import { Helmet } from 'react-helmet-async'
import { PageTitle } from "@/components";
import { UpdateProductForm } from "@/components/content/products/forms";
import { Card, CardContent, Container, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { MiniAccessDenied } from "@/components/MiniAccessDenied";
import { useNavigate } from 'react-router-dom'
import { usePermission } from "@/hooks";
import { getProductPermissionsFn } from "@/services/permissionsApi";

import getConfig from "@/libs/getConfig";
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import ErrorBoundary from '@/components/ErrorBoundary';


const appName = getConfig("appName")

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
      <Helmet>
        <title>{appName} | Update product</title>
        <meta name="description" content="Effortlessly refine and update your products with our user-friendly platform. Seamlessly edit details, pricing, and more for optimal presentation. Take control of your product catalog, ensuring it stays current and engaging. Simplify the update process with our intuitive tools. Explore now for hassle-free product management."></meta>
      </Helmet>

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
          <ErrorBoundary>
            <Card>
              <CardContent>
                <UpdateProductForm />
              </CardContent>
            </Card>
          </ErrorBoundary>
        </Container>
      : <MiniAccessDenied />}
      
    </>
  )
}



