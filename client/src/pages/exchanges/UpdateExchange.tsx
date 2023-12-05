import { PageTitle } from "@/components";
import { MiniAccessDenied } from "@/components/MiniAccessDenied";
import { UpdateExchangeForm } from "@/components/content/exchanges/forms";
import { usePermission } from "@/hooks";
import { getExchangePermissionsFn } from "@/services/permissionsApi";
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import { Card, CardContent, Container, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { Link } from 'react-router-dom'

export default function UpdateExchange() {
  const isAllowedUpdateExchange = usePermission({
    key: "exchange-permissions",
    actions: "update",
    queryFn: getExchangePermissionsFn
  })

  return (
    <>
      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Tooltip arrow placeholder="top" title="go back">
              <IconButton color="primary" sx={{ p: 2, mr: 2 }} component={Link} to="/exchanges">
                <ArrowBackTwoToneIcon />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid item xs={10}>
            <Typography variant="h3" component="h3" gutterBottom>Update a exchange</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>
        </Grid>
      </PageTitle>

      {isAllowedUpdateExchange
      ? <Container maxWidth="lg">
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <UpdateExchangeForm />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      : <MiniAccessDenied />}
      
    </>
  )
}


