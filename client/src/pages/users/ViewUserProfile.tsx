import { Helmet } from 'react-helmet-async'
import { PageTitle } from "@/components"
import { useNavigate, useParams } from 'react-router-dom'
import { Container, Grid, IconButton, Tooltip, Typography } from "@mui/material"
import { usePermission } from "@/hooks";
import { getProductPermissionsFn } from "@/services/permissionsApi";
import { MiniAccessDenied } from "@/components/MiniAccessDenied";
import { UserProfile } from "@/components/content/users";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import getConfig from "@/libs/getConfig";


const appName = getConfig("appName")

export default function ViewUser() {
  const { username } = useParams()

  const navigate = useNavigate()

  const isAllowedReadProduct = usePermission({
    key: "product-permissions",
    actions: "read",
    queryFn: getProductPermissionsFn
  })

  const isAllowedUpdateProduct = usePermission({
    key: "product-permissions",
    actions: "update",
    queryFn: getProductPermissionsFn
  })

  const handleBack= (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate(-1)
  }


  return (
    <>
      <Helmet>
        <title>{appName} | Change User role</title>
        <meta name="description" content={`Explore the detailed profile of User ID ${username} on our platform. Gain insights into user information, activity, and preferences. Enhance user engagement and personalize interactions seamlessly. Dive into a comprehensive view of user profiles for a more tailored and user-centric experience.`}></meta>
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

          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>User profile</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>

          {isAllowedUpdateProduct
          ? <p>change role...</p>
          : null}

        </Grid>
      </PageTitle>

      {isAllowedReadProduct
      ? <Container maxWidth="lg">
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item xs={12}>
              <UserProfile username={username} />
            </Grid>
          </Grid>
        </Container>
      : <MiniAccessDenied />}
    </>
  )
}

