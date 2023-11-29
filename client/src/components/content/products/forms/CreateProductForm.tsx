import { Box, Grid, InputAdornment, MenuItem, OutlinedInput, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { number, object, string, z } from "zod";
import { BrandInputField, CatgoryMultiInputField, EditorInputField, SalesCategoryMultiInputField } from "@/components/input-fields";
import { useMutation } from "@tanstack/react-query";
import { createProductFn } from "@/services/productsApi";
import { useStore } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { queryClient } from "@/components";
import { MuiButton } from "@/components/ui";

const productTypes = ["Switch", "Accessory", "Router", "Wifi"]
const instockStatus = ["InStock", "OutOfStock", "AskForStock"]
const priceUnit = ["MMK", "USD"]

const createProductSchema = object({
  price: number({ required_error: "Price is required "}),
  brandId: string({ required_error: "Brand is required" })
    .min(2).max(128),
  title: string({ required_error: "Brand is required" })
    .min(2).max(128),
  specification: string({ required_error: "Brand is required" })
    .min(2).max(5000),
  overview: string({ required_error: "Brand is required" })
    .min(2).max(5000),
  features: string({ required_error: "Features is required" })
    .min(2).max(5000),
  warranty: number({ required_error: "Price is required "}),
  categories: string().array().default([]),
  colors: string({ required_error: "Brand is required" })
    .min(2).max(128),
  instockStatus: z.enum(["InStock", "OutOfStock", "AskForStock"]).default("AskForStock"),
  description: string({ required_error: "Brand is required" })
    .min(2).max(5000),
  type: z.enum(["Switch", "Accessory", "Router", "Wifi"]),
  dealerPrice: number().min(0),
  // images: z.any(),
  marketPrice: number().min(0),
  discount: number().min(0),
  priceUnit: z.enum(["MMK", "USD"]),
  salesCategory: string().array(),
  quantity: number().min(0),
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


  // useEffect(() => {

  // }, [methods.watch("priceUnit")])

  const { handleSubmit, register, formState: { errors } } = methods

  const onSubmit: SubmitHandler<CreateProductInput> = (value) => {
    createProduct(value)
  }

  const handleOnCalculate = (_: React.MouseEvent<HTMLButtonElement>) => {
    const unit = methods.getValues("priceUnit")
    if (unit === "USD")  {
      const price = methods.getValues("price")
      const fatchedUsd = 2098.91
      methods.setValue("price", price * fatchedUsd)
    }

  }

  return (
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
            <TextField fullWidth type="number" {...register("warranty", { valueAsNumber: true })} label="Warranty" error={!!errors.warranty} helperText={!!errors.warranty ? errors.warranty.message : ""} />
          </Box>
        </Grid>

        <Grid item md={6} xs={12}>
          <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
            <EditorInputField fieldName="specification" />
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
            <TextField fullWidth {...register("colors")} label="Color" error={!!errors.colors} helperText={!!errors.colors ? errors.colors.message : ""} />
            <EditorInputField fieldName="description" />
          </Box>
        </Grid>

        <Grid item md={6} xs={12}>
          <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
            <TextField 
              fullWidth 
              {...register("instockStatus")} 
              defaultValue={instockStatus[2]}
              select
              label="Instock Status" 
              error={!!errors.instockStatus} 
              helperText={!!errors.instockStatus ? errors.instockStatus.message : ""} 
            >
              {instockStatus.map(status => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
            <EditorInputField fieldName="features" />
          </Box>
        </Grid>

        <Grid item md={6} xs={12}>
          <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
            <TextField 
              fullWidth 
              {...register("type")} 
              defaultValue={productTypes[0]}
              select
              label="Product Type" 
              error={!!errors.type} 
              helperText={!!errors.type ? errors.type.message : ""} 
            >
              {productTypes.map(t => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Grid>

        <Grid item md={6} xs={12}>
          <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
            <BrandInputField />
          </Box>
        </Grid>

        <Grid item md={6} xs={12}>
          <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
            <TextField fullWidth type="number" {...register("quantity", { valueAsNumber: true })} label="Quantity" error={!!errors.quantity} helperText={!!errors.quantity ? errors.quantity.message : ""} />
            <TextField fullWidth {...register("discount", { valueAsNumber: true })} label="Discount" type="number" error={!!errors.discount} helperText={!!errors.discount ? errors.discount.message : ""} />
          </Box>
        </Grid>

        <Grid item md={6} xs={12}>
          <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
            <SalesCategoryMultiInputField />
            <TextField fullWidth {...register("dealerPrice", { valueAsNumber: true })} type="number" label="Dealer Price" error={!!errors.dealerPrice} helperText={!!errors.dealerPrice ? errors.dealerPrice.message : ""} />
          </Box>
        </Grid>

        {/* <Grid item xs={6}> */}
        {/*   <UploadProductImage /> */}
        {/* </Grid> */}

        <Grid item xs={12}>
          <MuiButton variant="contained" type="submit">Create</MuiButton>
        </Grid>
      </Grid>
    </FormProvider>
  )
}