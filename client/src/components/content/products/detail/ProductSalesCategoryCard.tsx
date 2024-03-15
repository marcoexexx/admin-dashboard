import { DashboardCard } from "@/components";
import { MuiButton } from "@/components/ui";
import { usePermission } from "@/hooks";
import { OperationAction, ProductSalesCategoriesResponse, Resource } from "@/services/types";
import { Box, Card, CardContent, Grid, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";

interface ProductSalesCategoryCardProps {
  productSales: ProductSalesCategoriesResponse[];
  onSelect: (value: ProductSalesCategoriesResponse) => void;
  onDelete: (id: string) => void;
}

export function ProductSalesCategoryCard(props: ProductSalesCategoryCardProps) {
  const { productSales, onSelect, onDelete } = props;

  const theme = useTheme();

  const navigate = useNavigate();

  const isAllowedCreateSalesCategory = usePermission({
    action: OperationAction.Create,
    resource: Resource.SalesCategory,
  }).is_ok();

  const handleCreateNewSalesCategory = (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/sales-categories/create");
  };

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
        {productSales.map((sale, idx) => (
          <Grid key={idx} xs={12} sm={4} item>
            <Card sx={{ px: 1 }}>
              <CardContent>
                <DashboardCard
                  subtitle="SALES"
                  value={sale.salesCategory.name}
                  isDown={true}
                  percent={`${sale.discount}%`}
                  helperText="discount"
                  actions={
                    <>
                      <Typography
                        onClick={() => onDelete(sale.id)}
                        sx={{
                          cursor: "pointer",
                          color: theme.colors.error.light,
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        delete
                      </Typography>
                      <Typography
                        onClick={() => onSelect(sale)}
                        sx={{
                          cursor: "pointer",
                          color: theme.colors.primary.light,
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        edit
                      </Typography>
                    </>
                  }
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
