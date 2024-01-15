import { Helmet } from 'react-helmet-async'
import { PageTitle } from "@/components";
import { Card, CardContent, Container, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { usePermission } from "@/hooks";
import { MiniAccessDenied } from "@/components/MiniAccessDenied";
import { useNavigate } from 'react-router-dom';
import { getOrderPermissionsFn } from '@/services/permissionsApi';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import getConfig from "@/libs/getConfig";


const appName = getConfig("appName")

export default function UpdatePotentialOrder() {
  const navigate = useNavigate()

  const isAllowedUpdateOrder = usePermission({
    key: "order-permissions",
    actions: "update",
    queryFn: getOrderPermissionsFn
  })
  
  const handleBack = () => {
    navigate(-1)
  }


  return (
    <>
      <Helmet>
        <title>{appName} | Update order</title>
        <meta name="description" content=""></meta>
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
            <Typography variant="h3" component="h3" gutterBottom>Update a order</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>
        </Grid>
      </PageTitle>

      {isAllowedUpdateOrder
      ? <Container maxWidth="lg">
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  {"<UpdateOrderForm />"}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      : <MiniAccessDenied />}
      
    </>
  )
}


