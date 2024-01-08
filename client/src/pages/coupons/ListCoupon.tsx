import { Helmet } from 'react-helmet-async'
import { PageTitle } from "@/components"
import { useNavigate } from 'react-router-dom'
import { Container, Grid, Typography } from "@mui/material"
import { usePermission } from "@/hooks";
import { getCouponsPermissionsFn } from "@/services/permissionsApi";
import { MiniAccessDenied } from "@/components/MiniAccessDenied";
import { MuiButton } from "@/components/ui";
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import getConfig from "@/libs/getConfig";
import { CouponsList } from '@/components/content/coupons';


const appName = getConfig("appName")


export default function ListCoupon() {
  const navigate = useNavigate()

  const isAllowedReadCoupons = usePermission({
    key: "coupon-permissions",
    actions: "read",
    queryFn: getCouponsPermissionsFn
  })

  const isAllowedCreateCoupons = usePermission({
    key: "coupon-permissions",
    actions: "create",
    queryFn: getCouponsPermissionsFn
  })

  const handleNavigateCreate = (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/coupons/create")
  }


  return (
    <>
      <Helmet>
        <title>{appName} | List coupons</title>
        <meta name="description" content="Launch your own exchange effortlessly with our platform. Create a secure and customizable coupon to trade digital assets. Enjoy robust features, easy management, and a seamless user experience. Start your exchange journey now and elevate your cryptocurrency trading platform with our intuitive solutions."></meta>
      </Helmet>

      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>Coupons List</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>

          {isAllowedCreateCoupons
          ? <Grid item>
              <MuiButton
                sx={{ mt: { xs: 2, md: 0 } }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
                onClick={handleNavigateCreate}
              >Create new coupon</MuiButton>
            </Grid>
          : null }
          
        </Grid>
      </PageTitle>

      {isAllowedReadCoupons
      ? <Container maxWidth="lg">
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item xs={12}>
              <CouponsList />
            </Grid>
          </Grid>
        </Container>
      : <MiniAccessDenied />}
      
    </>
  )
}
