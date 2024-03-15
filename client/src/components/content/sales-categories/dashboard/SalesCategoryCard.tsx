import { AddDashboardCard, DashboardCard, SuspenseLoader } from "@/components";
import { MuiButton } from "@/components/ui";
import { usePermission, useStore } from "@/hooks";
import { useGetSalesCategories } from "@/hooks/salsCategory";
import { OperationAction, Resource, SalesCategory } from "@/services/types";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { INITIAL_PAGINATION } from "@/context/store";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";

export function SalesCategoryCard() {
  const { state: { salesCategoryFilter } } = useStore();

  const navigate = useNavigate();

  const { try_data, isLoading } = useGetSalesCategories({
    filter: salesCategoryFilter.where,
    pagination: salesCategoryFilter.pagination || INITIAL_PAGINATION,
  });
  const sales = try_data.ok_or_throw()?.results;

  const isAllowedCreateSalesCategory = usePermission({
    action: OperationAction.Create,
    resource: Resource.SalesCategory,
  }).is_ok();

  const handleCreateNewSalesCategory = (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/sales-categories/create");
  };

  if (isLoading || !sales) return <SuspenseLoader />;

  const firstSalesCategory: SalesCategory | undefined = sales[0];
  const secondSalesCategory = isAllowedCreateSalesCategory
    ? null
    : sales[1];

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pb: 3 }}
      >
        <Typography variant="h3">Sales Categories</Typography>
        {isAllowedCreateSalesCategory
          ? (
            <MuiButton
              size="small"
              variant="outlined"
              startIcon={<AddTwoToneIcon fontSize="small" />}
              onClick={handleCreateNewSalesCategory}
            >
              Add new sales category
            </MuiButton>
          )
          : null}
      </Box>

      <Grid container spacing={3}>
        {firstSalesCategory
          ? (
            <Grid xs={12} sm={6} item>
              <Card sx={{ px: 1 }}>
                <CardContent>
                  <DashboardCard
                    subtitle="SALES"
                    value={firstSalesCategory.name}
                    isDown={false}
                    percent="12%"
                    helperText="Since last month"
                  />
                </CardContent>
              </Card>
            </Grid>
          )
          : null}

        <Grid xs={12} sm={6} item>
          {secondSalesCategory
            ? (
              <Card sx={{ px: 1 }}>
                <CardContent>
                  <DashboardCard
                    subtitle="SALES"
                    value={secondSalesCategory.name}
                    isDown={false}
                    percent="12%"
                    helperText="Since last month"
                  />
                </CardContent>
              </Card>
            )
            : isAllowedCreateSalesCategory
            ? (
              <AddDashboardCard
                onClickAdd={() => navigate("/sales-categories/create")}
              />
            )
            : null}
        </Grid>
      </Grid>
    </>
  );
}
