import { Helmet } from 'react-helmet-async'
import { PageTitle } from "@/components"
import { useNavigate } from 'react-router-dom'
import { Container, Grid, Typography } from "@mui/material"
import { BrandsList } from "@/components/content/brands";
import { usePermission } from "@/hooks";
import { getBrandPermissionsFn } from "@/services/permissionsApi";
import { MiniAccessDenied } from "@/components/MiniAccessDenied";
import { MuiButton } from "@/components/ui";
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import getConfig from "@/libs/getConfig";


const appName = getConfig("appName")

export default function ListBrand() {
  const navigate = useNavigate()

  const isAllowedReadBrand = usePermission({
    key: "brand-permissions",
    actions: "read",
    queryFn: getBrandPermissionsFn
  })

  const isAllowedCreateBrand = usePermission({
    key: "brand-permissions",
    actions: "create",
    queryFn: getBrandPermissionsFn
  })

  const handleNavigateCreate = (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/brands/create")
  }


  return (
    <>
      <Helmet>
        <title>{appName} | List brands</title>
        <meta name="description" content="Effortlessly manage and organize your product brands with our intuitive CRUD table list. Create, update, and delete brands seamlessly, ensuring your brand portfolio is always up-to-date. Explore a user-friendly interface that simplifies brand management, making it easy to add new brands, edit existing information, and remove outdated entries. Optimize your business operations and maintain a well-organized brand catalog. Experience the convenience of our CRUD table list for brands."></meta>
      </Helmet>

      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>Brands List</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>

          {isAllowedCreateBrand
          ? <Grid item>
              <MuiButton
                sx={{ mt: { xs: 2, md: 0 } }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
                onClick={handleNavigateCreate}
              >Create new brand</MuiButton>
            </Grid>
          : null}
        </Grid>
      </PageTitle>

      {isAllowedReadBrand
      ?  <Container maxWidth="lg">
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item xs={12}>
              <BrandsList />
            </Grid>
          </Grid>
        </Container>
      : <MiniAccessDenied />}
    </>
  )
}
