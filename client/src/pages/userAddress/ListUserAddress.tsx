import { Helmet } from 'react-helmet-async'
import { PageTitle } from "@/components"
import { useNavigate } from 'react-router-dom'
import { Container, Grid, Typography } from "@mui/material"
import { usePermission } from "@/hooks";
import { getUserAddressPermissionsFn } from "@/services/permissionsApi";
import { MiniAccessDenied } from "@/components/MiniAccessDenied";
import { MuiButton } from "@/components/ui";
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import getConfig from "@/libs/getConfig";
import { UserAddressesList } from '@/components/content/user-addresses';


const appName = getConfig("appName")

export default function ListUserAddress() {
  const navigate = useNavigate()

  const isAllowedReadUserAddress = usePermission({
    key: "address-permissions",
    actions: "read",
    queryFn: getUserAddressPermissionsFn
  })

  const isAllowedCreateUserAddress = usePermission({
    key: "address-permissions",
    actions: "create",
    queryFn: getUserAddressPermissionsFn
  })

  const handleNavigateCreate = (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/addresses/create")
  }


  return (
    <>
      <Helmet>
        <title>{appName} | List Address</title>
        <meta name="description" content=""></meta>
      </Helmet>

      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>My addresses List</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>

          {isAllowedCreateUserAddress
          ? <Grid item>
              <MuiButton
                sx={{ mt: { xs: 2, md: 0 } }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
                onClick={handleNavigateCreate}
              >Create new address</MuiButton>
            </Grid>
          : null}
        </Grid>
      </PageTitle>

      {isAllowedReadUserAddress
      ?  <Container maxWidth="lg">
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item xs={12}>
              <UserAddressesList />
            </Grid>
          </Grid>
        </Container>
      : <MiniAccessDenied />}
    </>
  )
}
