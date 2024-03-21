import { queryClient, SuspenseLoader } from "@/components";
import { FormModal } from "@/components/forms";
import {
  BrandInputField,
  CatgoryMultiInputField,
  EditorInputField,
  ImageMultiInputField,
  SpecificationInputField,
} from "@/components/input-fields";
import { productStockStatusLabel } from "@/components/table-labels";
import { MuiButton } from "@/components/ui";
import { CacheResource } from "@/context/cacheKey";
import { useBeforeUnloadPage, useStore } from "@/hooks";
import { useGetExchangeByLatestUnit } from "@/hooks/exchange";
import { useGetProduct, useUpdateProduct } from "@/hooks/product";
import { PriceUnit, ProductStatus, ProductStockStatus } from "@/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Switch,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { boolean, number, object, string, z } from "zod";
import { CreateBrandForm } from "../../brands/forms";
import { CreateCategoryForm } from "../../categories/forms";

const updateProductSchema = object({
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
  discount: number().max(100).default(0),
  isDiscountItem: boolean().default(false),
  instockStatus: z.nativeEnum(ProductStockStatus).default(ProductStockStatus.AskForStock),
  dealerPrice: number().min(0).optional(),
  marketPrice: number().min(0).optional(),
  priceUnit: z.nativeEnum(PriceUnit).default(PriceUnit.MMK),
  quantity: number().min(0).optional(),
  isPending: boolean().default(false),
  status: z.nativeEnum(ProductStatus).default(ProductStatus.Draft),

  images: string().startsWith("http").array().default([]),
  itemCode: string({ required_error: "itemCode is required." }),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

const toUpdateFields: (keyof UpdateProductInput)[] = [
  "title",
  "priceUnit",
  "price",
  "discount",
  "specification",
  "overview",
  "categories",
  "marketPrice",
  "instockStatus",
  "description",
  "quantity",
  "dealerPrice",
  "isPending",
];

export function UpdateProductForm() {
  const { state: { modalForm } } = useStore();

  const { productId } = useParams();

  const methods = useForm<UpdateProductInput>({
    resolver: zodResolver(updateProductSchema),
  });

  useBeforeUnloadPage();

  // Quries
  const productQuery = useGetProduct({
    id: productId,
    include: {
      specification: true,
      likedUsers: true,
      brand: true,
      categories: {
        include: {
          category: true,
        },
      },
      salesCategory: {
        include: {
          salesCategory: true,
        },
      },

      _count: true,
    },
  });
  const exchangesQuery = useGetExchangeByLatestUnit(methods.getValues("priceUnit"));

  // Mutations
  const updateProductMutation = useUpdateProduct();

  // Extraction
  const product = productQuery.try_data.ok_or_throw();
  const productFetchStatus = productQuery.fetchStatus;
  const exchangeRate = exchangesQuery.try_data.ok_or_throw();

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: [CacheResource.Exchange, "latest", methods.getValues("priceUnit")],
    });
  }, [methods.watch("priceUnit")]);

  useEffect(() => {
    if (productQuery.isSuccess && product && productFetchStatus === "idle") {
      toUpdateFields.forEach(key => {
        const value = key === "isPending"
          ? product.status === "Pending"
          : key === "categories"
          ? product[key]?.map(({ category: { id } }) => id)
          : product[key];

        methods.setValue(key, value ? value : undefined);
      });
      if (product.brandId) methods.setValue("brandId", product.brandId);
      if (product.images) methods.setValue("images", product.images);
      methods.setValue("itemCode", product.itemCode);
    }
  }, [productQuery.isSuccess, productFetchStatus]);

  const { handleSubmit, register, formState: { errors } } = methods;

  const onSubmit: SubmitHandler<UpdateProductInput> = (value) => {
    if (!productId) return;

    if (product?.status !== "Draft") return;

    updateProductMutation.mutate({
      id: productId,
      payload: {
        ...value,
        status: value.isPending ? "Pending" : value.status,
      },
    });
  };

  const handleOnCalculate = (_: React.MouseEvent<HTMLButtonElement>) => {
    const price = methods.getValues("price");
    const rate = exchangeRate?.[0]?.rate || 1;
    methods.setValue("price", price * rate);
  };

  // TODO: Skeleton table loader
  if (!product || productQuery.isLoading) return <SuspenseLoader />;

  return (
    <>
      <FormProvider {...methods}>
        <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid item md={6} xs={12}>
            <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
              <TextField
                fullWidth
                {...register("title")}
                label="Title"
                error={!!errors.title}
                helperText={!!errors.title ? errors.title.message : ""}
              />
              <OutlinedInput
                fullWidth
                {...register("price", { valueAsNumber: true })}
                type="number"
                placeholder="Price"
                error={!!errors.price}
                inputProps={{
                  step: "0.01",
                }}
                // helperText={!!errors.price
                //   ? errors.price.message
                //   : "1 dolla ~ 2098.91 kyat"
                // }
                sx={{
                  my: 1,
                }}
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
            <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
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
              <TextField
                fullWidth
                {...register("dealerPrice", { valueAsNumber: true })}
                type="number"
                label="Dealer Price"
                error={!!errors.dealerPrice}
                helperText={!!errors.dealerPrice ? errors.dealerPrice.message : ""}
              />
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
              <TextField
                fullWidth
                {...register("marketPrice", { valueAsNumber: true })}
                type="number"
                label="MarketPrice"
                error={!!errors.marketPrice}
                helperText={!!errors.marketPrice ? errors.marketPrice.message : ""}
              />
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
              <CatgoryMultiInputField updateField />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
              <EditorInputField fieldName="overview" />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
              <EditorInputField fieldName="description" />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
              <ImageMultiInputField />
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
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
                    {productStockStatusLabel[status]}
                  </MenuItem>
                ))}
              </TextField>
              <BrandInputField updateField />
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
              <TextField
                fullWidth
                type="number"
                {...register("quantity", { valueAsNumber: true })}
                label="Quantity"
                error={!!errors.quantity}
                helperText={!!errors.quantity ? errors.quantity.message : ""}
              />
              <TextField
                fullWidth
                type="number"
                {...register("discount", { valueAsNumber: true })}
                inputProps={{
                  step: "0.01",
                }}
                label="Discount"
                error={!!errors.discount}
                helperText={!!errors.discount ? errors.discount.message : ""}
              />
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
              {/* Image upload */}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
              <SpecificationInputField />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              label="Discounted item"
              control={
                <Switch
                  {...register("isDiscountItem")}
                />
              }
            />
            <FormControlLabel
              label="Request review"
              control={
                <Switch
                  {...register("isPending")}
                />
              }
            />
          </Grid>

          {product.status !== "Draft"
            ? (
              <Grid item xs={12}>
                <Alert severity="warning">Update not permitted during the {product.status} process.</Alert>
              </Grid>
            )
            : null}

          <Grid item xs={12}>
            <MuiButton
              variant="contained"
              type="submit"
              loading={updateProductMutation.isPending}
              disabled={product.status !== "Draft"}
            >
              Save
            </MuiButton>
          </Grid>
        </Grid>
      </FormProvider>

      {modalForm.field === "create-brand"
        ? (
          <FormModal field="create-brand" title="Create new brand">
            <CreateBrandForm />
          </FormModal>
        )
        : null}

      {modalForm.field === "create-category"
        ? (
          <FormModal field="create-category" title="Create new category">
            <CreateCategoryForm />
          </FormModal>
        )
        : null}
    </>
  );
}
