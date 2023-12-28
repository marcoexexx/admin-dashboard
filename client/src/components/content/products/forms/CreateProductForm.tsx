import { Box, FormControlLabel, Grid, InputAdornment, MenuItem, OutlinedInput, Switch, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { MuiButton } from "@/components/ui";
import { FormModal } from "@/components/forms";
import { CreateBrandForm } from "../../brands/forms";
import { CreateCategoryForm } from "../../categories/forms";
import { CreateSalesCategoryForm } from "../../sales-categories/forms";
import { BrandInputField, CatgoryMultiInputField, EditorInputField, SalesCategoryMultiInputField, SpecificationInputField } from "@/components/input-fields";
import { zodResolver } from "@hookform/resolvers/zod";
import { boolean, number, object, string, z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createProductFn } from "@/services/productsApi";
import { useStore } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { queryClient } from "@/components";
import { getExchangesFn } from "@/services/exchangesApi";
import { useEffect } from "react";


export const productStockStatus = ["Available", "OutOfStock", "AskForStock", "Discontinued"] as const
export const productStatus = ["Draft", "Pending", "Published"] as const
export const priceUnit = ["MMK", "USD", "SGD", "THB", "KRW"] as const

export type ProductStockStatus = typeof productStockStatus[number]
export type ProductStatus = typeof productStatus[number]
export type PriceUnit = typeof priceUnit[number]


const createProductSchema = object({
  price: number({ required_error: "Price is required "}),
  brandId: string({ required_error: "Brand is required" })
    .min(2).max(128),
  title: string({ required_error: "Brand is required" })
    .min(2).max(128),
  specification: object({
    name: string({ required_error: "Specification name is required" }),
    value: string({ required_error: "Specification value is required" }),
  }).array(),
  overview: string({ required_error: "Brand is required" })
    .min(2).max(5000),
  categories: string().array().default([]),
  instockStatus: z.enum(productStockStatus).default("AskForStock"),
  description: string({ required_error: "Brand is required" })
    .min(2).max(5000),
  dealerPrice: number().min(0),
  marketPrice: number().min(0),
  priceUnit: z.enum(priceUnit).default("MMK"),
  salesCategory: string().array().default([]),
  quantity: number().min(0),
  isPending: boolean().default(false),
  status: z.enum(productStatus).default("Draft"),

  itemCode: string().nullable().optional(),
})

export type CreateProductInput = z.infer<typeof createProductSchema>

export function CreateProductForm() {
  const { state: {modalForm}, dispatch } = useStore()

  const navigate = useNavigate()
  const from = "/products"

  const {
    mutate: createProduct
  } = useMutation({
    mutationFn: createProductFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success created a new product.",
        severity: "success"
      } })
      if (modalForm.field === "*") navigate(from)
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["products"]
      })
    },
    onError: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "failed created a new product.",
        severity: "error"
      } })
    }
  })

  const methods = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema)
  })

  const { data: exchangeRate } = useQuery({
    queryKey: ["exchanges", "latest", methods.getValues("priceUnit")],
    queryFn: args => getExchangesFn(args, {
      filter: {
        from: "MMK",
        to: methods.getValues("priceUnit"),
      },
      pagination: {
        page: 1,
        pageSize: 1
      }
    }),
    select: data => data.results
  })

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["exchanges", "latest", methods.getValues("priceUnit")],
    })
  }, [methods.watch("priceUnit")])

  const handleOnCloseModalForm = () => {
    dispatch({ type: "CLOSE_MODAL_FORM", payload: "*" })
  }

  const { handleSubmit, register, formState: { errors } } = methods

  const onSubmit: SubmitHandler<CreateProductInput> = (value) => {
    createProduct({
      ...value,
      status: value.isPending 
        ? "Pending" 
        : "Draft"
    })
  }

  const handleOnCalculate = (_: React.MouseEvent<HTMLButtonElement>) => {
    const price = methods.getValues("price")
    const rate = exchangeRate?.[0]?.rate || 1
    methods.setValue("price", price * rate)
  }


  return (
    <>
      <FormProvider {...methods}>
        <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid item md={6} xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <TextField fullWidth {...register("title")} label="Title" error={!!errors.title} helperText={!!errors.title ? errors.title.message : ""} />
              <OutlinedInput 
                fullWidth 
                {...register("price", { valueAsNumber: true })} 
                type="number" 
                placeholder="Price" 
                error={!!errors.price} 
                inputProps={{
                  step: "0.01"
                }}
                // helperText={!!errors.price 
                //   ? errors.price.message 
                //   : "1 dolla ~ 2098.91 kyat"
                // } 
                endAdornment={
                  <InputAdornment position="end">
                    <MuiButton onClick={handleOnCalculate} variant="outlined" size="small">
                      Calculate
                    </MuiButton>
                  </InputAdornment>
                }
              />
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <TextField 
                {...register("priceUnit")} 
                defaultValue={priceUnit[0]}
                name="priceUnit"
                label="Price unit" 
                select
                error={!!errors.priceUnit} 
                helperText={!!errors.priceUnit ? errors.priceUnit.message : ""} 
                fullWidth
              >
                {priceUnit.map(t => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <SpecificationInputField />
              <CatgoryMultiInputField />
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <EditorInputField fieldName="overview" />
              <TextField fullWidth {...register("marketPrice", { valueAsNumber: true })} type="number" label="MarketPrice" error={!!errors.marketPrice} helperText={!!errors.marketPrice ? errors.marketPrice.message : ""} />
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <EditorInputField fieldName="description" />
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <TextField 
                fullWidth 
                {...register("instockStatus")} 
                defaultValue={productStockStatus[2]}
                select
                label="Instock Status" 
                error={!!errors.instockStatus} 
                helperText={!!errors.instockStatus ? errors.instockStatus.message : ""} 
              >
                {productStockStatus.map(status => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <BrandInputField />
              <TextField fullWidth {...register("dealerPrice", { valueAsNumber: true })} type="number" label="Dealer Price" error={!!errors.dealerPrice} helperText={!!errors.dealerPrice ? errors.dealerPrice.message : ""} />
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <TextField fullWidth type="number" {...register("quantity", { valueAsNumber: true })} label="Quantity" error={!!errors.quantity} helperText={!!errors.quantity ? errors.quantity.message : ""} />
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <SalesCategoryMultiInputField />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              label="Request review"
              control={<Switch 
                {...register("isPending")}
              />}
            />
          </Grid>

          <Grid item xs={12}>
            <MuiButton variant="contained" type="submit">Create</MuiButton>
          </Grid>
        </Grid>
      </FormProvider>

      
      {modalForm.field === "brands"
      ? <FormModal field='brands' title='Create new brand' onClose={handleOnCloseModalForm}>
        <CreateBrandForm />
      </FormModal>
      : null}

      {modalForm.field === "categories"
      ? <FormModal field='categories' title='Create new category' onClose={handleOnCloseModalForm}>
        <CreateCategoryForm />
      </FormModal>
      : null}

      {modalForm.field === "sales-categories"
      ? <FormModal field='sales-categories' title='Create new sales category' onClose={handleOnCloseModalForm}>
        <CreateSalesCategoryForm />
      </FormModal>
      : null}
    </>
  )
}
