import { PageTitle } from "@/components"
import { useNavigate } from 'react-router-dom'
import { Container, Grid, Typography } from "@mui/material"
import { usePermission } from "@/hooks";
import { getSalesCategoryPermissionsFn } from "@/services/permissionsApi";
import { MiniAccessDenied } from "@/components/MiniAccessDenied";
import { SalesCategoriesList } from "@/components/content/sales-categories";
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { MuiButton } from "@/components/ui";

export default function ListSalesCategory() {
  const navigate = useNavigate()

  const isAllowedReadSalesCategory = usePermission({
    key: "sales-categor-permissions",
    actions: "read",
    queryFn: getSalesCategoryPermissionsFn
  })

  const isAllowedCreateSalesCategory = usePermission({
    key: "sales-categor-permissions",
    actions: "create",
    queryFn: getSalesCategoryPermissionsFn
  })

  const handleNavigateCreate = () => {
    navigate("/sales-categories/create")
  }


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

          {isAllowedCreateSalesCategory
          ? <Grid item>
              <MuiButton
                sx={{ mt: { xs: 2, md: 0 } }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
                onClick={handleNavigateCreate}
              >Create new sale category</MuiButton>
            </Grid>
          : null}
          
        </Grid>
      </PageTitle>

      {isAllowedReadSalesCategory
      ? <Container maxWidth="lg">
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item xs={12}>
              <SalesCategoriesList />
            </Grid>
          </Grid>
        </Container>
      : <MiniAccessDenied />}
      
    </>
  )
}
