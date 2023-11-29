import { PageTitle } from "@/components"
import { Link } from 'react-router-dom'
import { Button, Container, Grid, Typography } from "@mui/material"
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { ExchangesList } from "@/components/content/exchanges";

export default function ListExchange() {
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

          <Grid item>
            <Button
              sx={{ mt: { xs: 2, md: 0 } }}
              variant="contained"
              startIcon={<AddTwoToneIcon fontSize="small" />}
              component={Link}
              to="/exchanges/create"
            >Create new exchange</Button>
          </Grid>
        </Grid>
      </PageTitle>

      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>
            <ExchangesList />
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
