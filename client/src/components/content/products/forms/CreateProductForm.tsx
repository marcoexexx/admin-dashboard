import { Box, FormControlLabel, FormHelperText, Grid, InputAdornment, MenuItem, OutlinedInput, Switch, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { MuiButton } from "@/components/ui";
import { FormModal } from "@/components/forms";
import { CreateBrandForm } from "../../brands/forms";
import { CreateCategoryForm } from "../../categories/forms";
import { BrandInputField, CatgoryMultiInputField, EditorInputField, SpecificationInputField } from "@/components/input-fields";
import { PriceUnit, ProductStatus, ProductStockStatus } from "@/services/types";
import { CacheResource } from "@/context/cacheKey";
import { zodResolver } from "@hookform/resolvers/zod";
import { boolean, number, object, string, z } from "zod";
import { useStore } from "@/hooks";
import { queryClient } from "@/components";
import { useEffect } from "react";
import { useCreateProduct } from "@/hooks/product";
import { useGetExchangeByLatestUnit } from "@/hooks/exchange";
import { tryParseInt } from "@/libs/result/std";


const createProductSchema = object({
  price: number({ required_error: "Price is required " }),
  brandId: string({ required_error: "Brand is required" })
    .min(2).max(128),
  title: string({ required_error: "Brand is required" })
    .min(2).max(128),
  specification: object({
    name: string({ required_error: "Specification name is required" }),
    value: string({ required_error: "Specification value is required" }),
  }).array(),
  overview: string().max(5000).optional(),
  description: string().max(5000).optional(),
  categories: string().array().default([]),
  instockStatus: z.nativeEnum(ProductStockStatus).default("AskForStock"),
  dealerPrice: number().min(0).optional(),
  marketPrice: number().min(0).optional(),
  priceUnit: z.nativeEnum(PriceUnit).default("MMK"),
  salesCategory: object({}).array().default([]),
  discount: number().max(100).default(0),
  isDiscountItem: boolean().default(false),
  quantity: number().min(0),
  isPending: boolean().default(false),
  status: z.nativeEnum(ProductStatus).default("Draft"),

  itemCode: string().nullable().optional(),
})

export type CreateProductInput = z.infer<typeof createProductSchema>

export function CreateProductForm() {
  const { state: { modalForm } } = useStore()

  const methods = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema)
  })

  const { handleSubmit, register, formState: { errors } } = methods

  // Mutations
  const createProductMutation = useCreateProduct()

  // Queries
  const exchangesQuery = useGetExchangeByLatestUnit(methods.getValues("priceUnit"))

  // Extraction
  const exchangeRate = exchangesQuery.try_data.ok_or_throw()


  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: [CacheResource.Exchange, "latest", methods.getValues("priceUnit")],
    })
  }, [methods.watch("priceUnit")])


  // Calculate percent discount
  useEffect(() => {
    const price = methods.getValues("price")
    const marketPrice = methods.getValues("marketPrice")

    if (!price || !!marketPrice) methods.setValue("discount", 0)
    if (price && marketPrice) methods.setValue("discount", ((marketPrice - price) / marketPrice) * 100)
  }, [methods.watch("marketPrice"), methods.watch("price")])


  const onSubmit: SubmitHandler<CreateProductInput> = (value) => {
    createProductMutation.mutate({
      ...value,
      status: value.isPending
        ? "Pending"
        : "Draft",
      salesCategory: []
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
                sx={{
                  my: 1
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <MuiButton onClick={handleOnCalculate} variant="outlined" size="small">
                      Convert to MMK
                    </MuiButton>
                  </InputAdornment>
                }
              />
              {!!errors.price ? <FormHelperText error id="price-error"></FormHelperText> : <FormHelperText>{`1 ${methods.getValues("priceUnit")} ~ ${exchangeRate?.[0]?.rate} MMK`}</FormHelperText>}
            </Box>
          </Grid>


          <Grid item md={6} xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <TextField
                {...register("priceUnit")}
                defaultValue={PriceUnit.MMK}
                name="priceUnit"
                label="Price unit"
                select
                error={!!errors.priceUnit}
                helperText={!!errors.priceUnit ? errors.priceUnit.message : ""}
                fullWidth
              >
                {(Object.keys(PriceUnit) as PriceUnit[]).map(t => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </TextField>
              <TextField fullWidth {...register("dealerPrice", { setValueAs: (v) => !v ? undefined : tryParseInt(v, 10).unwrap_or(0) })} type="number" label="Dealer Price" error={!!errors.dealerPrice} helperText={!!errors.dealerPrice ? errors.dealerPrice.message : ""} />
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <TextField fullWidth {...register("marketPrice", { setValueAs: (v) => !v ? undefined : tryParseInt(v, 10).unwrap_or(0) })} type="number" label="MarketPrice" error={!!errors.marketPrice} helperText={!!errors.marketPrice ? errors.marketPrice.message : ""} />
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <CatgoryMultiInputField />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <EditorInputField fieldName="overview" />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <EditorInputField fieldName="description" />
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <TextField
                fullWidth
                {...register("instockStatus")}
                defaultValue={ProductStockStatus.AskForStock}
                select
                label="Instock Status"
                error={!!errors.instockStatus}
                helperText={!!errors.instockStatus ? errors.instockStatus.message : ""}
              >
                {(Object.keys(ProductStockStatus) as ProductStockStatus[]).map(status => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
              <BrandInputField />
              <TextField fullWidth type="number" {...register("quantity", { valueAsNumber: true })} label="Quantity" error={!!errors.quantity} helperText={!!errors.quantity ? errors.quantity.message : ""} />
              <TextField
                fullWidth
                focused
                type="number"
                {...register("discount", { valueAsNumber: true })}
                inputProps={{
                  step: "0.01"
                }}
                label="Discount" error={!!errors.discount} helperText={!!errors.discount ? errors.discount.message : ""} />
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              {/* Image upload */}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <SpecificationInputField />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              label="Discounted item"
              control={<Switch
                {...register("isDiscountItem")}
              />}
            />
            <FormControlLabel
              label="Request review"
              control={<Switch
                {...register("isPending")}
              />}
            />
          </Grid>

          <Grid item xs={12}>
            <MuiButton variant="contained" type="submit" loading={createProductMutation.isPending}>Create</MuiButton>
          </Grid>
        </Grid>
      </FormProvider>


      {modalForm.field === "brands"
        ? <FormModal field='brands' title='Create new brand'>
          <CreateBrandForm />
        </FormModal>
        : null}

      {modalForm.field === "categories"
        ? <FormModal field='categories' title='Create new category'>
          <CreateCategoryForm />
        </FormModal>
        : null}
    </>
  )
}
