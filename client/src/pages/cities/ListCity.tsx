import { Helmet } from 'react-helmet-async'
import { PageTitle } from "@/components"
import { useNavigate } from 'react-router-dom'
import { Container, Grid, Typography } from "@mui/material"
import { usePermission } from "@/hooks";
import { MiniAccessDenied } from "@/components/MiniAccessDenied";
import { MuiButton } from "@/components/ui";

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import getConfig from "@/libs/getConfig";
import { getCityPermissionsFn } from '@/services/permissionsApi';
import { CitiesList } from '@/components/content/cities';


const appName = getConfig("appName")

export default function ListBrand() {
  const navigate = useNavigate()

  const isAllowedReadCity = usePermission({
    key: "city-permissions",
    actions: "read",
    queryFn: getCityPermissionsFn
  })

  const isAllowedCreateCity = usePermission({
    key: "city-permissions",
    actions: "create",
    queryFn: getCityPermissionsFn
  })

  const handleNavigateCreate = (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/cities/create")
  }


  return (
    <>
      <Helmet>
        <title>{appName} | List Cities</title>
        <meta name="description" content=""></meta>
      </Helmet>

      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>Cities List</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>

          {isAllowedCreateCity
          ? <Grid item>
              <MuiButton
                sx={{ mt: { xs: 2, md: 0 } }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
                onClick={handleNavigateCreate}
              >Create new city</MuiButton>
            </Grid>
          : null}
        </Grid>
      </PageTitle>

      {isAllowedReadCity
      ?  <Container maxWidth="lg">
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item xs={12}>
              <CitiesList />
            </Grid>
          </Grid>
        </Container>
      : <MiniAccessDenied />}
    </>
  )
}
