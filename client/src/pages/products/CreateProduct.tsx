import { Helmet } from 'react-helmet-async'
import { PageTitle } from "@/components";
import { MiniAccessDenied } from "@/components/MiniAccessDenied";
import { CreateProductForm } from "@/components/content/products/forms";
import { usePermission } from "@/hooks";
import { getProductPermissionsFn } from "@/services/permissionsApi";
import { Card, CardContent, Container, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom'
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import getConfig from "@/libs/getConfig";
import ErrorBoundary from '@/components/ErrorBoundary';


const appName = getConfig("appName")

export default function CreateProduct() {
  const isAllowedCreateProduct = usePermission({
    key: "product-permissions",
    actions: "create",
    queryFn: getProductPermissionsFn
  })
  
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <>
      <Helmet>
        <title>{appName} | Create a product</title>
        <meta name="description" content="Create products effortlessly with our user-friendly platform. Streamline customization and showcase your offerings seamlessly. Start crafting your unique products today."></meta>
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
            <Typography variant="h3" component="h3" gutterBottom>Create a new product</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>
        </Grid>
      </PageTitle>

      {isAllowedCreateProduct
      ? <Container maxWidth="lg">
          <Card>
            <CardContent>
              <ErrorBoundary>
                <CreateProductForm />
              </ErrorBoundary>
            </CardContent>
          </Card>
        </Container>
      : <MiniAccessDenied />}
      
    </>
  )
}
