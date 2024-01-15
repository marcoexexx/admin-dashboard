import { Helmet } from 'react-helmet-async'
import { PageTitle } from "@/components"
import { useNavigate } from 'react-router-dom'
import { Container, Grid, Typography } from "@mui/material"
import { usePermission } from "@/hooks";
import { MiniAccessDenied } from "@/components/MiniAccessDenied";
import { MuiButton } from "@/components/ui";
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import getConfig from "@/libs/getConfig";
import { getPotentialOrderPermissionsFn } from '@/services/permissionsApi';
import { PotentialOrdersList } from '@/components/content/potential-orders';


const appName = getConfig("appName")

export default function ListPotentialOrder() {
  const navigate = useNavigate()

  const isAllowedReadPotentialOrder = usePermission({
    key: "potential-order-permissions",
    actions: "read",
    queryFn: getPotentialOrderPermissionsFn
  })

  const isAllowedCreatPotentialOrder = usePermission({
    key: "potential-order-permissions",
    actions: "create",
    queryFn: getPotentialOrderPermissionsFn
  })

  const handleNavigateCreate = () => {
    navigate("/potential-orders/create")
  }


  return (
    <>
      <Helmet>
        <title>{appName} | List potential orders</title>
        <meta name="description" content=""></meta>
      </Helmet>

      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>Potential Orders List</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>

          {isAllowedCreatPotentialOrder
          ? <Grid item>
              <MuiButton
                sx={{ mt: { xs: 2, md: 0 } }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
                onClick={handleNavigateCreate}
              >Create new potential order</MuiButton>
            </Grid>
          : null}
          
        </Grid>
      </PageTitle>

      {isAllowedReadPotentialOrder
      ? <Container maxWidth="lg">
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item xs={12}>
              <PotentialOrdersList />
            </Grid>
          </Grid>
        </Container>
      : <MiniAccessDenied />}
      
    </>
  )
}
