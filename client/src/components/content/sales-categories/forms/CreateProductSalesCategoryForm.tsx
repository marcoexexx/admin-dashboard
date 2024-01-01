import { Box, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { MuiButton } from "@/components/ui";
import { SalesCategoriesInputField } from "@/components/input-fields";
import { ProductSalesCategoriesResponse } from "@/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { number, object, string, z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { queryClient } from "@/components";
import { createProductSaleCategory, updateProductSaleCategoryFn } from "@/services/productsApi";
import { useEffect } from "react";


const createProductSalesCategorySchema = object({
  productId: string(),
  salesCategoryId: string(),
  discount: number().max(100).default(0)
})

export type CreateProductSalesCategoryInput = z.infer<typeof createProductSalesCategorySchema>


interface CreateProductSalesCategoryFromProps {
  productId: string
  defaultValues?: ProductSalesCategoriesResponse
  setDefaultValues: (value: ProductSalesCategoriesResponse | undefined) => void
}

export function CreateProductSalesCategoryForm(props: CreateProductSalesCategoryFromProps) {
  const { dispatch } = useStore()
  const { productId, defaultValues, setDefaultValues } = props

  const {
    mutate: createSalesCategory,
  } = useMutation({
    mutationFn: createProductSaleCategory,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success created a new sales category.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["product-sales-categories"]
      })
      setDefaultValues(undefined)
      methods.reset()
    },
    onError: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "failed created a new sales category.",
        severity: "error"
      } })
    },
  })

  const {
    mutate: updateSalesCategory,
  } = useMutation({
    mutationFn: updateProductSaleCategoryFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success updated a new sales category.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["product-sales-categories"]
      })
      setDefaultValues(undefined)
      methods.reset()
    },
    onError: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "failed updated a new sales category.",
        severity: "error"
      } })
    },
  })

  const methods = useForm<CreateProductSalesCategoryInput>({
    resolver: zodResolver(createProductSalesCategorySchema)
  })

  const { handleSubmit, register, formState: { errors }, setValue } = methods


  useEffect(() => {
    if (defaultValues) {
      setValue("salesCategoryId", defaultValues.salesCategoryId)
      setValue("discount", defaultValues.discount)
    }
  }, [defaultValues])


  const onSubmit: SubmitHandler<CreateProductSalesCategoryInput> = (value) => {
    if (!!defaultValues) updateSalesCategory({ productId, productSaleCategoryId: defaultValues.id, discount: value.discount })
    else createSalesCategory(value)
    dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
  }


  return (
    <FormProvider {...methods}>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1
      }} component="form" onSubmit={handleSubmit(onSubmit)}>
        <input readOnly hidden value={productId} {...register("productId")} />
        <SalesCategoriesInputField updateField={!!defaultValues} />
        <TextField
          fullWidth 
          {...register("discount", {
              valueAsNumber: true
          })} 
          focused={!!defaultValues}
          type="number"
          inputProps={{
            step: "0.01"
          }}
          label="Discount percent" 
          error={!!errors.discount} 
          helperText={!!errors.discount ? errors.discount.message : ""} 
        />

        <Box>
          <MuiButton variant="contained" type="submit">{!!defaultValues ? "Update" : "Create"}</MuiButton>
        </Box>
      </Box>
    </FormProvider>
  )
}
