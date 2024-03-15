import { SuspenseLoader } from "@/components";
import { FormModal } from "@/components/forms";
import { MuiButton } from "@/components/ui";
import { useStore } from "@/hooks";
import { useDeleteProductSalesCategory } from "@/hooks/salsCategory";
import { useGetProductSalesCategories } from "@/hooks/salsCategory/useGetProductSalesCategories";
import { ProductSalesCategoriesResponse } from "@/services/types";
import { Box, Card, CardContent, CardHeader, Container, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { CreateProductSalesCategoryForm, CreateSalesCategoryForm } from "../../sales-categories/forms";
import { ProductSalesCategoryCard } from "./ProductSalesCategoryCard";

interface ProductSalesTabProps {
  productId: string;
}

export default function ProductSalesTab(props: ProductSalesTabProps) {
  const { productId } = props;

  const { state: { modalForm }, dispatch } = useStore();

  const [selectedProductSale, setSelectedProductSale] = useState<ProductSalesCategoriesResponse | undefined>(undefined);
  const [toDeleteProductSale, setToDeleteProductSale] = useState<string | undefined>(undefined);

  const { try_data, isLoading } = useGetProductSalesCategories({ productId });
  const { mutate: deleteProductSale, isPending } = useDeleteProductSalesCategory();

  const sales = try_data.ok_or_throw();

  const handleOnSelect = (value: ProductSalesCategoriesResponse) => {
    setSelectedProductSale(value);
  };

  const handleOnDelete = (id: string) => {
    setToDeleteProductSale(id);
    dispatch({
      type: "OPEN_MODAL_FORM",
      payload: "delete-product-sales-category",
    });
  };

  const handleSetDefaultValues = (value: ProductSalesCategoriesResponse | undefined) => {
    setSelectedProductSale(value);
  };

  if (!sales || isLoading) return <SuspenseLoader />;

  return (
    <Container maxWidth="lg">
      <Grid container spacing={1} gap={5}>
        <Grid item xs={12}>
          <ProductSalesCategoryCard productSales={sales} onSelect={handleOnSelect} onDelete={handleOnDelete} />
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title="Active sale" />
            <CardContent>
              <CreateProductSalesCategoryForm
                productId={productId}
                defaultValues={selectedProductSale}
                setDefaultValues={handleSetDefaultValues}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {modalForm.field === "create-sales-category"
        ? (
          <FormModal field="create-sales-category" title="Create new sale">
            <CreateSalesCategoryForm />
          </FormModal>
        )
        : null}

      {modalForm.field === "delete-product-sales-category" && toDeleteProductSale
        ? (
          <FormModal
            field="delete-product-sales-category"
            title="Delete product sale"
          >
            <Box display="flex" flexDirection="column" gap={1}>
              <Box>
                <Typography>Are you sure want to delete</Typography>
              </Box>
              <Box display="flex" flexDirection="row" gap={1}>
                <MuiButton
                  variant="contained"
                  color="error"
                  onClick={() => {
                    deleteProductSale({ productId, productSaleCategoryId: toDeleteProductSale });
                    dispatch({ type: "CLOSE_ALL_MODAL_FORM" });
                  }}
                  loading={isPending}
                >
                  Delete
                </MuiButton>

                <MuiButton
                  variant="outlined"
                  onClick={() => dispatch({ type: "CLOSE_ALL_MODAL_FORM" })}
                >
                  Cancel
                </MuiButton>
              </Box>
            </Box>
          </FormModal>
        )
        : null}
    </Container>
  );
}
