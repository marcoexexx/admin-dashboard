import { SuspenseLoader, queryClient } from "@/components"
import { useStore } from "@/hooks"
import { deleteProductSaleCategory, getProductSaleCategories } from "@/services/productsApi"
import { Box, Card, CardContent, CardHeader, Container, Grid, Typography } from "@mui/material"
import { useMutation, useQuery } from "@tanstack/react-query"
import { ProductSalesCategoryCard } from "./ProductSalesCategoryCard"
import { CreateProductSalesCategoryForm, CreateSalesCategoryForm } from "../../sales-categories/forms"
import { FormModal } from "@/components/forms"
import { useState } from "react"
import { ProductSalesCategoriesResponse } from "@/services/types"
import { MuiButton } from "@/components/ui"
import { playSoundEffect } from "@/libs/playSound"


interface ProductSalesTabProps {
  productId: string
}

export default function ProductSalesTab(props: ProductSalesTabProps) {
  const { productId } = props

  const { state: {modalForm}, dispatch } = useStore()

  const [selectedProductSale, setSelectedProductSale] = useState<ProductSalesCategoriesResponse|undefined>(undefined)
  const [toDeleteProductSale, setToDeleteProductSale] = useState<string|undefined>(undefined)

  const {
    data: productSales,
    isLoading: isProductSalesLoading,
    isError: isProductSalesError,
    error: productSalesError
  } = useQuery({
    enabled: !!productId,
    queryKey: ["product-sales-categories"],
    queryFn: args => getProductSaleCategories(args, { productId }),
    select: data => data?.results
  })


  const {
    mutate: deleteProductSale,
    isPending: isDeleteProductSalePending,
  } = useMutation({
    mutationFn: deleteProductSaleCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-sales-categories"]
      })
      dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: "Success delete sale",
          severity: "success"
        }
      })
      playSoundEffect("success")
    },
    onError: () => {
      dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: "Error delete sale",
          severity: "error"
        }
      })
      playSoundEffect("error")
    },
  })

  const handleOnCloseModalForm = () => {
    dispatch({ type: "CLOSE_MODAL_FORM", payload: "*" })
  }

  const handleOnSelect = (value: ProductSalesCategoriesResponse) => {
    setSelectedProductSale(value)
  }

  const handleOnDelete = (id: string) => {
    setToDeleteProductSale(id)
    dispatch({
      type: "OPEN_MODAL_FORM",
      payload: "delete-product-sale"
    })
  }

  const handleCloseModal = () => {
    dispatch({
      type: "CLOSE_ALL_MODAL_FORM"
    })
  }

  const handleSetDefaultValues = (value: ProductSalesCategoriesResponse|undefined) => {
    setSelectedProductSale(value)
  }


  if (isProductSalesError && productSalesError) return <h1>ERROR: {productSalesError.message}</h1>
  if (!productSales || isProductSalesLoading) return <SuspenseLoader />


  return (
    <Container maxWidth="lg">
      <Grid container spacing={1} gap={5}>
        <Grid item xs={12}>
          <ProductSalesCategoryCard productSales={productSales} onSelect={handleOnSelect} onDelete={handleOnDelete} />
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title="Active sale" />
            <CardContent>
              <CreateProductSalesCategoryForm productId={productId} defaultValues={selectedProductSale} setDefaultValues={handleSetDefaultValues} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {modalForm.field === "sales-categories"
      ? <FormModal field='sales-categories' title='Create new sale' onClose={handleOnCloseModalForm}>
        <CreateSalesCategoryForm />
      </FormModal>
      : null}


      {modalForm.field === "delete-product-sale" && toDeleteProductSale
      ? <FormModal
          field="delete-product-sale"
          title="Delete product sale"
          onClose={handleCloseModal}
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
                  deleteProductSale({ productId, productSaleCategoryId: toDeleteProductSale })
                  dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
                }}
                loading={isDeleteProductSalePending}
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
      : null}
    </Container>
  )
}
