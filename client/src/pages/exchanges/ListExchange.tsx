import { PageTitle } from "@/components"
import { useNavigate } from 'react-router-dom'
import { Container, Grid, Typography } from "@mui/material"
import { ExchangesList } from "@/components/content/exchanges";
import { usePermission } from "@/hooks";
import { getExchangePermissionsFn } from "@/services/permissionsApi";
import { MiniAccessDenied } from "@/components/MiniAccessDenied";
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { MuiButton } from "@/components/ui";


export default function ListExchange() {
  const navigate = useNavigate()

  const isAllowedReadExchange = usePermission({
    key: "exchange-permissions",
    actions: "read",
    queryFn: getExchangePermissionsFn
  })

  const isAllowedCreateExchange = usePermission({
    key: "exchange-permissions",
    actions: "create",
    queryFn: getExchangePermissionsFn
  })

  const handleNavigateCreate = (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/exchanges/create")
  }


  return (
    <>
      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>Exchanges List</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>

          {isAllowedCreateExchange
          ? <Grid item>
              <MuiButton
                sx={{ mt: { xs: 2, md: 0 } }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
                onClick={handleNavigateCreate}
              >Create new exchange</MuiButton>
            </Grid>
          : null }
          
        </Grid>
      </PageTitle>

      {isAllowedReadExchange
      ? <Container maxWidth="lg">
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item xs={12}>
              <ExchangesList />
            </Grid>
          </Grid>
        </Container>
      : <MiniAccessDenied />}
      
    </>
  )
}
