import { Helmet } from 'react-helmet-async'
import { PageTitle } from "@/components"
import { useNavigate } from 'react-router-dom'
import { Container, Grid, Typography } from "@mui/material"
import { usePermission } from "@/hooks";
import { getRegionPermissionsFn } from "@/services/permissionsApi";
import { MiniAccessDenied } from "@/components/MiniAccessDenied"; import { MuiButton } from "@/components/ui"; import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import getConfig from "@/libs/getConfig";
import { RegionsList } from '@/components/content/regions';


const appName = getConfig("appName")

export default function ListRegion() {
  const navigate = useNavigate()

  const isAllowedReadRegion = usePermission({
    key: "region-permissions",
    actions: "read",
    queryFn: getRegionPermissionsFn
  })

  const isAllowedCreateRegion = usePermission({
    key: "region-permissions",
    actions: "create",
    queryFn: getRegionPermissionsFn
  })

  const handleNavigateCreate = (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/regions/create")
  }


  return (
    <>
      <Helmet>
        <title>{appName} | List regions</title>
        <meta name="description" content=""></meta>
      </Helmet>

      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>Regions List</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>

          {isAllowedCreateRegion
          ? <Grid item>
              <MuiButton
                sx={{ mt: { xs: 2, md: 0 } }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
                onClick={handleNavigateCreate}
              >Create new region</MuiButton>
            </Grid>
          : null}
        </Grid>
      </PageTitle>

      {isAllowedReadRegion
      ?  <Container maxWidth="lg">
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item xs={12}>
              <RegionsList />
            </Grid>
          </Grid>
        </Container>
      : <MiniAccessDenied />}
    </>
  )
}
