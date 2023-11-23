import { PageTitle, queryClient } from "@/components"
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Link } from 'react-router-dom'
import { Button, Container, Grid, Typography } from "@mui/material"
import { getSalesCategoriesFn } from "@/services/salesCategoryApi";

export async function salesCategoryLoader() {
  return await queryClient.fetchQuery({
    queryKey: ["sales-categories"],
    queryFn: args => getSalesCategoriesFn(args, { filter: {} }),
  })
}


export default function ListSalesCategory() {
  return (
    <>
      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>Sale category List</Typography>
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
              to="/sales-categories/create"
            >Create new sale category</Button>
          </Grid>
        </Grid>
      </PageTitle>

      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>
            {/* <ProductsList /> */}
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
