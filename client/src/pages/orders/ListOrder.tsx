import { Helmet } from 'react-helmet-async'
import { PageTitle } from "@/components"
import { useNavigate } from 'react-router-dom'
import { Container, Grid, Typography } from "@mui/material"
import { usePermission } from "@/hooks"; import { MiniAccessDenied } from "@/components/MiniAccessDenied"; import { MuiButton } from "@/components/ui";
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import getConfig from "@/libs/getConfig";
import { getOrderPermissionsFn } from '@/services/permissionsApi';
import { OrdersList } from '@/components/content/orders';


const appName = getConfig("appName")

export default function ListOrder() {
  const navigate = useNavigate()

  const isAllowedReadOrder = usePermission({
    key: "order-permissions",
    actions: "read",
    queryFn: getOrderPermissionsFn
  })

  const isAllowedCreatOrder = usePermission({
    key: "order-permissions",
    actions: "create",
    queryFn: getOrderPermissionsFn
  })

  const handleNavigateCreate = () => {
    navigate("/orders/create")
  }


  return (
    <>
      <Helmet>
        <title>{appName} | List orders</title>
        <meta name="description" content=""></meta>
      </Helmet>

      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>Order List</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>

          {isAllowedCreatOrder
          ? <Grid item>
              <MuiButton
                sx={{ mt: { xs: 2, md: 0 } }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
                onClick={handleNavigateCreate}
              >Create new order</MuiButton>
            </Grid>
          : null}
          
        </Grid>
      </PageTitle>

      {isAllowedReadOrder
      ? <Container maxWidth="lg">
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item xs={12}>
              <OrdersList />
            </Grid>
          </Grid>
        </Container>
      : <MiniAccessDenied />}
      
    </>
  )
}
