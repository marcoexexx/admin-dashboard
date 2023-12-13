import { PageTitle } from "@/components"
import { SalesCategoryCard } from "@/components/content/sales-categories/dashboard"
import { useStore } from "@/hooks"
import { Avatar, Container, Grid, Typography, useTheme } from "@mui/material"

export default function Home() {
  const { state: {user} } = useStore()
  const theme = useTheme()


  return (
    <div>
      <PageTitle>
        {/* Page Header */}
        <Grid container alignItems="center">
          <Grid item>
            <Avatar 
              sx={{
                mr: 2,
                width: theme.spacing(8),
                height: theme.spacing(8)
              }}
              variant="rounded"
              alt={user?.name}
              src={user?.image}
            />
          </Grid>

          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>
              Welcome, {user?.name}
            </Typography>

            <Typography variant="subtitle2">
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>
        </Grid>
      </PageTitle>

      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={4}
        >
          <Grid item xs={12}>
            {/* Sale Graph */}
          </Grid>

          <Grid item lg={8} xs={12}>
            <SalesCategoryCard />
          </Grid>

          <Grid item lg={4} xs={12}>
            {/* Account info */}
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}
