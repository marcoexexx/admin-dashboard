import getConfig from "@/libs/getConfig";
import { Helmet } from 'react-helmet-async'
import { PageTitle } from "@/components"
import { Container, Grid, Typography } from "@mui/material"
import { MiniAccessDenied } from "@/components/MiniAccessDenied";
import { usePermission } from "@/hooks";
import { getPickupAddressPermissionsFn } from "@/services/permissionsApi";
import { PickupAddressList } from "@/components/content/pickupAddressHistory";


const appName = getConfig("appName")

export default function ListPickupHistory() {
  const isAllowedReadPickupAddress = usePermission({
    key: "pickup-address-permissions",
    actions: "read",
    queryFn: getPickupAddressPermissionsFn
  })


  return (
    <>
      <Helmet>
        <title>{appName} | List pickup address history</title>
        <meta name="description" content=""></meta>
      </Helmet>

      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>Pickup address history</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>
        </Grid>
      </PageTitle>

      {isAllowedReadPickupAddress
      ?  <Container maxWidth="lg">
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item xs={12}>
              <PickupAddressList />
            </Grid>
          </Grid>
        </Container>
      : <MiniAccessDenied />}
    </>
  )
}
