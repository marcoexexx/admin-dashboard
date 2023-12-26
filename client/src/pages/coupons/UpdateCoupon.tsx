import { Helmet } from 'react-helmet-async'
import { PageTitle } from "@/components";
import { MiniAccessDenied } from "@/components/MiniAccessDenied";
import { usePermission } from "@/hooks";
import { getCouponsPermissionsFn } from "@/services/permissionsApi";
import { Card, CardContent, Container, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom'
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import getConfig from "@/libs/getConfig";
import { UpdateCouponForm } from '@/components/content/coupons/forms';


const appName = getConfig("appName")

export default function UpdateCoupon() {
  const navigate = useNavigate()

  const isAllowedUpdateCoupon = usePermission({
    key: "coupons-permissions",
    actions: "update",
    queryFn: getCouponsPermissionsFn
  })
  
  const handleBack = () => {
    navigate(-1)
  }


  return (
    <>
      <Helmet>
        <title>{appName} | Update coupon</title>
        <meta name="description" content="Refine and secure your cryptocurrency coupon effortlessly. Edit features and settings seamlessly for optimal performance. Keep your exchange innovative with hassle-free updates. Elevate the trading experience for your users."></meta>
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
            <Typography variant="h3" component="h3" gutterBottom>Update a coupon</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>
        </Grid>
      </PageTitle>

      {isAllowedUpdateCoupon
      ? <Container maxWidth="lg">
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <UpdateCouponForm />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      : <MiniAccessDenied />}
    </>
  )
}


