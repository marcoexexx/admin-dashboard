import { SalesCategoriesInputField } from "@/components/input-fields";
import { MuiButton } from "@/components/ui";
import { useBeforeUnloadPage, useCombineQuerys, useStore } from "@/hooks";
import {
  useCreateProductSalesCategory,
  useUpdateProductSalesCategory,
} from "@/hooks/salsCategory";
import { ProductSalesCategoriesResponse } from "@/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, TextField } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { number, object, string, z } from "zod";

const createProductSalesCategorySchema = object({
  productId: string(),
  salesCategoryId: string(),
  discount: number().max(100).default(0),
});

export type CreateProductSalesCategoryInput = z.infer<
  typeof createProductSalesCategorySchema
>;

interface CreateProductSalesCategoryFromProps {
  productId: string;
  defaultValues?: ProductSalesCategoriesResponse;
  setDefaultValues: (
    value: ProductSalesCategoriesResponse | undefined,
  ) => void;
}

export function CreateProductSalesCategoryForm(
  props: CreateProductSalesCategoryFromProps,
) {
  const { dispatch } = useStore();
  const { productId, defaultValues, setDefaultValues } = props;

  const createProductSalesCategoryMutation =
    useCreateProductSalesCategory();
  const updateProductSalesCategoryMutation =
    useUpdateProductSalesCategory();

  const {
    mutate: createSalesCategory,
    isPending: isPendingCreateSalsCategory,
  } = createProductSalesCategoryMutation;
  const {
    mutate: updateSalesCategory,
    isPending: isPendingCreateProductSalesCategory,
  } = updateProductSalesCategoryMutation;

  const { isSuccess } = useCombineQuerys(
    createProductSalesCategoryMutation,
    updateProductSalesCategoryMutation,
  );

  const methods = useForm<CreateProductSalesCategoryInput>({
    resolver: zodResolver(createProductSalesCategorySchema),
  });

  useBeforeUnloadPage();

  const { handleSubmit, register, formState: { errors }, setValue } =
    methods;

  useEffect(() => {
    if (defaultValues) {
      setValue("salesCategoryId", defaultValues.salesCategoryId);
      setValue("discount", defaultValues.discount);
    }
  }, [defaultValues]);

  useEffect(() => {
    if (isSuccess) {
      setDefaultValues(undefined);
      methods.reset();
    }
  }, [isSuccess]);

  const onSubmit: SubmitHandler<CreateProductSalesCategoryInput> = (
    value,
  ) => {
    if (!!defaultValues) {
      updateSalesCategory({
        productId,
        productSaleCategoryId: defaultValues.id,
        discount: value.discount,
      });
    } else createSalesCategory(value);
    dispatch({ type: "CLOSE_ALL_MODAL_FORM" });
  };

  return (
    <FormProvider {...methods}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          readOnly
          hidden
          value={productId}
          {...register("productId")}
        />
        <SalesCategoriesInputField updateField={!!defaultValues} />
        <TextField
          fullWidth
          {...register("discount", {
            valueAsNumber: true,
          })}
          focused={!!defaultValues}
          type="number"
          inputProps={{
            step: "0.01",
          }}
          label="Discount percent"
          error={!!errors.discount}
          helperText={!!errors.discount ? errors.discount.message : ""}
        />

        <Box>
          <MuiButton
            loading={isPendingCreateSalsCategory
              || isPendingCreateProductSalesCategory}
            variant="contained"
            type="submit"
          >
            {!!defaultValues ? "Update" : "Create"}
          </MuiButton>
        </Box>
      </Box>
    </FormProvider>
  );
}
