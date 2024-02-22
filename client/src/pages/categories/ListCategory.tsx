import { Suspense } from 'react';
import { OperationAction, Resource } from '@/services/types';
import { Helmet } from 'react-helmet-async'
import { PageTitle } from "@/components"
import { Container, Grid, Typography } from "@mui/material"
import { CategoriesList } from "@/components/content/categories";
import { MuiButton } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { usePermission } from "@/hooks";

import getConfig from "@/libs/getConfig";
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import ErrorBoundary from '@/components/ErrorBoundary';


const appName = getConfig("appName")


function ListCategoryWrapper() {
  usePermission({ action: OperationAction.Read, resource: Resource.Category }).ok_or_throw()

  return <CategoriesList />

}


export default function ListCategory() {
  const navigate = useNavigate()

  const isAllowedCreateCategory = usePermission({
    action: OperationAction.Create,
    resource: Resource.Category
  }).is_ok()

  const handleNavigateCreate = (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/categories/create")
  }


  return (
    <>
      <Helmet>
        <title>{appName} | List categories</title>
        <meta name="description" content="Explore a curated collection of product categories designed to enhance your online shopping experience. Browse through a diverse range of categories that cater to your interests and preferences. Discover a seamless organization of products, making it easy to find what you're looking for. From fashion to electronics, our list of categories provides a comprehensive overview, allowing you to navigate effortlessly and discover"></meta>
      </Helmet>

      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>Category List</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>

          {isAllowedCreateCategory
          ? <Grid item>
              <MuiButton
                sx={{ mt: { xs: 2, md: 0 } }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
                onClick={handleNavigateCreate}
              >Create new category</MuiButton>
            </Grid>
          : null}
          
        </Grid>
      </PageTitle>

      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>

            <ErrorBoundary>
              <Suspense>
                <ListCategoryWrapper />
              </Suspense>
            </ErrorBoundary>

          </Grid>
        </Grid>
      </Container>
      
    </>
  )
}
